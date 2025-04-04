import { Box, Typography, Chip, Grid, Paper, CircularProgress } from '@mui/material'

const WhatsAppStatus = () => {
    // Contoh data status (nanti bisa diambil dari API)
    const status = {
        isConnected: true,
        lastSync: '2024-03-26 15:30:00',
        messageCount: 150,
        errorCount: 2
    }

    return (
        <Box>
            <Typography variant='h6' gutterBottom>
                Status Koneksi
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Box display='flex' alignItems='center' gap={2}>
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: status.isConnected ? 'success.main' : 'error.main'
                                }}
                            />
                            <Typography>Status: {status.isConnected ? 'Terhubung' : 'Terputus'}</Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant='body2' color='text.secondary'>
                            Sinkronisasi Terakhir: {status.lastSync}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Box display='flex' alignItems='center' gap={1}>
                            <Typography>Total Pesan:</Typography>
                            <Chip label={status.messageCount} color='primary' size='small' />
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Box display='flex' alignItems='center' gap={1}>
                            <Typography>Error:</Typography>
                            <Chip label={status.errorCount} color='error' size='small' />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

export default WhatsAppStatus
