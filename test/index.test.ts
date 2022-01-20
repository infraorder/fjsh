import { FJSH } from '../src/index';
import nanoid from 'nanoid'

test('id', () => {
  expect(FJSH.Util.genId()).toBeDefined()
})
