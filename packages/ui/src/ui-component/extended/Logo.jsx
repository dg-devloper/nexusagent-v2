import logo from '@/assets/images/nexus_agent_logo.png'
import logoBlue from '@/assets/images/nexus_agent_logo_blue.png'
import PropTypes from 'prop-types'

// ==============================|| LOGO ||============================== //

const Logo = ({ type = 'white' }) => {
    return (
        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
            <img style={{ objectFit: 'contain', height: 'auto', width: 150 }} src={type === 'blue' ? logoBlue : logo} alt='Flowise' />
        </div>
    )
}

Logo.propTypes = {
    type: PropTypes.string
}

export default Logo
