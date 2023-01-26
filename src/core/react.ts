export namespace React {

    // https://github.com/facebook/react/issues/11488#issuecomment-347775628
    export function change(input: HTMLInputElement, value: string) {
        const oldValue = input.value
        input.value = value
        input.defaultValue = value
        const event = new Event("input", { bubbles: true })
        event['simulated'] = true
        input['_valueTracker']?.setValue(oldValue)
        input.dispatchEvent(event)
    }
}