import rewire from "rewire"
const axios = rewire("./axios")
const createInstance = axios.__get__("createInstance")
// @ponicode
describe("createInstance", () => {
    test("0", () => {
        let callFunction: any = () => {
            createInstance(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
