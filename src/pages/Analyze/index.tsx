import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Tokens } from './Tokens'
import { StateMachine } from './StateMachine'
import { Location } from './types/location'
import { Rules, RuleObj } from './types/rules'
import './styles.scss'

export const AnalyzePage = () => {

    const { state: { tokens } }: Location = useLocation()

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

    const [rules, setRules] = useState<Rules | null>(null)

    // Recebe um array de regras e 'junta' elas
    const joinRules = (ruleObjs: RuleObj[], name: string, isInittial: boolean) => {
        const result: RuleObj = {
            name,
            isFinal: false,
            isInittial,
            value: alphabet.map(() => '')
        }

        ruleObjs.forEach(ruleObj => {
            ruleObj.value.forEach((tokenRuleValue, index) => {
                if(tokenRuleValue !== '')
                    result.value[index] += `${tokenRuleValue}, `
            })
        })

        result.value = result.value.map(val => val.slice(0, -2))

        return result
    }

    useEffect(() => {
        // Guarda o resultado 'final' do algorítmo 
        const newRules: Rules = new Map<string, RuleObj>()
        
        // Cria um array de mapas, cada mapa é o conjunto de regras do token
        let rulesCount = 1
        const tokenRules: Rules[] = []
        tokens.forEach((token, index) => {
            tokenRules[index] = new Map<string, RuleObj>()

            token.split('').forEach((tokenChar, charIndex) => {

                tokenRules[index].set(charIndex === 0 ? 'q0' : `q${rulesCount++}`, {
                    name: `q${rulesCount - 1}`,
                    isFinal: false,
                    isInittial: charIndex === 0,
                    value: alphabet.map(letter => letter === tokenChar ? `q${rulesCount}` : '')
                })
            })

            tokenRules[index].set(`q${rulesCount++}`, {
                name: `q${rulesCount - 1}`,
                isFinal: true,
                isInittial: false,
                value: alphabet.map(() => '-')
            })
        })

        const q0Array: RuleObj[] = []
        tokenRules.forEach(tokenRule => {
            q0Array.push(tokenRule.get('q0') as RuleObj)
            
            // Começa a preencher o Mapa definitivo das regras
            tokenRule.forEach((rule, key) => {
                if(key !== 'q0')
                    newRules.set(key, rule)
            })
        })
        // Constrói o q0 definitivo, baseando-se em todos os outros q0 temporarários de cada token
        newRules.set('q0', joinRules(q0Array, 'q0', true))

        // Auto explicativo, mas fica preso nesse while até ficar deterministico
        // Se achou uma regra que ainda não existe no mapa, mantém no while e já cria a nova regra
        let isNonDeterministic = true
        while(isNonDeterministic) {
            isNonDeterministic = false
            Array.from(newRules.entries()).forEach(ruleEntry => {
                ruleEntry[1].value
                    .filter(val => val && val !== '-')
                    .forEach(val => {
                        if(newRules.get(val) === undefined) {
                            isNonDeterministic = true
                            const joinedRules = val.split(', ').map(el => newRules.get(el) as RuleObj)
                            newRules.set(val, joinRules(joinedRules, val, false))
                        }    
                    })
            })
        }

        // Apenas ordena as regras para ficarem mais fáceis de visualizar na tela
        const sortedNewRules: Rules = new Map(Array.from(newRules).sort((a, b) => {
            const aValue = a[0].includes(',') ? 0.5 : parseInt(a[0].substring(1))
            const bValue = b[0].includes(',') ? 0.5 : parseInt(b[0].substring(1))
            return aValue - bValue
        }))

        setRules(sortedNewRules)
    }, [tokens])

    return (
        <div className='analyze'>
            { tokens && tokens.length > 0 && rules && (
                <>
                    <Tokens tokens={tokens} />
                    <StateMachine alphabet={alphabet} rules={rules} />
                </>
            )}
        </div>
    )
}