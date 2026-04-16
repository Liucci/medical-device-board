import WardGrid from "./WardGrid"
import Ward from "./escapes/Ward"
import { Device } from "../types/deviceTypes"
import { wards } from "../types/wards"
import type { Room as RoomType} from "../types/wards"
import Room from "./RoomContainer"
import RoomContainer from "./RoomContainer"

type Props = {
  devices: Device[]
  startDrag: (target: HTMLElement,clientX: number,  clientY: number,device: Device) => void
  deleteDevice: (id: number) => void
  draggingDevice: Device | null
  pendingDevice: Device | null
  onDrop: (device: Device, wardId: number) => void
  rooms: RoomType[]
  openRoomDeviceInfoModal: (device: Device) => void
  justDropped: boolean
}
//WardAreaの役割は、病棟エリア全体を管理すること。
// 病棟エリアのレイアウトを定義し、
// 各病棟に対してWardコンポーネントを配置する。
// さらに、ドラッグアンドドロップの処理も担当する。
export default function WardArea({
                                  devices,
                                  startDrag,
                                  deleteDevice,
                                  draggingDevice,
                                  pendingDevice,
                                  onDrop,
                                  rooms,
                                  openRoomDeviceInfoModal,
                                  justDropped

                                }: Props) {
  
                                  

  return (
    <div className="p-3 ">

      <h2 className="text-2xl font-bold mb-3">
        病棟一覧
      </h2>            
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                //gridTemplateColumns:"1fr",
                alignItems: "flex-start",
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
                                  //onDropにdraggingDeviceとward.wardIDを渡す
                                    onDrop(draggingDevice, ward.wardID)
                                  }}
                              >
            
        {/* WardGridを呼び出し、病棟ごとにWardGridコンポーネントを生成。titleには病棟名を渡す。 */}
            <WardGrid title={ward.name}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",  // 👈 横並び + 折り返し
                    gap: "12px"
                  }}
                >
                  {rooms
                    .filter(r => r.wardId === ward.wardID)
                    .map(room => (
                      <RoomContainer
                        key={room.id}
                        devices={devices}
                        roomId={room.id}
                        roomName={room.roomName}
                        patientName={room.patientName}
                        startDrag={startDrag}
                        draggingDevice={draggingDevice}
                        pendingDevice={pendingDevice}
                        deleteDevice={deleteDevice}
                        openRoomDeviceInfoModal={openRoomDeviceInfoModal}
                        justDropped={justDropped}
                      />
                    ))}
              </div>
            </WardGrid>            
          </div>
        ))}

      </div>
    </div>
  )}
