import { Chip } from '@mui/material'
import Typography from '@mui/material/Typography'
import './styles.scss'

type Props = {
    tokens: string[]
}

export const Tokens = ({ tokens }: Props) => (
    <div className='tokens'>
        <Typography variant='subtitle1'>
            Tokens disponíveis:
        </Typography>

        <div className="list">
            { tokens && tokens.map(token => (
                <Chip
                    key={token}
                    label={token}
                    variant='outlined'
                    color='secondary'
                />
            ))}
        </div>
    </div>
)
