"use client"

import DeviceModal from "@/app/components/DeviceModal"

export default function DeviceNewPage() {
  return (
    <div className="p-4">
      <DeviceModal
        onClose={() => window.close()}
        onCreate={(device) => {
          console.log(device)
          window.close()
        }}
      />
    </div>
  )
}