type LongPressState = {
  timer: ReturnType<typeof setTimeout> | null
  isLongPress: boolean
}


export const createLongPressState = (): LongPressState => ({
  timer: null,
  isLongPress: false,
})

export const startLongPress = (
  state: LongPressState,
  callback: () => void,
  delay = 300
) => {
  state.isLongPress = false

  state.timer = setTimeout(() => {
    state.isLongPress = true
    callback()
  }, delay)
}

export const cancelLongPress = (
  state: LongPressState
) => {
  if (state.timer) {
    clearTimeout(state.timer)
    state.timer = null
  }
}
export const finishLongPress = (
  state: LongPressState,
  callback: () => void,
  isDragging: boolean
) => {
  cancelLongPress(state)

  if (isDragging) return

  if (!state.isLongPress) {
    callback()
  }
}