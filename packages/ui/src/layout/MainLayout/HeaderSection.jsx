import PropTypes from 'prop-types'
import { Box, Stack, Grid, Typography, OutlinedInput } from '@mui/material'
import { IconSearch } from '@tabler/icons-react'
import { StyledButton } from '@/ui-component/button/StyledButton'
import { IconPlus } from '@tabler/icons-react'
import { useTheme } from '@emotion/react'

const HeaderSection = ({ children, onSearchChange, onButtonClick, title, icon }) => {
    const theme = useTheme()

    return (
        <Box
            sx={{
                borderRadius: '10px',
                backgroundColor: '#F6F6F6',
                padding: '4rem',
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1rem'
            }}
        >
            <Stack spacing={1}>
                <Grid container justifyContent='center' alignItems='center' gap={2}>
                    <Grid>
                        <Box sx={{ backgroundColor: '#1F64FF', color: 'white', padding: '.3rem .5rem', borderRadius: '7px' }}>{icon}</Box>
                    </Grid>
                    <Grid>
                        <Typography variant='h1'>{title}</Typography>
                    </Grid>
                </Grid>

                <Typography sx={{ widht: '100%' }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium quos, qui minus voluptatum corrupti
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', height: '40px', gap: '1rem' }}>
                    <OutlinedInput
                        size='small'
                        sx={{
                            minWidth: '80%',
                            height: '100%',
                            borderRadius: 2,
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderRadius: 2
                            }
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

                    <StyledButton variant='contained' onClick={onButtonClick} startIcon={<IconPlus />} sx={{ borderRadius: 2, height: 40 }}>
                        Add
                    </StyledButton>
                </Box>
            </Stack>

            {children}
        </Box>
    )
}

HeaderSection.propTypes = {
    children: PropTypes.node,
    onSearchChange: PropTypes.func,
    onButtonClick: PropTypes.func,
    title: PropTypes.string,
    icon: PropTypes.node
}

export default HeaderSection
