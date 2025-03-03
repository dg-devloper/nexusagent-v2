import PropTypes from 'prop-types'
import { useState, useRef } from 'react'

// material-ui
import { Box, Stack } from '@mui/material'

// project imports
import { StyledFab } from '@/ui-component/button/StyledFab'
import APICodeDialog from '@/views/chatflows/APICodeDialog'

// icons
import { IconCode, IconPlayerPlay } from '@tabler/icons-react'

// ==============================|| CANVAS SUB HEADER ||============================== //

const CanvasSubHeader = ({ chatflow, isAgentCanvas }) => {
    const [apiDialogOpen, setAPIDialogOpen] = useState(false)
    const [apiDialogProps, setAPIDialogProps] = useState({})

    const onAPIDialogClick = () => {
        let isFormDataRequired = false
        let isSessionMemory = false
        try {
            const flowData = JSON.parse(chatflow.flowData)
            const nodes = flowData.nodes
            for (const node of nodes) {
                if (node.data.inputParams.find((param) => param.type === 'file')) {
                    isFormDataRequired = true
                }
                if (node.data.inputParams.find((param) => param.name === 'sessionId')) {
                    isSessionMemory = true
                }
                if (isFormDataRequired && isSessionMemory) break
            }
        } catch (e) {
            console.error(e)
        }

        setAPIDialogProps({
            title: 'Embed in website or use as API',
            chatflowid: chatflow.id,
            chatflowApiKeyId: chatflow.apikeyid,
            isFormDataRequired,
            isSessionMemory,
            isAgentCanvas
        })
        setAPIDialogOpen(true)
    }

    return (
        <>
            <Stack flexDirection='row' justifyContent='space-between' sx={{ position: 'absolute', right: 20, top: 20 }}>
                <Box sx={{ display: 'flex', gap: '0' }}>
                    {chatflow?.id && (
                        <Box sx={{ 
                            display: 'flex', 
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0',
                            overflow: 'hidden'
                        }}>
                            <StyledFab
                                variant='extended'
                                sx={{
                                    borderRadius: '8px 0 0 8px',
                                    borderRight: '1px solid #e0e0e0',
                                    padding: '.5rem 1rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '.5rem',
                                    backgroundColor: '#fff',
                                    color: '#000',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                    }
                                }}
                                size='small'
                                aria-label='playground'
                                title='Playground'
                                onClick={() => {
                                    // Find and click the Run button from ChatPopUp
                                    const runButton = document.querySelector('[aria-label="chat"]');
                                    if (runButton) {
                                        runButton.click();
                                    }
                                }}
                            >
                                <IconPlayerPlay size={19} />
                                Playground
                            </StyledFab>
                            <StyledFab
                                variant='extended'
                                sx={{
                                    borderRadius: '0 8px 8px 0',
                                    padding: '.5rem 1rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '.5rem',
                                    backgroundColor: '#fff',
                                    color: '#000',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                    }
                                }}
                                size='small'
                                aria-label='api'
                                title='API'
                                onClick={onAPIDialogClick}
                            >
                                <IconCode size={19} />
                                API
                            </StyledFab>
                        </Box>
                    )}
                </Box>
            </Stack>

            {apiDialogOpen && (
                <APICodeDialog 
                    show={apiDialogOpen} 
                    dialogProps={apiDialogProps} 
                    onCancel={() => setAPIDialogOpen(false)} 
                />
            )}
        </>
    )
}

CanvasSubHeader.propTypes = {
    chatflow: PropTypes.object,
    isAgentCanvas: PropTypes.bool
}

export default CanvasSubHeader
