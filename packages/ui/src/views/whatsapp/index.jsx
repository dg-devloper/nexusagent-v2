import { useState, useEffect } from 'react'

import {
    Typography,
    Paper,
    Grid,
    Box,
    Stack,
    alpha,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    Snackbar,
    styled
} from '@mui/material'
import { tableCellClasses } from '@mui/material/TableCell'
import { StyledButton } from '@/ui-component/button/StyledButton'
import { IconPlus } from '@tabler/icons-react'

import QRCode from 'react-qr-code'
import { io } from 'socket.io-client'
import chatflowsApi from '@/api/chatflows'
import whatsappApi from '@/api/whatsapp'

// Hooks
import useApi from '@/hooks/useApi'
import { useSnackbar } from 'notistack'

import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { baseURL } from '@/store/constant'
import { IconBrandWhatsapp } from '@tabler/icons-react'

const brandColor = '#2b63d9'
const buttonBlue = '#5379e0'

const StyledTableCell = styled(TableCell)((_) => ({
    borderBottom: `1px solid ${alpha(brandColor, 0.1)}`,
    padding: '20px 24px',
    [`&.${tableCellClasses.head}`]: {
        background: `linear-gradient(180deg, ${alpha(brandColor, 0.05)} 0%, ${alpha(brandColor, 0.02)} 100%)`,
        color: 'rgb(100, 116, 139)',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        height: 64
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: '0.875rem',
        color: 'rgb(51, 65, 85)',
        height: 72
    }
}))

