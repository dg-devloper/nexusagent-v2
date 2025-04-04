import { Typography, Paper, Grid } from '@mui/material'
import WhatsAppConfig from '../../ui-component/whatsapp/WhatsAppConfig'
import WhatsAppStatus from '../../ui-component/whatsapp/WhatsAppStatus'
import WhatsAppMessages from '../../ui-component/whatsapp/WhatsAppMessages'

const WhatsAppView = () => {
    return (
        <>
            <Typography variant='h4' component='h1' gutterBottom>
                Integrasi WhatsApp
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                        <WhatsAppConfig />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3 }}>
                        <WhatsAppStatus />
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <WhatsAppMessages />
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}

export default WhatsAppView
