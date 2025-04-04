import { useState } from 'react'
import { Box, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material'

const WhatsAppConfig = () => {
    const [config, setConfig] = useState({
        phoneNumber: '',
        apiKey: '',
        webhookUrl: '',
        provider: 'whatsapp-business-api'
    })
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setConfig((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!config.phoneNumber || !config.apiKey) {
            setError('Nomor telepon dan API Key harus diisi')
            return
        }
        // onSave?.(config)
        setError('')
    }

    return (
        <Box component='form' onSubmit={handleSubmit}>
            <Typography variant='h6' gutterBottom>
                Konfigurasi WhatsApp
            </Typography>

            {error && (
                <Alert severity='error' sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Provider</InputLabel>
                <Select name='provider' value={config.provider} label='Provider' onChange={handleChange}>
                    <MenuItem value='whatsapp-business-api'>WhatsApp Business API</MenuItem>
                    <MenuItem value='twilio'>Twilio</MenuItem>
                    <MenuItem value='messagebird'>MessageBird</MenuItem>
                </Select>
            </FormControl>

            <TextField
                fullWidth
                label='Nomor Telepon'
                name='phoneNumber'
                value={config.phoneNumber}
                onChange={handleChange}
                margin='normal'
                required
            />

            <TextField
                fullWidth
                label='API Key'
                name='apiKey'
                type='password'
                value={config.apiKey}
                onChange={handleChange}
                margin='normal'
                required
            />

            <TextField
                fullWidth
                label='Webhook URL'
                name='webhookUrl'
                value={config.webhookUrl}
                onChange={handleChange}
                margin='normal'
                helperText='URL untuk menerima notifikasi pesan masuk'
            />

            <Button type='submit' variant='contained' color='primary' fullWidth sx={{ mt: 3 }}>
                Simpan Konfigurasi
            </Button>
        </Box>
    )
}

export default WhatsAppConfig
