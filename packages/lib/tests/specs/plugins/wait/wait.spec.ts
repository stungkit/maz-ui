import { installWait, WaitHandler } from '@modules/plugins'
import { createApp } from 'vue'

describe('waitHandler', () => {
  let app: ReturnType<typeof createApp>
  let waitHandler: WaitHandler

  beforeEach(() => {
    app = createApp({})
    app.use(installWait)
    waitHandler = new WaitHandler()
  })

  it('should start a loader', () => {
    const stop = waitHandler.start('loader1')
    expect(waitHandler.isLoading('loader1')).toBe(true)
    stop()
  })

  it('should stop a loader', () => {
    waitHandler.start('loader1')
    waitHandler.stop('loader1')
    expect(waitHandler.isLoading('loader1')).toBe(false)
  })

  it('should return true for anyLoading if any loader is running', () => {
    waitHandler.start('loader1')
    expect(waitHandler.anyLoading.value).toBe(true)
  })

  it('should return false for anyLoading if no loader is running', () => {
    expect(waitHandler.anyLoading.value).toBe(false)
  })
})
