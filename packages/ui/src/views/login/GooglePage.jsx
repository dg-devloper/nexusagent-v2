import { Google } from '@mui/icons-material'
import { Box, Button } from '@mui/material'
import authApi from '@/api/auth'

export default function GooglePage() {
    const handleClick = async () => {
        try {
            const response = await authApi.oauth()

            console.log(response)
            if (response.status == 200) {
                const url = response.data.url
                window.location.replace(url)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button fullWidth variant='outlined' onClick={handleClick} startIcon={<Google />}>
                Sign in with Google
            </Button>
        </Box>
    )
}
