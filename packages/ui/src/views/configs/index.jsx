import * as React from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

import Tools from '../tools'
import Credentials from '../credentials'
import APIKey from '../apikey'
import Documents from '../docstore'
import Variables from '../variables'

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
    const [value, setValue] = React.useState(parseInt(localStorage.getItem('configTab') || 0))

    const handleChange = (event, newValue) => {
        setValue(newValue)
        localStorage.setItem('configTab', newValue)
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
                    <Tab label='Tools' {...a11yProps(0)} />
                    <Tab label='Credentials' {...a11yProps(1)} />
                    <Tab label='Variables' {...a11yProps(2)} />
                    <Tab label='API Keys' {...a11yProps(3)} />
                    <Tab label='Document Stores' {...a11yProps(4)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Tools />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Credentials />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <Variables />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                <APIKey />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
                <Documents />
            </CustomTabPanel>
        </Box>
    )
}
