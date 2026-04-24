import { useState } from "react"
import StockAreaSettingsModal from "./StockAreaSettingsModal"
import WardAreaSettingsModal from "./WardAreaSettingsModal"
import DeviceTypeSettingsModal from "./DeviceTypeSettingsModal"
import { createPortal } from "react-dom"
//ButtonPanel.tsxからPropsを受け取る
type Props = {
  onClose: () => void
  stockAreas: { id: number; name: string }[]
  deviceTypes: { id: number; name: string }[]
  deviceModels: { id: number; device_type_id: number; name: string }[]
  wards: { id: number; name: string }[]
  rooms: { id: number; ward_id: number; name: string }[]
  addStockArea: (name: string) => Promise<void>
  renameStockArea: (id: number, newName: string) => Promise<void>
  deleteStockAreas: (ids: number[]) => Promise<void>
  addWard: (name: string) => Promise<void>
  renameWard: (id: number, newName: string) => Promise<void>
  deleteWards: (ids: number[]) => Promise<void>
  addRoom: (wardId: number, name: string) => Promise<void>
  renameRoom: (id: number, newName: string) => Promise<void>
  deleteRooms: (ids: number[]) => Promise<void>
  addDeviceType: (name: string) => Promise<void>
  renameDeviceType: (id: number, newName: string) => Promise<void>
  deleteDeviceTypes: (ids: number[]) => Promise<void>
  addDeviceModel: (deviceTypeId: number, name: string) => Promise<void>
  renameDeviceModel: (id: number, newName: string) => Promise<void>
  deleteDeviceModels: (ids: number[]) => Promise<void>

}

export default function SettingsModal({                                         
                                        onClose,
                                        stockAreas,
                                        deviceTypes,
                                        deviceModels,
                                        wards,
                                        rooms,
                                        addStockArea,
                                        renameStockArea,
                                        deleteStockAreas,
                                        addWard,
                                        renameWard,
                                        deleteWards,
                                        addRoom,
                                        renameRoom,
                                        deleteRooms,
                                        addDeviceType,
                                        renameDeviceType,
                                        deleteDeviceTypes,
                                        addDeviceModel,
                                        renameDeviceModel,
                                        deleteDeviceModels
                                      }: Props)
                                      {
  const [mode, setMode] = useState<"menu" | "stock" | "ward" | "deviceType">("menu")


return createPortal(
  <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
    
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">
      <button onClick={onClose} className="mb-4">閉じる</button>

      {mode === "menu" && (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center">設定</h2>

          <button
            className="w-full mb-2 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => setMode("stock")}
          >
            ストックエリア編集
          </button>

          <button
            className="w-full mb-2 px-4 py-2 bg-green-500 text-white rounded"
            onClick={() => setMode("ward")}
          >
            病棟エリア編集
          </button>
          
          <button
            className="w-full mb-2 px-4 py-2 bg-purple-500 text-white rounded"
            onClick={() => setMode("deviceType")}
          >
            機器タイプ編集
          </button>
          
        </>
      )}

      {mode === "stock" && (
        <>
          <button onClick={() => setMode("menu")} className="mb-4">← 戻る</button>
          <StockAreaSettingsModal 
            stockAreas={stockAreas}
            addStockArea={addStockArea}
            renameStockArea={renameStockArea}
            deleteStockAreas={deleteStockAreas}
            />
        </>
      )}

      {mode === "ward" && (
        <>
          <button onClick={() => setMode("menu")} className="mb-4">← 戻る</button>
          <WardAreaSettingsModal 
            wards={wards} 
            rooms={rooms} 
            addWard={addWard}
            renameWard={renameWard}
            deleteWards={deleteWards}
            addRoom={addRoom}
            renameRoom={renameRoom}
            deleteRooms={deleteRooms}
          />
        </>
      )}
      {mode === "deviceType" && (
        <>
          <button onClick={() => setMode("menu")} className="mb-4">← 戻る</button>
          <DeviceTypeSettingsModal 
            deviceTypes={deviceTypes}
            deviceModels={deviceModels}
            addDeviceType={addDeviceType}
            renameDeviceType={renameDeviceType}
            deleteDeviceTypes={deleteDeviceTypes}
            addDeviceModel={addDeviceModel}
            renameDeviceModel={renameDeviceModel}
            deleteDeviceModels={deleteDeviceModels}
          />
        </>
      )}

    </div>

  </div>,
  document.body
)
}
