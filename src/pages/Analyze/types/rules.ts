export type Rules = Map<string, RuleObj>

export type RuleObj = {
    name: string
    isInittial: boolean
    isFinal: boolean
    value: string[]
}