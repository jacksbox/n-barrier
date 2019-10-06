import { tsConstructorType } from "@babel/types"

interface BarrierInterface {
  wait(): Promise<void>
}

type QueueEntry = {
  dequeue(): void
}

type Queue = Array<QueueEntry>

class N_Barrier implements BarrierInterface {
  private bound: number
  private reached: number
  private queue: Queue

  constructor(n) {
    this.bound = n
    this.reached = 0
    this.queue = []
  }

  async wait(){
    this.reached++
    if (this.reached >= this.bound) {
      this.queue.forEach(entry => entry.dequeue())
      return Promise.resolve()
    }
    const entry = <QueueEntry>{ dequeue: null}
    this.queue.push(entry)
    return new Promise<void>(resolve => {
      entry.dequeue = () => resolve()
    })
  }
}

class P_Barrier implements BarrierInterface {
  private fullfiled: boolean
  private queue: Array<QueueEntry>

  constructor(asyncProcesses) {
    this.fullfiled = false
    this.queue = []
    Promise.all(asyncProcesses).then(() => {
      this.fullfiled = true
      this.queue.forEach(entry => entry.dequeue())
    })
  }

  async wait(): Promise<void> {
    if (this.fullfiled) {
      return Promise.resolve()
    }
    const entry = <QueueEntry>{ dequeue: null}
    this.queue.push(entry)
    return new Promise<void>(resolve => {
      entry.dequeue = () => resolve()
    })
  }
}

function nBarrier(n: number): N_Barrier {
  if (typeof n === 'number') {
    return new N_Barrier(n)
  }
  throw new Error(`Expected number, got '${typeof n}'.`);
}

function pBarrier(...asyncProcesses: Promise<void>[]): P_Barrier {
  if (typeof asyncProcesses === 'object' && asyncProcesses instanceof Array) {
    return new P_Barrier(asyncProcesses)
  }
  throw new Error(`Expected array of Promises instead got '${typeof asyncProcesses}'.`);
}

export = { nBarrier, pBarrier }
