# n-barrier

Simple barrier implementation for syncing multiple asyncronouse tasks.

Provides two barrier implementations:
* `nBarrier` which wait for `n` tasks to reach their `.wait()` instruction
* `pBarrier` which waits for passed in promisses to resolve

## installation

`npm install n-barrier`

## usage

### nBarrier

Let `n` tasks wait for each other before continuing execution.

#### example

```js
const { nBarrier } = require('n-barrier')
const barrier = nBarrier(3) // barrier which wait for 3 tasks before opening

const startTask = time => setTimeout(() => {
  await barrier.wait() // tasks wait here before 3 tasks in total reach this point
  console.log('finished')
}, time)

startTask(0)
startTask(0)
startTask(1000)
// no console output for the first 1000ms then
// all 'finished' messages will be logged at once
```

### pBarrier

`pBarrier` works similar to `Promise.all` but you will get back a `barrier` instance with
a `wait()` method you can pass around to await the resolvement at multiple locations.

```js
const { pBarrier } = require('n-barrier')

const startTask = time => new Promise(resolve => setTimeout(() => {
  resolve()
}, time))

const asyncTaskWithBarrier = async barrier => {
  // ...do some stuff
  await barrier.wait() // wait for the other tasks to finish
  console.log('asyncTaskWithBarrier continues')
}

const barrier = pBarrier(startTask(0), startTask(0), startTask(1000))

asyncTaskWithBarrier(barrier) // starts another aync task

await barrier.wait()
console.log('all tasks finished') // will only be logged after 1000ms (after each promise resolved)
```
