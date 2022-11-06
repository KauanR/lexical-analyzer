import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const AnalyzePage = () => {

    const { state: { tokens } } = useLocation()

    useEffect(() => {
        console.log(tokens)
    }, [tokens])

    return (
        <h1>ioasdhjasi9od</h1>
    )
}