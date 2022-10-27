import { AppBar, IconButton, Toolbar, Typography } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import './styles.scss'

export const Header = () => {

    const githubRedirect = () => {
        window.location.href = 'https://github.com/KauanR/lexical-analyzer'
    }

    return (
        <AppBar position='static' className='header'>
            <Toolbar>
                <div className="spacer"></div>
                <Typography variant='h6'>
                    Analisador Léxico
                </Typography>
                <IconButton onClick={githubRedirect}>
                    <GitHubIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}