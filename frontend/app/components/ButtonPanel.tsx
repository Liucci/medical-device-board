"use client"

import ButtonGrid from "./ButtonGrid"

export default function ButtonPanel() {

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

  return <ButtonGrid onAdd={handleAdd} />
}