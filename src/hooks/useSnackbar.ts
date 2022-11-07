import { useContext } from 'react'
import { SnackbarContext } from '../context/snackbar'

export function useSnackbar() {
    return useContext(SnackbarContext)
}