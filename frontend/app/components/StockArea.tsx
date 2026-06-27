"use client"

import StockGrid from "./StockGrid"
import Stock from "./Stock"
import { Device } from "../types/deviceTypes"
import { StockAreaType } from "../types/stockTypes"
import { DeviceTypeType } from "../types/deviceTypeTypes"
import { DeviceModelType } from "../types/deviceModelTypes"

//page.tsxより
type Props = {  
  deviceList: Device[]
  stockAreas: StockAreaType[]
  deviceTypes: DeviceTypeType[]
  deviceModels: DeviceModelType[]
  managementNumber: string | undefined
  serialNumber: string | undefined
  startDrag: (target: HTMLElement,clientX: number,  clientY: number,device: Device) => void
  handleMouseMove: (e: React.PointerEvent) => void
  deleteDevice: (id: number) => void
  draggingDevice: Device | null
  pendingDevice: Device | null
  onDrop:(device: Device, stockAreaId: number) => void
  openStockInfoModal: (device: Device) => void
  getMAlert: (deviceId?: number) => "red" | "yellow" | "green"
  stockCellSize: number
  setStockCellSize: React.Dispatch<React.SetStateAction<number>>
  currentUser: any
  scrollRef: React.RefObject<HTMLDivElement | null>
  isDraggingRef: React.MutableRefObject<boolean>


}

export default function StockAreas({ deviceList,
                                     stockAreas,
                                     deviceTypes,
                                     deviceModels,
                                     managementNumber,
                                     serialNumber,
                                     startDrag,
                                     handleMouseMove,
                                     deleteDevice,
                                     draggingDevice,
                                     pendingDevice,
                                     onDrop,
                                     openStockInfoModal,
                                    getMAlert,
                                    stockCellSize,
                                    setStockCellSize,
                                    currentUser,
                                    scrollRef,
                                    isDraggingRef
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
        ストックエリア一覧
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
          {Math.round(stockCellSize / 80 * 100)}%
        </div>

        <button
          onClick={() =>
            setStockCellSize(s => Math.max(24, s - 4))
          }
        >
          −
        </button>

        <button
          onClick={() =>
            setStockCellSize(s => Math.min(120, s + 4))
          }
        >
          ＋
        </button>

        <input
          type="range"
          min={24}
          max={120}
          step={4}
          value={stockCellSize}
          onChange={(e) =>
            setStockCellSize(Number(e.target.value))
          }
          style={{
            width: "140px"
          }}
        />
      </div>
    </div>

    {/* scroll body */}

    <div
      ref={scrollRef}
      style={{
        flex: 1,
        overflow: "auto"
      }}
    >      
    
    <div
      style={{
        display: "flex",

        // ★ 横並び
        flexDirection: "row",

        // ★ 自動折返し
        flexWrap: "wrap",

        alignItems: "flex-start",

        gap: "12px"
      }}
    >

  {
[...stockAreas]
  .sort((a, b) => a.displayOrder - b.displayOrder)
  .map((area) => (
     <div
        key={area.id}
        style={{
          gridColumn: area.id === 1 ? "span 3" : undefined
        }}

        

        // ★ここに追加
        onPointerUp={() => {
          if (!draggingDevice) return
          //onDropにdraggingDeviceとarea.idを渡す
          onDrop(draggingDevice, area.id)
        }}
      >           
   {/*StockGirdにtitleを渡す。childrenには条件に応じてStockコンポーネントを配置。*/}
          <StockGrid
              title={area.name}
              cellSize={stockCellSize}
            >             
              {/* Stockは機器アイコン作成ファイル */}
                <Stock
                  deviceList={deviceList}     // 修正: deviceList → devices
                  stockAreaId={area.id}
                  deviceTypes={deviceTypes}
                  deviceModels={deviceModels}

                  startDrag={startDrag}
                  handleMouseMove={handleMouseMove}
                  deleteDevice={deleteDevice}
                  draggingDevice={draggingDevice}
                  pendingDevice={pendingDevice}
                  openStockInfoModal={openStockInfoModal}
                  getMAlert={getMAlert}
                  cellSize={stockCellSize}
                  managementNumber={managementNumber}
                  serialNumber={serialNumber}
                  currentUser={currentUser}
                  isDraggingRef={isDraggingRef}
                />
            </StockGrid>
          </div>
        ))}
      </div>

    </div>
  </div>
  )
}