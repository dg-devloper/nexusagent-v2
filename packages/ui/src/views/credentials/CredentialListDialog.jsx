import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { List, ListItemButton, Dialog, DialogContent, DialogTitle, Box, OutlinedInput, InputAdornment, Typography, alpha } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { IconSearch, IconX } from '@tabler/icons-react'

// const
import { baseURL } from '@/store/constant'
import { HIDE_CANVAS_DIALOG, SHOW_CANVAS_DIALOG } from '@/store/actions'

const brandColor = '#2b63d9'

const CredentialListDialog = ({ show, dialogProps, onCancel, onCredentialSelected }) => {
    const portalElement = document.getElementById('portal')
    const dispatch = useDispatch()
    const theme = useTheme()
    const [searchValue, setSearchValue] = useState('')
    const [componentsCredentials, setComponentsCredentials] = useState([])

    const filterSearch = (value) => {
        setSearchValue(value)
        setTimeout(() => {
            if (value) {
                const searchData = dialogProps.componentsCredentials.filter((crd) => crd.name.toLowerCase().includes(value.toLowerCase()))
                setComponentsCredentials(searchData)
            } else if (value === '') {
                setComponentsCredentials(dialogProps.componentsCredentials)
            }
            // scrollTop()
        }, 500)
    }

    useEffect(() => {
        if (dialogProps.componentsCredentials) {
            setComponentsCredentials(dialogProps.componentsCredentials)
        }
    }, [dialogProps])

    useEffect(() => {
        if (show) dispatch({ type: SHOW_CANVAS_DIALOG })
        else dispatch({ type: HIDE_CANVAS_DIALOG })
        return () => dispatch({ type: HIDE_CANVAS_DIALOG })
    }, [show, dispatch])

    const component = show ? (
        <Dialog
            fullWidth
            maxWidth='md'
            open={show}
            onClose={onCancel}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: `0 8px 40px ${alpha(brandColor, 0.1)}`,
                    overflow: 'hidden'
                }
            }}
        >
            <DialogTitle 
                sx={{ 
                    fontSize: '1.25rem', 
                    p: 3, 
                    pb: 2,
                    fontWeight: 600,
                    color: 'rgb(51, 65, 85)',
                    borderBottom: `1px solid ${alpha(brandColor, 0.1)}`
                }} 
                id='alert-dialog-title'
            >
                {dialogProps.title}
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxHeight: '75vh', position: 'relative', px: 3, py: 3 }}>
                <Box
                    sx={{
                        backgroundColor: theme.palette.background.paper,
                        position: 'sticky',
                        top: 0,
                        zIndex: 10
                    }}
                >
                    <OutlinedInput
                        sx={{ 
                            width: '100%', 
                            pr: 2, 
                            pl: 2, 
                            position: 'sticky',
                            borderRadius: 2,
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: alpha(brandColor, 0.2)
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: alpha(brandColor, 0.3)
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: brandColor
                            }
                        }}
                        id='input-search-credential'
                        value={searchValue}
                        onChange={(e) => filterSearch(e.target.value)}
                        placeholder='Search credential'
                        startAdornment={
                            <InputAdornment position='start'>
                                <IconSearch stroke={1.5} size='1rem' color={alpha(brandColor, 0.6)} />
                            </InputAdornment>
                        }
                        endAdornment={
                            searchValue && (
                                <InputAdornment
                                    position='end'
                                    sx={{
                                        cursor: 'pointer',
                                        color: alpha(brandColor, 0.6),
                                        '&:hover': {
                                            color: brandColor
                                        }
                                    }}
                                    title='Clear Search'
                                >
                                    <IconX
                                        stroke={1.5}
                                        size='1rem'
                                        onClick={() => filterSearch('')}
                                        style={{
                                            cursor: 'pointer'
                                        }}
                                    />
                                </InputAdornment>
                            )
                        }
                        aria-describedby='search-helper-text'
                        inputProps={{
                            'aria-label': 'weight'
                        }}
                    />
                </Box>
                <List
                    sx={{
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 2,
                        py: 0,
                        zIndex: 9,
                        borderRadius: '10px',
                        [theme.breakpoints.down('md')]: {
                            maxWidth: 370
                        }
                    }}
                >
                    {[...componentsCredentials].map((componentCredential) => (
                        <ListItemButton
                            alignItems='center'
                            key={componentCredential.name}
                            onClick={() => onCredentialSelected(componentCredential)}
                            sx={{
                                border: `1px solid ${alpha(brandColor, 0.1)}`,
                                borderRadius: 3,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'start',
                                textAlign: 'left',
                                gap: 2,
                                p: 2,
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    backgroundColor: alpha(brandColor, 0.02),
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 8px 24px ${alpha(brandColor, 0.1)}`
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '12px',
                                    backgroundColor: alpha(brandColor, 0.05),
                                    border: `1px solid ${alpha(brandColor, 0.1)}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: `0 6px 16px ${alpha(brandColor, 0.12)}`,
                                        backgroundColor: alpha(brandColor, 0.08)
                                    }
                                }}
                            >
                                <img
                                    style={{
                                        width: '70%',
                                        height: '70%',
                                        objectFit: 'contain'
                                    }}
                                    alt={componentCredential.name}
                                    src={`${baseURL}/api/v1/components-credentials-icon/${componentCredential.name}`}
                                />
                            </Box>
                            <Typography
                                sx={{
                                    color: 'rgb(51, 65, 85)',
                                    fontWeight: 600,
                                    fontSize: '0.875rem'
                                }}
                            >
                                {componentCredential.label}
                            </Typography>
                        </ListItemButton>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

CredentialListDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
    onCredentialSelected: PropTypes.func
}

export default CredentialListDialog
