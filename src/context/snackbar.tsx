import { Alert, AlertColor, Snackbar as MuiSnackbar, Typography } from '@mui/material'
import { createContext, ReactNode, useState } from 'react'

type SnackbarContextType = {
    createSnack: (message: string, type: AlertColor) => void
    handleClose: () => void
}

export const SnackbarContext = createContext<SnackbarContextType>({
    createSnack: (message: string, type: AlertColor) => {},
    handleClose: () => {}
})

type SnackbarProvider = {
    children: ReactNode
}

type Snackbar = {
    message: string
    type: AlertColor
    open: boolean
    onClose?: () => void
}

export const SnackbarProvider = ({ children }: SnackbarProvider) => {
    const [ snack, setSnack ] = useState<Snackbar | null>(null)

    const createSnack = (message: string, type: AlertColor) => setSnack({ message, type, open: true })

    const handleClose = () => setSnack(null)

    return (
        <SnackbarContext.Provider value={{createSnack, handleClose}}>
            { snack && (
                <MuiSnackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={snack.open}
                    onClose={handleClose}
                    autoHideDuration={6000}
                >
                    <Alert 
                        severity={snack.type} 
                        variant="filled"
                    >
                        <Typography variant='body2'>
                            { snack.message }
                        </Typography>
                    </Alert>
                </MuiSnackbar>
            )}
            { children }
        </SnackbarContext.Provider>
    )
}