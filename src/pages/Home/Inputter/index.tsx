import { Button, Card, CardContent, Chip, Divider, TextField, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import { useState } from 'react'
import './styles.scss'

type Props = {
    onSubmit: (value: string[]) => void
}

export const Inputter = ({ onSubmit }: Props) => {

    const [tokens, setTokens] = useState<string[]>([])
    const [fieldVal, setFieldVal] = useState<string>('')

    const addTokens = () => {
        const newTokens = new Set<string>([
            ...tokens,
            ...fieldVal.trim().split(' ')
        ])
        setTokens(Array.from(newTokens))

        setFieldVal('')
    }

    const deleteToken = (index: number) => {
        const newTokens = tokens.splice(index, 1)
        setTokens(newTokens)
    }

    const submitHandler = () => {
        onSubmit(tokens)
        setFieldVal('')
        setTokens([])
    }
    
    return (
        <Card id='inputter'>
            <CardContent>
                <Typography variant='subtitle1'>
                    Antes de começar, por favor, insira seus tokens logo abaixo. 
                    É possível inserir múltiplos separando-os por espaço.
                </Typography>

                <div className='field'>
                    <TextField
                        variant='outlined'
                        label='Tokens'
                        autoFocus
                        value={fieldVal}
                        onChange={event => setFieldVal(event.target.value.toUpperCase())}
                        onKeyUp={event => {
                            event.key === 'Enter' && fieldVal.length > 0 && addTokens()
                        }}
                    />
                    <Button
                        endIcon={<AddIcon/>}
                        type='submit'
                        variant='outlined'
                        disabled={fieldVal.length === 0}
                        onClick={addTokens}
                    >
                        Adicionar
                    </Button>
                </div>

                <Divider className='divider' />

                <div className="tokens">
                    { tokens && tokens.length > 0 && tokens.map((el, index) => (
                        <Chip
                            key={el}
                            label={el}
                            color='primary'
                            onDelete={() => deleteToken(index)}
                        />
                    ))}
                    { tokens && tokens.length === 0 && (
                        <Typography variant='body2' color='text.secondary'>
                            Nenhum token foi adicionado ainda
                        </Typography>
                    )}
                </div>

                <Button
                    id='submit'
                    variant='contained'
                    endIcon={<PlayCircleIcon/>}
                    disabled={tokens.length === 0}
                    onClick={submitHandler}
                >
                    Iniciar analisador
                </Button>
            </CardContent>
        </Card>
    )
}