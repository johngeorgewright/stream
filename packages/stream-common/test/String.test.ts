import { takeCharsUntil, takeCharsWhile } from '../src/String.js'

test('takeCharsWhile', () => {
  expect(takeCharsWhile('111222', '1')).toBe('111')
  expect(takeCharsWhile('12345abc', (x) => /\d/.test(x))).toBe('12345')
})

test('takeCharsUntil', () => {
  expect(takeCharsUntil('111222333', '3')).toBe('111222')
  expect(takeCharsUntil('1234abcd', (x) => !/\d/.test(x))).toBe('1234')
})