const WhatsAppView = () => {
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedOption, setSelectedOption] = useState('')
    const [socket, setSocket] = useState(null)
    const [qr, setQr] = useState('')
    const [openAlert, setOpenAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const getAllChatflowsApi = useApi(chatflowsApi.getAllWhatsappFlow)
    const getAllWhatsappApi = useApi(whatsappApi.getAllWhatsapp)
    const [isLoading, setLoading] = useState(true) // eslint-disable-line
    const [error, setError] = useState(true) // eslint-disable-line
    const [errorAgent, setErrorAgent] = useState(false)
    const [isRequestBarcode, setIsRequestBarcode] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedWhatsappId, setSelectedWhatsappId] = useState(null)
    const [whatsappData, setWhatsappData] = useState([])
    const [chatflowData, setChatflowData] = useState([])
    const { enqueueSnackbar } = useSnackbar()

    const handleOpenDialog = () => {
        setOpenDialog(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
    }

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value)
    }

    const handleBarcode = () => {
        if (!selectedOption) {
            setErrorAgent(true)
        } else if (selectedOption && !isRequestBarcode) {
            setIsRequestBarcode(true)
            if (socket) {
                socket.emit('barcode', { chatflowId: selectedOption })
            }
        }
    }

    const handleCloseAlert = () => {
        setOpenAlert(false)
    }

    const handleDeleteClick = (whatsappId) => {
        setSelectedWhatsappId(whatsappId)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        try {
            const deleteResp = await whatsappApi.deleteWhatsapp(selectedWhatsappId)

            if (deleteResp.data) {
                setDeleteDialogOpen(false)
                setSelectedWhatsappId(null)
                getAllWhatsappApi.request()
                getAllChatflowsApi.request()
                enqueueSnackbar('Pesan berhasil dihapus', { variant: 'success' })
            }
        } catch (error) {
            enqueueSnackbar('Gagal menghapus pesan', { variant: 'error' })
        }
    }

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false)
    }

    useEffect(() => {
        const token = localStorage.getItem('site')
        const socket = io(baseURL, {
            auth: {
                token
            }
        })
        setSocket(socket)
        socket.on('qrcode', (data) => {
            setQr(data.qrcode)
        })

        socket.on('waconnect', (data) => {
            if (data.connected === true) {
                setOpenDialog(false)
                setAlertMessage('Berhasil menghubungkan WhatsApp')
                setOpenAlert(true)
                setIsRequestBarcode(false)
                setQr('')
                setSelectedOption('')
                setTimeout(() => {
                    getAllWhatsappApi.request()
                    getAllChatflowsApi.request()
                }, 1000)
            }
        })
    }, []) // eslint-disable-line

    useEffect(() => {
        getAllChatflowsApi.request()
        getAllWhatsappApi.request()
    }, []) // eslint-disable-line

    useEffect(() => {
        if (getAllChatflowsApi.error) {
            if (getAllChatflowsApi.error?.response?.status === 401) {
                // Handle unauthorized
            } else {
                setError(getAllChatflowsApi.error)
            }
        }
    }, [getAllChatflowsApi.error])

    useEffect(() => {
        setLoading(getAllChatflowsApi.loading)
    }, [getAllChatflowsApi.loading])

    useEffect(() => {
        setWhatsappData(getAllWhatsappApi.data || [])
    }, [getAllWhatsappApi.data])

    useEffect(() => {
        setChatflowData(getAllChatflowsApi.data || [])
    }, [getAllChatflowsApi.data])

    const CustomHeader = () => (
        <Box
            sx={{
                borderRadius: '24px',
                background: `linear-gradient(135deg, ${brandColor} 0%, ${alpha(brandColor, 0.8)} 100%)`,
                padding: '3rem',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 10px 40px -10px ${alpha(brandColor, 0.4)}`,
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `radial-gradient(circle at top left, ${alpha('#fff', 0.12)} 0%, transparent 50%)`,
                    pointerEvents: 'none'
                },
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    top: '20%',
                    right: '10%',
                    width: '300px',
                    height: '300px',
                    background: `radial-gradient(circle, ${alpha('#fff', 0.08)} 0%, transparent 50%)`,
                    pointerEvents: 'none'
                }
            }}
        >
            <Stack spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={7}>
                        <Stack direction='row' spacing={3} alignItems='center'>
                            <Box
                                sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(8px)',
                                    color: 'white',
                                    padding: '16px',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    transform: 'rotate(-5deg)'
                                }}
                            >
                                <IconBrandWhatsapp stroke={2} size='1.5rem' style={{ color: '#fff' }} />
                            </Box>
                            <Stack spacing={1}>
                                <Typography
                                    variant='h3'
                                    sx={{
                                        color: '#fff',
                                        fontWeight: 700,
                                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        letterSpacing: '-0.02em'
                                    }}
                                >
                                    Whatsapp Integration
                                </Typography>
                                <Typography
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        fontSize: '1rem',
                                        lineHeight: 1.6
                                    }}
                                >
                                    Connect your WhatsApp account to your AI agent
                                </Typography>
                            </Stack>
                        </Stack>

                        <Stack direction='row' spacing={2} sx={{ mt: 3 }}>
                            <StyledButton
                                onClick={handleOpenDialog}
                                sx={{
                                    borderRadius: '16px',
                                    height: 40,
                                    padding: '0 20px',
                                    backgroundColor: buttonBlue,
                                    color: 'white',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    '&:hover': {
                                        backgroundColor: alpha(buttonBlue, 0.9),
                                        border: 'none'
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <IconPlus size={20} />
                                    <Typography>Create</Typography>
                                </Box>
                            </StyledButton>
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>
        </Box>
    )

    return (
        <>
            <CustomHeader />

            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Box>
                            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth='xs' fullWidth>
                                <DialogTitle>
                                    Tambahkan Whatsapp Baru
                                    <IconButton
                                        aria-label='close'
                                        onClick={handleCloseDialog}
                                        sx={{
                                            position: 'absolute',
                                            right: 8,
                                            top: 8,
                                            color: (theme) => theme.palette.grey[500]
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </DialogTitle>
                                <DialogContent>
                                    <Box sx={{ maxWidth: '350px' }}>
                                        <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                                            <InputLabel id='select-label'>Pilih Agent</InputLabel>

                                            <Select
                                                labelId='select-label'
                                                value={selectedOption}
                                                label='Pilih Opsi'
                                                onChange={handleOptionChange}
                                            >
                                                {chatflowData.map((item) => (
                                                    <MenuItem value={item.id} key={item.id}>
                                                        {item.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errorAgent && (
                                                <Typography variant='subtitle2' sx={{ mb: 2, color: 'red', mt: 1 }}>
                                                    Pilih Agent yang akan dihubungkan
                                                </Typography>
                                            )}
                                        </FormControl>
                                        <Button
                                            variant='contained'
                                            color='primary'
                                            size='small'
                                            disabled={isRequestBarcode}
                                            startIcon={<AddIcon />}
                                            onClick={handleBarcode}
                                        >
                                            Scan Barcode
                                        </Button>
                                        <Typography variant='h6' sx={{ mt: 2 }}>
                                            Barcode
                                        </Typography>
                                        {qr && (
                                            <QRCode
                                                value={qr}
                                                size={350}
                                                level='H' // High error correction
                                            />
                                        )}
                                    </Box>
                                </DialogContent>
                            </Dialog>

                            <TableContainer
                                component={Paper}
                                elevation={0}
                                sx={{
                                    border: `1px solid ${alpha(brandColor, 0.1)}`,
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    background: `linear-gradient(180deg, ${alpha(brandColor, 0.02)} 0%, transparent 100%)`,
                                    boxShadow: `0 8px 32px -4px ${alpha(brandColor, 0.08)}`
                                }}
                            >
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>No Whatsapp</StyledTableCell>
                                            <StyledTableCell>Agent</StyledTableCell>
                                            <StyledTableCell align='right'>Actions</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {whatsappData.map((msg) => (
                                            <TableRow key={msg.id}>
                                                <TableCell>+{msg.phoneNumber}</TableCell>
                                                <TableCell>{msg.name}</TableCell>

                                                <TableCell align='right'>
                                                    <IconButton size='small' onClick={() => handleDeleteClick(msg.sessionId)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                                <Alert onClose={handleCloseAlert} severity='success' sx={{ width: '100%' }}>
                                    {alertMessage}
                                </Alert>
                            </Snackbar>

                            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} aria-labelledby='delete-dialog-title'>
                                <DialogTitle id='delete-dialog-title'>Konfirmasi Hapus</DialogTitle>
                                <DialogContent>
                                    <Typography>Apakah Anda yakin ingin menghapus whatsapp ini?</Typography>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleDeleteCancel} color='primary'>
                                        Batal
                                    </Button>
                                    <Button onClick={handleDeleteConfirm} color='error'>
                                        Hapus
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}

export default WhatsAppView
