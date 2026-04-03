"use client"

import DeviceModal from "../../components/DeviceModal"
import { useState } from "react"
import { Device } from "../../types/deviceTypes"

export default function Page() {
  const [devices, setDevices] = useState<Device[]>([])

  const handleCreate = (device: Device) => {
    setDevices(prev => [...prev, device])
    console.log("登録されたデバイス:", device)
  }

  const handleClose = () => {
    console.log("閉じる")
    // ページ遷移する場合は router.back() など
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <DeviceModal onClose={handleClose} onCreate={handleCreate} />
    </div>
  )
}