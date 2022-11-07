import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import { History } from '../../types/history'
import HistoryIcon from '@mui/icons-material/History'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { Fragment, useState } from 'react'
import './styles.scss'

type Props = {
    history: History[]
}

export const StateMachineHistory = ({ history }: Props) => {

    const [dialogFlag, setDialogFlag] = useState<boolean>(false)

    return (
        <InputAdornment position='end'>
            <IconButton onClick={() => setDialogFlag(true)}>
                <HistoryIcon/>
            </IconButton>

            <Dialog
                open={dialogFlag}
                onClose={() => setDialogFlag(false)}
            >
                <DialogTitle>
                    Histórico de Análises
                </DialogTitle>
                <DialogContent>
                    <List>
                        { history && history.length > 0 && history.map((item, index) => (
                            <Fragment key={index}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar className={item.type}>
                                            { item.type === 'success' ? <CheckIcon/> : <CloseIcon/> }
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`Valor: ${item.value}`}
                                        secondary={`Último estado: ${item.lastState}`}
                                    />
                                </ListItem>
                                { index !== history.length - 1 && <Divider/> }
                            </Fragment>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogFlag(false)}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </InputAdornment>
    )
}