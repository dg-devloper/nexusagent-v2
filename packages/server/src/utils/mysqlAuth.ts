import { useMySQLAuthState } from 'mysql-baileys'

/* eslint-disable */
export const getMySQLAuthState = async (sessionId: string) => {
    return await useMySQLAuthState({
        session: sessionId,
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT || '3306'),
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'flowise',
        tableName: 'wa_session'
    })
}
