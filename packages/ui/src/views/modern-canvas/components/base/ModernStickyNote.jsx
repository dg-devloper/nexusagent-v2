import PropTypes from 'prop-types'
import { useContext, useState } from 'react'
import { useSelector } from 'react-redux'

// material-ui
import { Box, IconButton } from '@mui/material'

// project imports
import { ModernNodeCardWrapper } from '../../index'
import NodeTooltip from '@/ui-component/tooltip/NodeTooltip'
import { Input } from '@/ui-component/input/Input'
import { themeVariables } from '../../config'

// icons
import { IconCopy, IconTrash } from '@tabler/icons-react'

// context
import { flowContext } from '@/store/context/ReactFlowContext'

const ModernStickyNote = ({ data }) => {
    const canvas = useSelector((state) => state.canvas)
    const { deleteNode, duplicateNode } = useContext(flowContext)
    const [inputParam] = data.inputParams
    const [open, setOpen] = useState(false)

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    return (
        <>
            <ModernNodeCardWrapper
                style={data.selected ? 'PRIMARY' : 'DEFAULT'}
                selected={data.selected}
                border={false}
                sx={{
                    padding: 0,
                    backgroundColor: data.selected ? themeVariables.colors.warning.light : themeVariables.colors.warning.main,
                    '&:hover': {
                        backgroundColor: themeVariables.colors.warning.light
                    }
                }}
            >
                <NodeTooltip
                    open={!canvas.canvasDialogShow && open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    disableFocusListener={true}
                    title={
                        <Box
                            sx={{
                                background: 'transparent',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: themeVariables.spacing.small
                            }}
                        >
                            <IconButton
                                title="Duplicate"
                                onClick={() => duplicateNode(data.id)}
                                sx={{
                                    height: '35px',
                                    width: '35px',
                                    color: themeVariables.colors.text.primary,
                                    '&:hover': {
                                        color: themeVariables.colors.primary.main,
                                        backgroundColor: themeVariables.colors.background.hover
                                    }
                                }}
                            >
                                <IconCopy />
                            </IconButton>
                            <IconButton
                                title="Delete"
                                onClick={() => deleteNode(data.id)}
                                sx={{
                                    height: '35px',
                                    width: '35px',
                                    color: themeVariables.colors.text.primary,
                                    '&:hover': {
                                        color: themeVariables.colors.error.main,
                                        backgroundColor: themeVariables.colors.background.hover
                                    }
                                }}
                            >
                                <IconTrash />
                            </IconButton>
                        </Box>
                    }
                    placement="right-start"
                >
                    <Box>
                        <Input
                            key={data.id}
                            inputParam={inputParam}
                            onChange={(newValue) => (data.inputs[inputParam.name] = newValue)}
                            value={data.inputs[inputParam.name] ?? inputParam.default ?? ''}
                            nodes={inputParam?.acceptVariable && reactFlowInstance ? reactFlowInstance.getNodes() : []}
                            edges={inputParam?.acceptVariable && reactFlowInstance ? reactFlowInstance.getEdges() : []}
                            nodeId={data.id}
                        />
                    </Box>
                </NodeTooltip>
            </ModernNodeCardWrapper>
        </>
    )
}

ModernStickyNote.propTypes = {
    data: PropTypes.object
}

export default ModernStickyNote