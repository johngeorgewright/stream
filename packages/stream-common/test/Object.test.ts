import { PickByValue } from '@johngw/stream-common/Object'
import { Pass, check, checks } from '@johngw/stream-common/Test'

test('PickByValue', () => {
  checks([
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
    >(),
  ])
})
