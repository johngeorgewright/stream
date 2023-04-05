import { when } from '../src/Logic.js'

describe('when', () => {
  test('uncurried', () => {
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

  test('curried', () => {
    const number = when({
      1: 'one',
      2: 'two',
      3: 'three',
      _: 'default',
    })

    expect(number(1)).toBe('one')
    expect(number(2)).toBe('two')
    expect(number(3)).toBe('three')
    expect(number(4)).toBe('default')
  })
})
