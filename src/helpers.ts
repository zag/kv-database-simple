
const readline = require('readline')
import { ReadStream } from 'fs'
import { Action, Commands, Command } from './reducer'

export async function processLineByLine(stream:NodeJS.ReadStream|ReadStream, cb:Function) {
    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    
    for await (const line of rl) {
      // Each line in input.txt will be successively available here as `line`.
      cb(line)
      //console.log(`Line from file: ${line}`);
    }
}

/**
 * Parse Journal Queries 
 *   9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dc11d GET id
 *   9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dc11d DELETE id
 *   9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dc11d SET id payload
 */
 export const getActionFromLine = (line:string):Action|undefined => {
    const r = new RegExp(/\s*(\S+)\s+(\S+)\s+(\S+)(?:\s+(\S+))?/)
    const R = line.match(r)
    if (R) {
        const [_,uuid,name, id, payload] = R
        let command = Commands[name as keyof typeof Commands]
        return { uuid, name:command, id, payload }
    }
    return undefined
}
