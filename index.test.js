const { nBarrier, pBarrier } = require('./index.js')

describe('nBarrier', () => {
  describe('n barrier', () => {
    let countWait = 0
    let countPassed = 0
    beforeEach(() => {
      countWait = 0
      countPassed = 0
    })
    const task = (barrier, time) =>
      setTimeout(async () => {
        countWait++
        await barrier.wait()
        countWait--
        countPassed++
      }, time)

    it('should wait for n = 1', async done => {
      const barrier = nBarrier(1)
      task(barrier, 0)

      setTimeout(async () => {
        expect(countWait).toBe(0)
        expect(countPassed).toBe(1)
        done()
      }, 200)
    })
    it('should wait for n = 2', async done => {
      const barrier = nBarrier(2)
      task(barrier, 0)
      task(barrier, 400)

      setTimeout(async () => {
        expect(countWait).toBe(1)
        expect(countPassed).toBe(0)
      }, 200)
      setTimeout(async () => {
        expect(countWait).toBe(0)
        expect(countPassed).toBe(2)
        done()
      }, 600)
    })
    it('should wait for n = 3', async done => {
      const barrier = nBarrier(3)
      task(barrier, 0)
      task(barrier, 400)
      task(barrier, 800)

      setTimeout(async () => {
        expect(countWait).toBe(1)
        expect(countPassed).toBe(0)
      }, 200)
      setTimeout(async () => {
        expect(countWait).toBe(2)
        expect(countPassed).toBe(0)
      }, 600)
      setTimeout(async () => {
        expect(countWait).toBe(0)
        expect(countPassed).toBe(3)
        done()
      }, 1000)
    })
  })
})