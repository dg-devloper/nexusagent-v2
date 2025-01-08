import * as React from 'react'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import { Grid, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useTheme } from '@emotion/react'
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
                variant='contained'
                onClick={handleClick}
                sx={{
                    padding: '.5rem .5rem',
                    borderRadius: '20px',
                    backgroundColor: theme.palette['dark']['900'],
                    '&:hover': {
                        backgroundColor: theme.palette['dark']['900']
                    }
                }}
            >
                <Grid container sx={{ alignItems: 'center', gap: '.6rem', padding: '0 .5rem' }}>
                    {/* <Grid item>
                        <Avatar alt='Flag Logo' sx={{ width: 24, height: 24 }} />
                    </Grid> */}
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
            >
                <List>
                    {LANGUAGES.map((lang) => (
                        <ListItem key={lang.code}>
                            <ListItemButton sx={{ padding: '.3rem 1rem', borderRadius: '6px' }}>
                                <ListItemText>{lang.label}</ListItemText>
                            </ListItemButton>
                        </ListItem>
                    ))}

                    {/* <ListItem>
                        <ListItemButton sx={{ padding: '.3rem 1rem', borderRadius: '6px' }}>
                            <ListItemText>Indonesia</ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton sx={{ padding: '.3rem 1rem', borderRadius: '6px' }}>
                            <ListItemText>Indonesia</ListItemText>
                        </ListItemButton>
                    </ListItem> */}
                </List>
            </Popover>
        </div>
    )
}
