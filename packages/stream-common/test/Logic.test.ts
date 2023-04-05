import { when } from '../src/Logic.js'

test('when', () => {
  const choices = {
    1: 'one',
    2: 'two',
    3: 'three',
    _: 'default',
  }

  expect(when(choices, 1)).toBe('one')
  expect(when(choices, 2)).toBe('two')
  expect(when(choices, 3)).toBe('three')
  expect(when(choices, 4)).toBe('default')
})
