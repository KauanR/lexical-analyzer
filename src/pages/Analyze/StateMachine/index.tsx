import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSnackbar } from 'src/hooks/useSnackbar'
import { History } from '../types/history'
import { RuleObj, Rules } from '../types/rules'
import { StateMachineHistory } from './History'
import './styles.scss'

type Props = {
    alphabet: string[]
    rules: Rules
}

export const StateMachine = ({ alphabet, rules }: Props) => {
    
    const [state, setState] = useState<RuleObj>(rules.get('q0') as RuleObj)
    const [stateHistory, setStateHistory] = useState<RuleObj[]>([])

    const [analyzeVal, setAnalyzeVal] = useState<string>('')
    const lastChar = analyzeVal.slice(-1)

    const [history, setHistory] = useState<History[]>([])

    const { createSnack } = useSnackbar()

    // Lida com o backtracing
    const backSpaceHandler = () => {
        const newStateHistory: RuleObj[] = JSON.parse(JSON.stringify(stateHistory))
        newStateHistory.splice(-1)

        setState(newStateHistory[newStateHistory.length - 1] || rules.get('q0') as RuleObj)
        setStateHistory(newStateHistory)
    }

    // Se o caractere inserido for espaço:
    // - Mostra erro/sucesso(baseado se está num estado final ou não)
    // - Adiciona o valor digitado ao histórico
    // - Reinicia a máquina de estados
    const spaceHandler = () => {
        createSnack(
            state.isFinal ? 'Análise aprovada!' : 'Ooops, a análise foi recusada',
            state.isFinal ? 'success' : 'error'
        )

        setHistory(current => [...current, {
            lastState: `${state.isInittial ? '✱' : ''}${state.isFinal ? '➜' : ''} ${state.name}`,
            type: state.isFinal ? 'success' : 'error',
            value: analyzeVal
        }])

        setAnalyzeVal('')
        setStateHistory([])
        setState(rules.get('q0') as RuleObj)
    }

    // Rotina executada toda vez em que o campo troca de valor
    useEffect(() => {
        if(!analyzeVal) {
            setState(rules.get('q0') as RuleObj)
        }

        // Se o último caractere for um espaço, vai pra rotina de checagem
        if(lastChar === ' ') {
            spaceHandler()
            return
        }

        // Checa se o caractere digitado bate com o que é válido para o estado atual, caso sim, vai pro próximo passo
        const lastCharAlphabetIndex = alphabet.findIndex(val => val === lastChar)
        const nextState = rules.get(state.value[lastCharAlphabetIndex])
        if(lastCharAlphabetIndex !== -1 && state.value[lastCharAlphabetIndex] && nextState) {
            setState(nextState)
            setStateHistory(currrent => [...currrent, nextState])
        } else {
            setState(JSON.parse(JSON.stringify(rules.get(state.name) as RuleObj)))
        }
    }, [analyzeVal])

    return (
        <div className='state-machine'>
            <TextField
                className='input'
                variant='outlined'
                label='Analizador'
                autoFocus
                value={analyzeVal}
                autoComplete='off'
                onChange={event => setAnalyzeVal(event.target.value.toUpperCase()) }
                onKeyDown={event => event.code === 'Backspace' && backSpaceHandler()}
                { ...history.length > 0 && {
                    InputProps: { endAdornment: <StateMachineHistory history={history} /> }
                }}
            />

            <TableContainer className='grammar-table-container'>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell className='grammar-name'>
                                δ
                            </TableCell>
                            { alphabet.map(letter => (
                                <TableCell key={letter} align='center'>
                                    { letter }
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { Array.from(rules.entries()).map(entry => {
                            const [ruleName, ruleObj] = entry
                            return (
                                <TableRow 
                                    key={ruleName}
                                    id={ruleName}
                                    className={
                                        state.name === ruleName ? 'active' : ''
                                    }
                                >
                                    <TableCell className='grammar-name'>
                                        { ruleObj.isInittial && '➜ ' }
                                        { ruleObj.isFinal && '✱ ' }
                                        { ruleName }
                                    </TableCell>
                                    { ruleObj.value.map((val, index) => (
                                        <TableCell 
                                            key={index} 
                                            className={val !== '' ? 'state-cell' : ''}
                                        >
                                            { val }
                                        </TableCell>
                                    ))}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}