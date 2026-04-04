"use client"
import DeviceModal from "./DeviceModal"
import ButtonGrid from "./ButtonGrid"
import { useState } from "react"
import { Device } from "../types/deviceTypes"

//page.tsxからaddDevice関数をpropsで受け取る
type Props = {
addDevice: (device: Device) => void}

export default function ButtonPanel({ addDevice }: Props) {
    const [openDeviceModal, setOpenDeviceModal] = useState(false)

  
  const handleAdd = () => {
    const width = 600
    const height = 700

    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    window.open(
      "/device/new",
      "_blank",
      `width=${width},height=${height},left=${left},top=${top}`
    )
  }

  const OpenModal = () => {
    setOpenDeviceModal(true)
  }

  return(
    <>
      <ButtonGrid onAdd={OpenModal} title={"新規登録"} />
        {/* 隙間を空ける */}
      <div className="h-4" />
      <ButtonGrid onAdd={handleAdd} title={"設定"} />
      {/* openDeviceModal=trueのときにモーダルを表示 */}
      {/*Modalの登録ボタンにはaddDevice関数を渡す*/}
      {openDeviceModal && <DeviceModal onCreate={addDevice} onClose={() => setOpenDeviceModal(false)} />}
    </>
  )
}