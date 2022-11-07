import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { RuleObj, Rules } from '../types/rules'
import { State } from '../types/state'
import './styles.scss'

type Props = {
    alphabet: string[]
    rules: Rules
}

export const StateMachine = ({ alphabet, rules }: Props) => {

    const [analyzeVal, setAnalyzeVal] = useState<string>('')
    const lastCharAlphabetIndex = alphabet.findIndex(val => val === analyzeVal.slice(-1))

    const [state, setState] = useState<RuleObj>(rules.get('q0') as RuleObj)
    const [stateHistory, setStateHistory] = useState<RuleObj[]>([rules.get('q0') as RuleObj])

    useEffect(() => {
        if(!analyzeVal) return

        const nextState = rules.get(state.value[lastCharAlphabetIndex])
        if(lastCharAlphabetIndex !== -1 && state.value[lastCharAlphabetIndex] && nextState) {
            setState(nextState)
        }
    }, [analyzeVal])

    useEffect(() => {
        console.log('troquei o state', state)
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
                onChange={event => setAnalyzeVal(event.target.value.toUpperCase())}
                onKeyUp={event => {
                    event.code === 'Space' && console.log('aaaaa')
                }}
                onKeyDown={event => {
                    event.code === 'Backspace' && setState(stateHistory[stateHistory.length - 2])
                }}
            />

            <TableContainer className='grammar-table-container'>
                <Table>
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
                                            { ...val !== '' && {
                                                className: `state-cell ${state.name === ruleName && lastCharAlphabetIndex === index ? 'active' : ''}`
                                            }}
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