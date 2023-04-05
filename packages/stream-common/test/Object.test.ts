import { PickByValue } from '../src/Object.js'
import { Pass, check } from '../src/Test.js'

test('PickByValue', () => {
  check<
    PickByValue<
      {
        foo: 'bar'
        num: 1
        bool: true
        mar: 'far'
      },
      string
    >,
    { foo: 'bar'; mar: 'far' },
    Pass
  >()
})
