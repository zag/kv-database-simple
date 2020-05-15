import { Store } from './store'
import { State } from './reducer'

describe("SnapShots and Journal", () => {
    const dataPath = 'src/testdata'
    const store = new Store(dataPath)
    const state = store.getLastStateFromSnapshot()
    it("check getLastStateFromSnapshot", () => {
      const expected: State = { data: { 2: '2', 3: '3', 4: '4' },lastUUID: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dc11d' }
      expect(state).toEqual(expected);
    });
    it("check updateStateFromJournal", async () => {
        const expected: State = { data: { 2: '2', 3: '3', 5: '6' },   lastUUID: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dc14d' }
        expect(await store.updateStateFromJournal(state)).toEqual(expected);
      });
  
  
})  