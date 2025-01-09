import PropTypes from 'prop-types'
import { Box, Stack, Grid, Typography, OutlinedInput } from '@mui/material'
import { IconSearch } from '@tabler/icons-react'
import { useTheme } from '@emotion/react'

const HeaderSection = ({ children, onSearchChange, title, subtitle, icon }) => {
    const theme = useTheme()

    return (
        <Box
            sx={{
                borderRadius: '10px',
                backgroundColor: '#F6F6F6',
                padding: '4rem',
                marginTop: '1rem'
            }}
        >
            <Stack spacing={2}>
                <Grid container justifyContent='center' alignItems='center' gap={2}>
                    <Grid>
                        <Box
                            sx={{
                                backgroundColor: '#1F64FF',
                                color: 'white',
                                padding: '.5rem .6rem',
                                borderRadius: '7px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            {icon}
                        </Box>
                    </Grid>
                    <Grid>
                        <Typography variant='h1' sx={{ color: theme.palette['primary'].main }}>
                            {title}
                        </Typography>
                    </Grid>
                </Grid>

                <Typography sx={{ widht: '100%', textAlign: 'center' }}>{subtitle}</Typography>

                <Box
                    sx={{
                        display: 'flex',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}
                >
                    <OutlinedInput
                        size='small'
                        sx={{
                            borderRadius: 2,
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderRadius: 2
                            },
                            width: '325px'
                        }}
                        startAdornment={
                            <Box
                                sx={{
                                    color: theme.palette.grey[400],
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 1
                                }}
                            >
                                <IconSearch style={{ color: 'inherit', width: 16, height: 16 }} />
                            </Box>
                        }
                        variant='outlined'
                        type='search'
                        placeholder='Search name or category'
                        onChange={onSearchChange}
                    />

                    {children}
                </Box>
            </Stack>
        </Box>
    )
}

HeaderSection.propTypes = {
    children: PropTypes.node,
    onSearchChange: PropTypes.func,
    onButtonClick: PropTypes.func,
    title: PropTypes.string,
    icon: PropTypes.node,
    subtitle: PropTypes.string
}

export default HeaderSection
