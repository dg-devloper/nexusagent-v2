import { useState } from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Chatflows from '../chatflows'
import Agentflows from '../agentflows'
import Assistants from '../assistants'
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div role='tabpanel' hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    )
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    }
}

export default function BasicTabs() {
    const [value, setValue] = useState(parseInt(localStorage.getItem('chatTab') || 0))

    const handleChange = (event, newValue) => {
        setValue(newValue)
        localStorage.setItem('chatTab', newValue)
    }

    // useEffect(() => {

    // })

    0
    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
                    <Tab label='Chatflows' {...a11yProps(0)} />
                    <Tab label='Agentflows' {...a11yProps(1)} />
                    <Tab label='Assistants' {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Chatflows />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Agentflows />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <Assistants />
            </CustomTabPanel>
        </Box>
    )
}
