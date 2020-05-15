import  { EventEmitter } from 'events'
import { readdirSync, openSync, writeFileSync, closeSync, readFileSync, createReadStream , ReadStream} from 'fs'
import path from 'path'
import fs from 'fs'
import {defaultState, Action, applyActionToState, State} from './reducer'
import { processLineByLine, getActionFromLine } from './helpers'

export class Store extends EventEmitter {
    
    journalFile: number|undefined
    dataPath:string

    constructor(dataPath:string){
      super()
      this.dataPath = dataPath
      this.journalFile = undefined
    }

    async getLastState():Promise<State> {
        return await this.updateStateFromJournal(this.getLastStateFromSnapshot())
    }

    getLastStateFromSnapshot():State {
        const snapshotFiles = readdirSync(this.dataPath).filter(i=>i.match(/\d+\-snapshot.json/)).sort().reverse();
        const latestSnaphotFile = snapshotFiles[0] 
        if ( latestSnaphotFile ) {
            return JSON.parse(readFileSync(path.join(this.dataPath, latestSnaphotFile), "utf8"));
        }
        return defaultState
    }

    async updateStateFromJournal(state:State):Promise<State> {
        // now add journal
        let isNeedApplyToState = false
        // if empty snapshot restore all from journal
        if (!state.lastUUID) { isNeedApplyToState= true }
        const lastUUID = state.lastUUID
        // now scan journal and restore remaining parts
        const journalPath = path.join(this.dataPath, 'jounral.log')
        // unless exists journal return state
        if ( !fs.existsSync(journalPath) ) { return state}
        const stream = createReadStream(journalPath);
        let resultState = {...state}
        await processLineByLine(<ReadStream>stream,(s:string) => {
            const action = getActionFromLine(s)
            if (!action) return
            if ( isNeedApplyToState ) {
                resultState = applyActionToState(resultState, action)
            }
            if ( action.uuid === lastUUID) {
                isNeedApplyToState = true 
            }
        }
        )
        return resultState
    }

    startJournal = () => {
        if (this.journalFile !== undefined) {
            return
        }
        const journalFilePath = path.join(this.dataPath, 'jounral.log');
        console.log(`open file ${journalFilePath}`)
        this.journalFile = openSync(journalFilePath, "a");
    }
    
    appendJournal = ({ uuid, name, id, payload }:Action) => {
        writeFileSync(this.journalFile, `${uuid} ${name}  ${id} ${ payload || '' }\n`)
    }

    closeJournal = () => {
        if ( this.journalFile ) {
            closeSync(this.journalFile)
            this.journalFile = 0
        }
    }

    makeSnapshot(state:State) {
        const snapshotFile = path.join(this.dataPath, `${new Date().valueOf()}-snapshot.json`);
        writeFileSync(snapshotFile, JSON.stringify(state), { encoding: "utf-8", flag: "w" });
    }

    close() {
        this.closeJournal()
    }
}

