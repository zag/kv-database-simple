import R from 'ramda'
import {v4 as uuid4} from 'uuid'

export enum Commands {
    GET="GET",
    SET="SET",
    DELETE="DELETE"
}

enum AnswerType {
    Error = 1,
    Ok = 0,
}

export type Answer = {
    error: AnswerType,
    payload: string
}

export type Command = {
    name: Commands,
    id:string,
    payload?: string,
}

export interface Action extends Command  {
    uuid:string,
}

export type State = {
    data: { [key:string] : string | undefined },
    lastUUID: string | undefined
  }

export const defaultState: State = {
    data:{},
    lastUUID: undefined
}

export const reducer = ( state:State = defaultState, action:Action ):State => { 
    switch (action.name) {
        case Commands.SET:
            return <State>R.compose( 
                    R.assocPath(['data',action.id], action.payload),
                    R.assocPath(['lastUUID'], action.uuid),
            )(state)
        case Commands.DELETE:
            return <State>R.compose( 
                R.dissocPath(['data',action.id]),
                R.assocPath(['lastUUID'], action.uuid),
        )(state)
        
        default:
            return state
    }
}

export const createAction = (command:Command):Action => {
    return {
        ...command,
        uuid: uuid4()
    }
}

export const applyActionToState = ( state:State, action:Action ) => {
    return reducer(state, action)
}

export const isImmutableCommand = (command:Command):boolean => {
    return command.name === Commands.GET
}

