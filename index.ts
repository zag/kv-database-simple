
import {Store} from './src/store'
import {Manager} from './src/manager'
import {Messages} from './src/messages'
import {config} from './src/config'

async function run() {
  const messages = new Messages({url:config.url, config})
  // connect to rmq
  await messages.connect()
    
  // init store and get last state
  const store = new Store(config.dataPath)
  const state =  await store.getLastState()

  // start listening on commands and run journaling and snapshots
  const manager = new Manager({messages, state, store})
  manager.init()

  // set SIGNALS handlers
  const close = async () => {
    manager.close()
    store.close()
    await messages.connection.close()
  }
  process.on("SIGINT", close);
  process.on("SIGTERM", close);

}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
