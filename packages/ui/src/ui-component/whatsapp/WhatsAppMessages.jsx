import { useEffect, useState } from 'react'
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
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
    Snackbar
} from '@mui/material'
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

const WhatsAppMessages = () => {
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
                getAllWhatsappApi.request()
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

    return (
        <Box>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant='contained' color='primary' startIcon={<AddIcon />} onClick={handleOpenDialog}>
                    Tambah Baru
                </Button>
            </Box>

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

                            <Select labelId='select-label' value={selectedOption} label='Pilih Opsi' onChange={handleOptionChange}>
                                {getAllChatflowsApi.data &&
                                    getAllChatflowsApi.data.map((item) => (
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

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>No Whatsapp</TableCell>
                            <TableCell>Agent</TableCell>
                            <TableCell>Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {whatsappData.map((msg) => (
                            <TableRow key={msg.id}>
                                <TableCell>{msg.phoneNumber}</TableCell>
                                <TableCell>{msg.name}</TableCell>

                                <TableCell>
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

            {/* Dialog Konfirmasi Delete */}
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
    )
}

export default WhatsAppMessages
