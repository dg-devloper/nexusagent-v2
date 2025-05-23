import { Link } from 'react-router-dom'

// material-ui
import { ButtonBase } from '@mui/material'

// project imports
import config from '@/config'
import Logo from '@/ui-component/extended/Logo'
import PropTypes from 'prop-types'

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({ type = 'white' }) => (
    <ButtonBase disableRipple component={Link} to={config.defaultPath}>
        <Logo type={type} />
    </ButtonBase>
)

LogoSection.propTypes = {
    type: PropTypes.string
}

export default LogoSection
