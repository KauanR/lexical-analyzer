import { useNavigate } from 'react-router-dom'
import { Inputter } from './Inputter'

export const HomePage = () => {
    const navigate = useNavigate()

    const submitHandler = (tokens: string[]) => {
        navigate('/analyze', { state: { tokens } })
    }

    return (
        <Inputter onSubmit={submitHandler} />
    )
}