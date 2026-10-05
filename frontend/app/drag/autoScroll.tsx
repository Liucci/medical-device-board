import React from "react"
const AUTO_SCROLL_MARGIN = 60
const AUTO_SCROLL_SPEED = 10

export const autoScroll = (
  container: HTMLElement,
  mouseX: number,
  mouseY: number
) => {

  const rect = container.getBoundingClientRect()

  // 上
  if (mouseY < rect.top + AUTO_SCROLL_MARGIN) {
    container.scrollTop -= AUTO_SCROLL_SPEED
  }

  // 下
  if (mouseY > rect.bottom - AUTO_SCROLL_MARGIN) {
    container.scrollTop += AUTO_SCROLL_SPEED
  }

  // 左
  if (mouseX < rect.left + AUTO_SCROLL_MARGIN) {
    container.scrollLeft -= AUTO_SCROLL_SPEED
  }

  // 右
  if (mouseX > rect.right - AUTO_SCROLL_MARGIN) {
    container.scrollLeft += AUTO_SCROLL_SPEED
  }
}

export const isInside = (
  e: React.PointerEvent,
  el: HTMLElement
) => {
  const rect = el.getBoundingClientRect()

  return (
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom
  )
}