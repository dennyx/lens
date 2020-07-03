import mockFs from "mock-fs"
import { userStore, UserStore } from "./user-store"

// fixme: most probably due __mocks_/electron.ts "projectVersion" from "electron-store" cannot be ensured
describe.skip("for an empty config", () => {
  beforeEach(() => {
    UserStore.resetInstance()
    const mockOpts = {
      'tmp': {
        'config.json': JSON.stringify({})
      }
    }
    mockFs(mockOpts)
    const userStore = UserStore.getInstance()
  })

  afterEach(() => {
    mockFs.restore()
  })

  it("allows setting and retrieving lastSeenAppVersion", async () => {
    userStore.setLastSeenAppVersion("1.2.3");
    expect(userStore.lastSeenAppVersion()).toBe("1.2.3");
  })

  it("allows adding and listing seen contexts", async () => {
    userStore.storeSeenContext(['foo'])
    expect(userStore.getSeenContexts().length).toBe(1)
    userStore.storeSeenContext(['foo', 'bar'])
    const seenContexts = userStore.getSeenContexts()
    expect(seenContexts.length).toBe(2) // check 'foo' isn't added twice
    expect(seenContexts[0]).toBe('foo')
    expect(seenContexts[1]).toBe('bar')
  })

  it("allows setting and getting preferences", async () => {
    userStore.setPreferences({
      httpsProxy: 'abcd://defg',
    })
    const storedPreferences = userStore.getPreferences()
    expect(storedPreferences.httpsProxy).toBe('abcd://defg')
    expect(storedPreferences.colorTheme).toBe('dark') // defaults to dark
    userStore.setPreferences({
      colorTheme: 'light'
    })
    expect(userStore.getPreferences().colorTheme).toBe('light')
  })
})

describe.skip("migrations", () => {
  beforeEach(() => {
    UserStore.resetInstance()
    const mockOpts = {
      'tmp': {
        'config.json': JSON.stringify({
          user: { username: 'foobar' },
          preferences: { colorTheme: 'light' },
          lastSeenAppVersion: '1.2.3'
        })
      }
    }
    mockFs(mockOpts)
    const userStore = UserStore.getInstance()
  })

  afterEach(() => {
    mockFs.restore()
  })

  it("sets last seen app version to 0.0.0", async () => {
    expect(userStore.lastSeenAppVersion()).toBe('0.0.0')
  })
})