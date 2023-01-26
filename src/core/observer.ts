import $ from 'jquery'
import { debouncer, Debouncer } from './debouncer'

const DOM_KEY = 'observed'

export class SingleMutationObserver {
  private root: Element
  private plugs: { [plug: string]: (el: JQuery) => void }
  private unplugs: { [unplug: string]: () => void }
  private obs: MutationObserver
  private debouncer: Debouncer

  constructor(opt: {
    target: string
    debounceMs?: number,
    plugs?: { [plug: string]: (el: JQuery) => void }
    unplugs?: { [unplug: string]: () => void }
  }) {
    this.root = document.body.querySelector(opt.target)
    this.plugs = opt.plugs
    this.unplugs = opt.unplugs
    if (!opt.debounceMs) opt.debounceMs = 200
    this.debouncer = debouncer(opt.debounceMs, this.connect.bind(this))
    this.connect()
  }

  disconnect() {
    this.obs.disconnect()
    delete this.obs
  }

  private connect() {
    if (this.obs) {
      this.unplug()
      this.disconnect()
    }
    this.plug()
    this.obs = new MutationObserver(this.debouncer.call)
    this.obs.observe(document.body, { childList: true, subtree: true })
  }

  private plug() {
    if (!this.plugs) return
    for (const [selector, callback] of Object.entries(this.plugs)) {
      for (const target of this.root.querySelectorAll(selector)) {
        if (target instanceof HTMLElement && !target.dataset[DOM_KEY]) {
          callback($(target))
          target.dataset[DOM_KEY] = 'true'
        }
      }
    }
  }

  private unplug() {
    if (!this.unplugs) return
    for (const [selector, callback] of Object.entries(this.unplugs)) {
      const targets = this.root.querySelectorAll(selector)
      if (!targets.length) callback()
    }
  }
}
