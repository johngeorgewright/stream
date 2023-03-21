import { utils } from '../../src/index.js'

test('get', () => {
  expect(utils.get({ foo: { bar: 'foobar' } }, ['foo', 'bar'])).toBe('foobar')
  expect(utils.get({ a: { b: 'c' } }, ['foo', 'bar'])).toBe(undefined)
})

test('set', () => {
  expect(
    utils.set({ foo: { bar: 'foobar' } }, ['foo', 'bar'], 'barfoo')
  ).toEqual({
    foo: { bar: 'barfoo' },
  })
  expect(utils.set({ a: { b: 'c' } }, ['foo', 'bar'], 'foobar')).toEqual({
    a: { b: 'c' },
    foo: { bar: 'foobar' },
  })
  expect(() => utils.set({ a: 'b' }, ['a', 'b', 'c'], 'd')).toThrow(
    `Cannot override "a" as it's not an object in:\n{"a":"b"}`
  )
})

test('unset', () => {
  expect(utils.unset({ foo: { bar: 'foobar' } }, ['foo', 'bar'])).toEqual({
    foo: {},
  })
  expect(utils.unset({ a: { b: 'c' } }, ['foo', 'bar'])).toEqual({
    a: { b: 'c' },
  })
})
