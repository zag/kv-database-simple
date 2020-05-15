import  {EventEmitter} from 'events'
import { Messages } from './messages'
import { Store } from './store'
import { State, Action, Commands, Answer, Command, isImmutableCommand, createAction, applyActionToState } from './reducer'

export interface ManagerParams {
    messages:Messages,
    store: Store,
    state: State
  }
  
export class Manager extends EventEmitter {

    state : State
    messages: Messages
    store: Store
  
     // @ts-ignore
     takeSnapshotInterval: NodeJS.Timeout
  
     constructor({messages, state, store} : ManagerParams ){
      super()
      // setup state
      this.state  = state
      this.store  = store
      this.messages = messages

      // start journaling and snapshots
      this.store.startJournal()

      this.on('snapshot',() => { 
            console.log('saveSnapshot()')
            this.store.makeSnapshot(this.state)
      })

      // take snapshot immediately before first record in journal is appears
      this.emit('snapshot', this.state)
      
      //start snapshoting
      this.takeSnapshotInterval = setInterval(() => {
          this.emit('snapshot', this.state)
      }, 10000); 

      console.log("start listening")
      
      messages.on('get', ( line )=>{

        // parse string
        const r = new RegExp(/\s*(\S+)\s+(\S+)(?:\s+(\S+))?/)
        const matchResult = line.match(r)
        // set error answer by default
        let answer:Answer = { error:1, payload:`Bad command: ${line}`}

        if ( matchResult ) {
          const [_, name, id, payload] = matchResult
          let command:Command = { name : Commands[name as keyof typeof Commands], id, payload }
          if ([ Commands.GET, Commands.DELETE, Commands.SET ].includes(name)){
              // start process command
              if ( isImmutableCommand(command) ) {
                answer = { error:0, payload: this.state.data[id] ?? ''  }
              } else {
                const action = createAction(command)
                this.state = applyActionToState(this.state, action)
                this.store.appendJournal(action)
                answer = { error:0, payload: `${name} ${id}`}
              }
          } 
        }
        
        messages.send(JSON.stringify(answer))
      }
      )
   }
    async init(){
      // run consume
      await this.messages.consume()
    }
  
    close() {
      if (this.takeSnapshotInterval) {
        clearInterval(this.takeSnapshotInterval);
      }
      this.store.closeJournal()
    }
  }
  