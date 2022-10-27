import { useEffect, useState } from 'react'
import './App.scss'
import { Header } from './components/Header'
import { Inputter } from './components/Inputter'

function App() {
    const [tokens, setTokens] = useState<string[]>([])

    useEffect(() => {
        console.log('Tokens no component root', tokens)
    }, [tokens])

    return (
        <>
            <Header/>

            <main>
                <Inputter onSubmit={val => setTokens(val)} />
            </main>
        </>
    )
}

export default App
