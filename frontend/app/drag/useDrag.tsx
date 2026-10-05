import { useState } from "react"
import { Device } from "../types/deviceTypes"

export function useDrag() {
  const [draggingDevice, setDraggingDevice] = useState<Device | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

const startDrag = (
  target: HTMLElement,
  clientX: number,
  clientY: number,
  device: Device
) => {
  const rect = target.getBoundingClientRect()

  setDragOffset({
    x: clientX - rect.left,
    y: clientY - rect.top
  })

  setMousePos({
    x: clientX,
    y: clientY
  })

  setIsDragging(true)
  setDraggingDevice(device)
}

const updateMousePos = (
  x: number,
  y: number
) => {
  setMousePos({ x, y })
}
const endDrag = () => {
  setDraggingDevice(null)
  setIsDragging(false)
}



return {
  draggingDevice,
  setDraggingDevice,
  isDragging,
  setIsDragging,
  mousePos,
  setMousePos,
  dragOffset,
  setDragOffset,
  startDrag,
  updateMousePos,
  endDrag,


}}