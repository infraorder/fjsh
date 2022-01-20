import * as FJSH from '../src/fjsh';
import nanoid from 'nanoid'

test('id', () => {
  expect(FJSH.Util.genId()).toBeDefined()
})
