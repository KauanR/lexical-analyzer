import { AppBar, IconButton, Toolbar, Typography } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import './styles.scss'
import { Navigate, useNavigate } from 'react-router-dom'

export const Header = () => {
    const navigate = useNavigate()

    const githubRedirect = () => {
        window.open('https://github.com/KauanR/lexical-analyzer', '_blank')
    }

    const homeRedirect = () => {
        navigate('/')
    }

    return (
        <AppBar position='static' className='header'>
            <Toolbar>
                <div className="spacer"></div>

                <Typography 
                    variant='h6' 
                    onClick={homeRedirect}
                    sx={{ cursor: 'pointer' }}
                >
                    Analisador Léxico
                </Typography>

                <IconButton onClick={githubRedirect}>
                    <GitHubIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}