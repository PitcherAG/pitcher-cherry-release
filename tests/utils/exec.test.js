import { execute } from '../../src/utils/exec'

describe('exec.js', () => {
  describe('execute', () => {
    it('executes an `ls -la` command and provides output as String', async () => {
      const result = await execute('ls -la')

      expect(result).toEqual(expect.stringContaining('total'))
      expect(result).toEqual(expect.stringContaining('.'))
      expect(result).toEqual(expect.stringContaining('..'))
    })

    it('errors out when running a command that does not exist', async () => {
      expect(() => execute('foobar')).rejects.toThrow('Command failed: foobar')
    })
  })
})
