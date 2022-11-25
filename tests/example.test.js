const init = require('../src/init')
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})

describe('example test', () => {
  it('test', () => {
    expect(true).toBe(true)
  })
})
