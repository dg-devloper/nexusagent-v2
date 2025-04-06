import client from './client'

const getAllWhatsapp = () => client.get('/whatsapp')
const deleteWhatsapp = (sessionId) => client.delete(`/whatsapp/${sessionId}`)

export default {
    getAllWhatsapp,
    deleteWhatsapp
}
