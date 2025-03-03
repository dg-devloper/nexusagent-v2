import { useTheme, Chip, Box, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { alpha } from '@mui/material/styles'

const brandColor = '#2b63d9'

const DocumentStoreStatus = ({ status, isTableView }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const getColor = (status) => {
        switch (status) {
            case 'STALE':
                return customization.isDarkMode
                    ? [alpha(brandColor, 0.2), alpha(brandColor, 0.5), '#ffffff']
                    : [alpha(brandColor, 0.1), alpha(brandColor, 0.4), '#333333']
            case 'EMPTY':
                return customization.isDarkMode
                    ? [alpha(brandColor, 0.2), alpha(brandColor, 0.5), '#ffffff']
                    : [alpha(brandColor, 0.1), alpha(brandColor, 0.4), '#333333']
            case 'SYNCING':
                return customization.isDarkMode
                    ? [alpha('#ffc107', 0.2), '#ffc107', '#ffffff']
                    : [alpha('#ffc107', 0.1), '#ffc107', '#7A5800']
            case 'UPSERTING':
                return customization.isDarkMode
                    ? [alpha(brandColor, 0.2), alpha(brandColor, 0.6), '#ffffff']
                    : [alpha(brandColor, 0.1), alpha(brandColor, 0.6), '#333333']
            case 'SYNC':
                return customization.isDarkMode
                    ? [alpha('#4caf50', 0.2), '#4caf50', '#ffffff']
                    : [alpha('#4caf50', 0.1), '#4caf50', '#1B5E20']
            case 'UPSERTED':
                return customization.isDarkMode
                    ? [alpha('#00bcd4', 0.2), '#00bcd4', '#ffffff']
                    : [alpha('#00bcd4', 0.1), '#00bcd4', '#006064']
            case 'NEW':
                return customization.isDarkMode
                    ? [alpha(brandColor, 0.2), alpha(brandColor, 0.6), '#ffffff']
                    : [alpha(brandColor, 0.1), alpha(brandColor, 0.6), '#333333']
            default:
                return customization.isDarkMode
                    ? [alpha(brandColor, 0.2), alpha(brandColor, 0.5), '#ffffff']
                    : [alpha(brandColor, 0.1), alpha(brandColor, 0.4), '#333333']
        }
    }

    const getStatusLabel = (status) => {
        switch (status) {
            case 'STALE':
                return 'Stale'
            case 'EMPTY':
                return 'Empty'
            case 'SYNCING':
                return 'Syncing'
            case 'UPSERTING':
                return 'Upserting'
            case 'SYNC':
                return 'Synced'
            case 'UPSERTED':
                return 'Upserted'
            case 'NEW':
                return 'New'
            default:
                return status
        }
    }

    if (isTableView) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: status === 'EMPTY' ? 'transparent' : getColor(status)[1],
                    border: status === 'EMPTY' ? '3px solid' : 'none',
                    borderColor: status === 'EMPTY' ? getColor(status)[1] : 'transparent',
                    boxShadow: `0 0 10px ${alpha(getColor(status)[1], 0.5)}`
                }}
                title={getStatusLabel(status)}
            />
        )
    }

    return (
        <Chip
            label={getStatusLabel(status)}
            sx={{
                backgroundColor: status === 'EMPTY' ? 'transparent' : alpha(getColor(status)[1], 0.2),
                color: getColor(status)[2],
                borderRadius: '8px',
                border: `1px solid ${alpha(getColor(status)[1], 0.5)}`,
                height: 28,
                fontWeight: 500,
                fontSize: '0.75rem',
                '& .MuiChip-label': {
                    px: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    '&:before': {
                        content: '""',
                        display: 'inline-block',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: getColor(status)[1],
                        marginRight: '6px',
                        boxShadow: `0 0 6px ${alpha(getColor(status)[1], 0.8)}`
                    }
                }
            }}
            size="small"
        />
    )
}

DocumentStoreStatus.propTypes = {
    status: PropTypes.string,
    isTableView: PropTypes.bool
}

export default DocumentStoreStatus
