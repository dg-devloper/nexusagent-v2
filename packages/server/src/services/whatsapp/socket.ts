import { default as makeWASocket, DisconnectReason } from 'baileys'
import { Boom } from '@hapi/boom'
import pino from 'pino'
import JsonWebToken from 'jsonwebtoken'
import { Server } from 'socket.io'

import usersService from '../../services/users'
import { getRunningExpressApp } from '../../utils/getRunningExpressApp'
import { Whatsapp } from '../../database/entities/Whatsapp'
import { App } from '../../index'
import { getMySQLAuthState } from '../../utils/mysqlAuth'

const logger = pino({ level: 'silent' })

export async function createSession(
    sessionId: string,
    chatflowId: string,
    userId: string,
    socket: Server | undefined = undefined,
    socketId: string | undefined = undefined,
    appServer: App | undefined = undefined
): Promise<{
    id: string
    socket: ReturnType<typeof makeWASocket>
    qr: string
    isActive: boolean
}> {
    /* eslint-disable */
    const { state, saveCreds, removeCreds } = await getMySQLAuthState(sessionId)

    const sock = makeWASocket({
        auth: state,
        logger: logger,
        connectTimeoutMs: 60000,
        retryRequestDelayMs: 250,
        browser: ['Chrome (Linux)', '', '']
    })

    // Menangani koneksi
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update

        if (qr) {
            if (socketId && socket) {
                socket.to(socketId).emit('qrcode', { action: 'generate', qrcode: qr, success: true })
            }
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log(`Koneksi terputus untuk sesi ${sessionId}, mencoba menghubungkan kembali:`, shouldReconnect)

            if (shouldReconnect) {
                await createSession(sessionId, chatflowId, userId, socket, socketId, appServer)
            } else {
                console.log(`Sesi ${sessionId} telah logout, silakan scan ulang QR code`)
            }
        } else if (connection === 'open') {
            await saveCreds()
            // Update QR di sessions setelah terhubung
            if (socketId && socket) {
                socket.to(socketId).emit('waconnect', { connected: true, success: true })
            }

            if (appServer) {
                // Check apakah data chatflow sudah ada di database
                const chatflow = await appServer.AppDataSource.getRepository(Whatsapp).findOneBy({ chatflowId: chatflowId })
                if (!chatflow) {
                    const wa = await appServer.AppDataSource.getRepository(Whatsapp).create({
                        chatflowId: chatflowId,
                        userId: userId,
                        sessionId: sessionId,
                        isActive: true,
                        phoneNumber: sock.user?.id.split(':')[0]
                    })
                    await appServer.AppDataSource.getRepository(Whatsapp).save(wa)
                }
            }

            console.log('Connected to whatsapp')
        }
    })

    // Menangani pesan masuk
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0]
        if (!m.message) return

        if (m.key.fromMe) return

        const message = m.message.extendedTextMessage?.text || m.message.conversation
        const id = m.key.remoteJid
        const response = await query(message!, chatflowId)

        console.log('Send message')
        sock.sendMessage(id!, { text: response.text })
    })

    // Menangani error
    sock.ev.on('creds.update', async () => {
        console.log('creds.update')
        await saveCreds()
    })

    return {
        id: sessionId,
        socket: sock,
        qr: '',
        isActive: false
    }
}

export const upsertSession = async (token: string, io: Server, socketId: string, chatflowId: string) => {
    try {
        // Map untuk menyimpan semua sesi aktif
        const userId = await verifUser(token)
        if (userId) {
            const appServer = getRunningExpressApp()
            const sessionId = generateRandomString()
            const session = await createSession(sessionId, chatflowId, userId, io, socketId, appServer)
        }
    } catch (err) {
        io.to(socketId).emit('qrcode', { action: 'generate', message: 'Failed generate barcode', success: false })
    }
}

export const activateAllWhatsappSession = async () => {
    const appServer = getRunningExpressApp()
    const sessions = await appServer.AppDataSource.getRepository(Whatsapp).find()

    sessions.forEach(async (session) => {
        await createSession(session.sessionId, session.chatflowId, session.userId)
    })
}

const verifUser = async (token: string) => {
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length)
    }
    if (!token) {
        throw new Error('No token Provided')
    }

    let decryptToken = JsonWebToken.verify(token, process.env.JWT_SECRET!) as JsonWebToken.JwtPayload
    let userId = decryptToken.userId
    let exp = decryptToken.exp!

    if (exp < Date.now().valueOf() / 1000) {
        throw new Error('Token expired')
    }

    const user = await usersService.getUserById(userId)
    if (!user) {
        throw new Error('User not found')
    }

    if (user.role !== 'ADMIN') {
        if (user.expiredAt && new Date(user.expiredAt).valueOf() < Date.now().valueOf()) {
            throw new Error('User account expired')
        }
    }
    return userId
}

export const generateRandomString = (): string => {
    const timestamp = Date.now().toString()
    const randomChars = Math.random().toString(36).substring(2, 8)
    return `${timestamp}-${randomChars}`
}

async function query(question: string, chatflowId: string) {
    const response = await fetch(`http://localhost:3000/api/v1/prediction/${chatflowId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question })
    })
    const result = await response.json()
    return result
}

// Fungsi untuk menutup sesi WhatsApp
// export async function closeSession(sessionId: string): Promise<void> {
//     try {
//         const session = sessions.get(sessionId)
//         if (session) {
//             // Menutup koneksi WhatsApp
//             if (session.socket) {
//                 await session.socket.logout()
//                 session.socket.end()
//             }

//             // Menghapus sesi dari map
//             sessions.delete(sessionId)
//             console.log(`Sesi ${sessionId} telah ditutup`)
//         } else {
//             console.log(`Sesi ${sessionId} tidak ditemukan`)
//         }
//     } catch (error) {
//         console.error(`Error saat menutup sesi ${sessionId}:`, error)
//         throw error
//     }
// }
