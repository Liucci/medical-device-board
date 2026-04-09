import WardGrid from "./WardGrid"
import Ward from "./Ward"
import { Device } from "../types/deviceTypes"
import { wards, rooms } from "../types/wards"

type Props = {
  devices: Device[]
  startDrag: (e: React.MouseEvent, device: Device) => void
  deleteDevice: (id: number) => void
  draggingDevice: Device | null
  onDrop: (
    device: Device,
    status: "stock" | "room",
    id: number
  ) => void
}

export default function WardArea({
                                  devices,
                                  startDrag,
                                  deleteDevice,
                                  draggingDevice,
                                  onDrop
                                }: Props) {

  return (
    <div className="p-3 ">

      <h2 className="text-2xl font-bold mb-3">
        病棟一覧
      </h2>            
      <div
              style={{
                 display: "grid",
                 gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px"
               }}
            >
        {wards.map((ward) => (
          <div
            key={ward.wardID}
                        style={{
              gridColumn: ward.wardID === 1 ? "span 3" : undefined
            }}
        onMouseUp={() => {
          if (!draggingDevice) return

          onDrop(draggingDevice, "room", ward.wardID)
        }}


          >
            
            {/* 病棟ごとにWardGridコンポーネントを生成。titleには病棟名を渡す。 */}
            <WardGrid title={ward.name}>
              <Ward
                devices={devices}
                wardId={ward.wardID}
                startDrag={startDrag}
                deleteDevice={deleteDevice}
                draggingDevice={draggingDevice}
              />
            </WardGrid>            
          </div>
        ))}

            </div>
    </div>
  )}
