import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { HomePage } from './pages/Home'
import { AnalyzePage } from './pages/Analyze'
import './App.scss'
import { SnackbarProvider } from './context/snackbar'

function App() {
    return (
        <BrowserRouter>
            <SnackbarProvider>
                <Header/>

                <main>
                    <Routes>
                        <Route path='/' element={<HomePage/>} />
                        <Route path='/analyze' element={<AnalyzePage/>} />
                    </Routes>
                </main>
            </SnackbarProvider>
        </BrowserRouter>
    )
}

export default App
