import { useState } from 'react'
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    IconButton,
    Chip
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import DeleteIcon from '@mui/icons-material/Delete'

const WhatsAppMessages = () => {
    const [newMessage, setNewMessage] = useState('')

    // Contoh data pesan (nanti bisa diambil dari API)
    const messages = [
        {
            id: 1,
            sender: '+628123456789',
            message: 'Halo, selamat datang!',
            timestamp: '2024-03-26 15:30:00',
            status: 'sent'
        },
        {
            id: 2,
            sender: '+628987654321',
            message: 'Terima kasih atas bantuannya',
            timestamp: '2024-03-26 15:35:00',
            status: 'received'
        }
    ]

    const handleSendMessage = () => {
        if (!newMessage.trim()) return
        // Implementasi pengiriman pesan
        // console.log('Mengirim pesan:', newMessage)
        setNewMessage('')
    }

    const handleDeleteMessage = (id) => {
        // Implementasi penghapusan pesan
        // console.log('Menghapus pesan:', id)
    }

    return (
        <Box>
            <Typography variant='h6' gutterBottom>
                Daftar Pesan
            </Typography>

            <Box sx={{ mb: 3 }}>
                <Box display='flex' gap={1}>
                    <TextField
                        fullWidth
                        label='Pesan Baru'
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <IconButton color='primary' onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <SendIcon />
                    </IconButton>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Pengirim</TableCell>
                            <TableCell>Pesan</TableCell>
                            <TableCell>Waktu</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {messages.map((msg) => (
                            <TableRow key={msg.id}>
                                <TableCell>{msg.sender}</TableCell>
                                <TableCell>{msg.message}</TableCell>
                                <TableCell>{msg.timestamp}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={msg.status === 'sent' ? 'Terkirim' : 'Diterima'}
                                        color={msg.status === 'sent' ? 'primary' : 'success'}
                                        size='small'
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton size='small' onClick={() => handleDeleteMessage(msg.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default WhatsAppMessages
