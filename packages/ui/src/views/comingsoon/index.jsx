import { Box, Typography, Button, Container, Card, Stack, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IconClock, IconArrowLeft } from '@tabler/icons-react';

const brandColor = '#2b63d9';

const ComingSoon = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md" sx={{ mt: 8 }}>
            <Card 
                sx={{ 
                    borderRadius: 3,
                    boxShadow: `0 0 2px 0 ${alpha(brandColor, 0.2)}, 0 12px 24px -4px ${alpha(brandColor, 0.12)}`,
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                <Box 
                    sx={{ 
                        background: `linear-gradient(135deg, ${brandColor} 0%, ${alpha(brandColor, 0.7)} 100%)`,
                        height: '8px'
                    }} 
                />
                
                <Stack 
                    spacing={4} 
                    sx={{ 
                        textAlign: 'center', 
                        py: 8,
                        px: 4,
                        position: 'relative',
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: `radial-gradient(circle at top right, ${alpha(brandColor, 0.05)} 0%, transparent 70%)`,
                            pointerEvents: 'none'
                        }
                    }}
                >
                    <Box sx={{ mb: 2 }}>
                        <IconClock 
                            size={80} 
                            stroke={1.5}
                            color={brandColor}
                            style={{ 
                                opacity: 0.9,
                                filter: `drop-shadow(0 4px 6px ${alpha(brandColor, 0.3)})`
                            }}
                        />
                    </Box>
                    
                    <Typography 
                        variant="h1" 
                        sx={{ 
                            fontWeight: 600,
                            background: `linear-gradient(135deg, ${brandColor} 0%, ${alpha(brandColor, 0.7)} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1
                        }}
                    >
                        Coming Soon
                    </Typography>
                    
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            color: 'text.secondary',
                            width: '100%',
                            textAlign: 'center',
                            lineHeight: 1.6
                        }}
                    >
                        Halaman ini sedang dalam pengembangan dan akan segera tersedia.
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                        <Button 
                            variant="contained" 
                            size="large"
                            startIcon={<IconArrowLeft />}
                            onClick={() => navigate('/')}
                            sx={{
                                bgcolor: brandColor,
                                borderRadius: '12px',
                                py: 1.5,
                                px: 4,
                                textTransform: 'none',
                                boxShadow: `0 4px 14px ${alpha(brandColor, 0.4)}`,
                                '&:hover': {
                                    bgcolor: alpha(brandColor, 0.9),
                                    boxShadow: `0 6px 20px ${alpha(brandColor, 0.6)}`
                                }
                            }}
                        >
                            Kembali ke Beranda
                        </Button>
                    </Box>
                </Stack>
            </Card>
        </Container>
    );
};

export default ComingSoon;
