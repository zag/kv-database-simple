import { isImmutableCommand, Commands } from "./reducer";


describe("isImmutableCommand", () => {
    it("check GET", () => {
      expect( isImmutableCommand({name:Commands['GET'], id: '1'})).toBeTruthy()
    });
    it("check DELETE", () => {
        expect(isImmutableCommand({name:Commands['DELETE'], id: '1'})).toBeFalsy()
      });
    it("check SET", () => {
        expect(isImmutableCommand({name:Commands['SET'], id: '1', payload:"12"})).toBeFalsy()
    });
  
})  