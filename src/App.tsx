import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { HomePage } from './pages/Home'
import { AnalyzePage } from './pages/Analyze'
import './App.scss'

function App() {
    return (
        <BrowserRouter>
            <Header/>

            <main>
                <Routes>
                    <Route path='/' element={<HomePage/>} />
                    <Route path='/analyze' element={<AnalyzePage/>} />
                </Routes>
            </main>
        </BrowserRouter>
    )
}

export default App
