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
    const [stateHistory, setStateHistory] = useState<RuleObj[]>([rules.get('q0') as RuleObj])

    const [analyzeVal, setAnalyzeVal] = useState<string>('')
    const lastChar = analyzeVal.slice(-1)
    const lastCharAlphabetIndex = alphabet.findIndex(val => val === lastChar)

    const [history, setHistory] = useState<History[]>([])

    const { createSnack } = useSnackbar()

    const backSpaceHandler = () => {
        // console.log(state, stateHistory)
        // setState(stateHistory[stateHistory.length - 2])
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
        setState(rules.get('q0') as RuleObj)
        setStateHistory([rules.get('q0') as RuleObj])
    }

    // Rotina executada toda vez em que o campo troca de valor
    useEffect(() => {
        // Encerra a rotina se o valor estiver vazio
        if(!analyzeVal) return

        if(lastChar === ' ') {
            spaceHandler()
            return
        }

        console.log('cheguei na checagem de estado', analyzeVal, state)

        // Checa se o caractere digitado bate com o que é válido para o estado atual, caso sim, vai pro próximo passo
        const nextState = rules.get(state.value[lastCharAlphabetIndex])
        if(lastCharAlphabetIndex !== -1 && state.value[lastCharAlphabetIndex] && nextState) {
            setState(nextState)
        } else {
            setState(JSON.parse(JSON.stringify(rules.get(state.name) as RuleObj)))
        }
    }, [analyzeVal])

    useEffect(() => {
        console.log('Estado atual: ', state)
        setStateHistory(currrent => [...currrent, state])
    }, [state])

    return (
        <div className='state-machine'>
            <TextField
                className='input'
                variant='outlined'
                label='Analizador'
                autoFocus
                value={analyzeVal}
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