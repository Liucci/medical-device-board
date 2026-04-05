type Props = {
  draggingDevice: Device | null
  mousePos: { x: number; y: number }
}

export default function DragLayer({  draggingDevice, mousePos }: Props) {

  if (!draggingDevice) return null

  return (
    <div
      style={{
        position: "fixed",
        left: mousePos.x,
        top: mousePos.y,
        transform: "translate(-50%, -50%)"
      }}
    >
      {draggingDevice.name}
    </div>
  )
}