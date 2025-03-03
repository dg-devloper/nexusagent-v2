import * as React from 'react'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import { Grid, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'

import { LANGUAGES } from '@/constant/index'

export default function LangSection() {
    const theme = useTheme()
    const [anchorEl, setAnchorEl] = React.useState(null)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined

    return (
        <div>
            <Button
                aria-describedby={id}
                variant='text'
                onClick={handleClick}
                sx={{
                    padding: '.5rem .5rem',
                    borderRadius: '20px',
                    color: 'rgb(33, 43, 54)',
                    backgroundColor: 'rgba(145, 158, 171, 0.08)',
                    '&:hover': {
                        backgroundColor: 'rgba(145, 158, 171, 0.12)'
                    }
                }}
            >
                <Grid container sx={{ alignItems: 'center', gap: '.6rem', padding: '0 .5rem' }}>
                    <Grid item>IDN</Grid>
                    <Grid item sx={{ display: 'flex' }}>
                        {anchorEl ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                    </Grid>
                </Grid>
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                PaperProps={{
                    sx: {
                        mt: 1,
                        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
                        borderRadius: '8px'
                    }
                }}
            >
                <List sx={{ p: 1 }}>
                    {LANGUAGES.map((lang) => (
                        <ListItem key={lang.code} disablePadding>
                            <ListItemButton 
                                sx={{ 
                                    padding: '.5rem 1rem', 
                                    borderRadius: '6px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(145, 158, 171, 0.08)'
                                    }
                                }}
                            >
                                <ListItemText 
                                    primary={lang.label}
                                    sx={{
                                        '& .MuiTypography-root': {
                                            fontSize: '0.875rem',
                                            color: 'rgb(33, 43, 54)'
                                        }
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Popover>
        </div>
    )
}
