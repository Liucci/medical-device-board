import WardGrid from "./WardGrid"
import { Device } from "../types/deviceTypes"
import RoomContainer from "./RoomContainer"

//page.tsxより
type Props = {
  deviceList: any[]
  deviceTypes: any[]
  deviceModels: any[]
  wards:any[]
  managementNumber?: string
  serialNumber?: string
  startDrag: (target: HTMLElement,clientX: number,  clientY: number,device: Device) => void
  deleteDevice: (id: number) => void
  draggingDevice: Device | null
  pendingDevice: Device | null
  onDrop: (device: Device, wardId: number) => void
  rooms: any[]
  openRoomDeviceInfoModal: (device: Device) => void
  justDropped: boolean
  getMAlert: (deviceId?: number) => "red" | "yellow" | "green"
  wardCellSize: number
  setWardCellSize: React.Dispatch<React.SetStateAction<number>>
}
//WardAreaの役割は、病棟エリア全体を管理すること。
// 病棟エリアのレイアウトを定義し、
// 各病棟に対してWardコンポーネントを配置する。
// さらに、ドラッグアンドドロップの処理も担当する。
export default function WardArea({
                                  deviceList,
                                  deviceTypes,
                                  deviceModels,
                                  wards,
                                  startDrag,
                                  deleteDevice,
                                  draggingDevice,
                                  pendingDevice,
                                  onDrop,
                                  rooms,
                                  openRoomDeviceInfoModal,
                                  justDropped,
                                  getMAlert,
                                  wardCellSize,
                                  managementNumber,
                                  serialNumber,
                                  setWardCellSize

                                }: Props) {
  
                                  

return (
  <div
    className="p-3"
    style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }}
  >
    {/* header */}
    <div
      style={{
        flexShrink: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "0px",
        paddingBottom: "4px",
        marginBottom: "6px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <h2 className="text-1xl font-bold m-0">
        病棟一覧
      </h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        <div
          style={{
            minWidth: "48px",
            textAlign: "right",
            fontSize: "12px"
          }}
        >
          {Math.round(wardCellSize / 80 * 100)}%
        </div>

        <button
          onClick={() =>
            setWardCellSize(s => Math.max(24, s - 4))
          }
        >
          −
        </button>

        <button
          onClick={() =>
            setWardCellSize(s => Math.min(120, s + 4))
          }
        >
          ＋
        </button>

        <input
          type="range"
          min={24}
          max={120}
          step={4}
          value={wardCellSize}
          onChange={(e) =>
            setWardCellSize(Number(e.target.value))
          }
          style={{
            width: "140px"
          }}
        />
      </div>
    </div>

    {/* scroll body */}
    <div
      style={{
        flex: 1,
        overflow: "auto"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "12px"
        }}
      >
        {wards.map((ward) => (
          <div
            key={ward.wardId}
            style={{
              gridColumn:
                ward.wardId === 1
                  ? "span 3"
                  : undefined
            }}
            onMouseUp={() => {
              if (!draggingDevice) return

              onDrop(
                draggingDevice,
                ward.wardId
              )
            }}
          >
            {/* WardGridは病棟コンテナのUIを定義する関数コンポーネント */}
            {/* WardGridの中に、病室コンテナであるRoomContainerを配置する。 */}
            <WardGrid
              title={ward.wardName}
              minWidth={Math.max(
                200,
                wardCellSize * 1
              )}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px"
                }}
              >
                {rooms
                  .filter(r => r.wardId === ward.wardId)
                  .sort((a, b) =>
                          a.roomName.localeCompare(b.roomName, undefined, { numeric: true })
                        ) 
                  .map(room => (
                    <RoomContainer
                      key={room.id}
                      deviceList={deviceList}
                      deviceTypes={deviceTypes}
                      deviceModels={deviceModels}
                      rooms={rooms}
                      roomId={room.id}
                      roomName={room.roomName}
                      patientName={
              
                        room.patientName
                      }
                      startDrag={startDrag}
                      draggingDevice={
                        draggingDevice
                      }
                      pendingDevice={
                        pendingDevice
                      }
                      deleteDevice={deleteDevice}
                      openRoomDeviceInfoModal={
                        openRoomDeviceInfoModal
                      }
                      justDropped={justDropped}
                      getMAlert={getMAlert}
                      cellSize={wardCellSize}
                      managementNumber={managementNumber}
                      serialNumber={serialNumber}
                    />
                  ))}
              </div>
            </WardGrid>
          </div>
        ))}
      </div>
    </div>
  </div>
)}