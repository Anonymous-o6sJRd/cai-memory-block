import $ from 'jquery'
import { SVG } from '../svg'
import { debouncer } from './debouncer'
import { SingleMutationObserver } from './observer'
import { React } from './react'

export namespace Memory {
  let memory: JQuery<HTMLElement>
  let memoryButton: JQuery<HTMLElement>

  export function init() {
    new SingleMutationObserver({
      debounceMs: 350,
      target: '#root',
      plugs: { '#user-input': plugMemory },
      unplugs: { '#user-input': unplugMemory },
    })
  }

  function plugMemory(userInput: JQuery<HTMLInputElement>) {
    if (memory) memory.remove()
    if (memoryButton) memoryButton.remove()

    memory = $(`
      <div id="memory-block">
        <div id="memory-form">
          <textarea id="memory-input"></textarea>
          <button id="memory-send">Send</button>
        </div>
      </div>
    `).appendTo('.chatform')

    memoryButton = $(`
      <div id="memory-button">
        ${SVG.memory('grey')}
      </div>
    `)
    $('.dropdown.dropup').after(memoryButton)

    $('.chatfooter').css('margin-bottom', 0)

    const sendButton = $(document.body.querySelector('.btn.py-0'))
    const memoryInput = memory.find('#memory-input')
    const slideHeight = memory.outerHeight()
    let showing = true

    function slide(transition = true) {
      showing = !showing

      memory.css({
        'height': showing ? slideHeight : 0,
        'transition': transition ? 'height 0.4s' : undefined,
      })

      if (transition && !showing)
        setTimeout(() => memory.css('border-width', 0), 350)
      else
        memory.css('border-width', showing ? '1px' : '0')
    }

    slide(false)

    memoryButton.on('click touchend', () => {
      slide()
      return false
    })

    memory.on('click', '#memory-send', () => {
      const msg = userInput.val()
      const mem = memoryInput.val()
      React.change(userInput[0], `*[recap: ${mem}]*\n\n${msg}`)
      sendButton.trigger('click')
      slide()
      return false
    })

    const saveDebouncer = debouncer(300, () => {
      saveMemory(memoryInput.val())
    })

    memoryInput.on('change keyup paste', saveDebouncer.call)
    memoryInput.val(loadMemory())
  }

  function unplugMemory() {
    memory?.remove()
    memoryButton?.remove()
    memory = undefined
    memoryButton = undefined
  }

  function loadMemory(): string {
    return GM_getValue('memory_' + charId())
  }

  function saveMemory(value: any) {
    GM_setValue('memory_' + charId(), value)
  }

  function charId() {
    const url = window.location.search
    return url.substring(url.indexOf('=') + 1)
  }
}
