"use client"

import { useEffect, useState } from "react"

import {
    AnnouncementFrontType,
    UpdateAnnouncementFrontType
} from "../../../types/announcementType"

import { HospitalManagementType } from "../../../types/hospitalTypes"

import { updateAnnouncementTransaction } from "@/app/api/transactions/announcements/updateAnnouncementTransaction"

import HospitalCheckList from "./HospitalCheckList"

type UpdateAnnouncementModalProps = {
    open: boolean
    onClose: () => void
    announcement: AnnouncementFrontType
    hospitals: HospitalManagementType[]
    setAnnouncements: any
}

export default function UpdateAnnouncementModal({
    open,
    onClose,
    announcement,
    hospitals,
    setAnnouncements
}: UpdateAnnouncementModalProps)
{
    const initialEditAnnouncement: UpdateAnnouncementFrontType = {
                                    id: 0,
                                    hospitalIds: [],
                                    message: "",
                                    startAt: "",
                                    endAt: "",
                                    isActive: true
    }
    const [editAnnouncement, setEditAnnouncement] =useState<UpdateAnnouncementFrontType>(initialEditAnnouncement)

    const toDateTimeLocal = (value: string) => {
            const date = new Date(value)
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, "0")
            const day = String(date.getDate()).padStart(2, "0")
            const hour = String(date.getHours()).padStart(2, "0")
            const minute = String(date.getMinutes()).padStart(2, "0")
            return `${year}-${month}-${day}T${hour}:${minute}`
}


useEffect(() => {

    if (!open || !announcement) {
        return
    }

    setEditAnnouncement({
        id: announcement.id,
        hospitalIds: [...announcement.hospitalIds],
        message: announcement.message,
        startAt: toDateTimeLocal(announcement.startAt),
        endAt: toDateTimeLocal(announcement.endAt),
        isActive: announcement.isActive
    })

}, [open, announcement])
    if (!open) return null

return (

    <div
        className="fixed inset-0 flex items-center justify-center bg-black/40"
    onClick={() => {
        setEditAnnouncement(initialEditAnnouncement)
        onClose()
    }}
    >

        <div
            className="w-full max-w-3xl rounded-xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
        >

            <h2 className="mb-6 text-xl font-bold">
                お知らせ編集
            </h2>

            <div className="mx-auto max-w-2xl">

                <div className="mb-4 flex gap-4">

                    <div className="flex-1">

                        <label className="mb-1 block">
                            開始日時
                        </label>

                        <input
                            type="datetime-local"
                            className="w-full rounded border p-2"
                            value={editAnnouncement.startAt}
                            onChange={(e) =>
                                setEditAnnouncement({
                                    ...editAnnouncement,
                                    startAt: e.target.value
                                })
                            }
                        />

                    </div>

                    <div className="flex-1">

                        <label className="mb-1 block">
                            終了日時
                        </label>

                        <input
                            type="datetime-local"
                            className="w-full rounded border p-2"
                            value={editAnnouncement.endAt}
                            onChange={(e) =>
                                setEditAnnouncement({
                                    ...editAnnouncement,
                                    endAt: e.target.value
                                })
                            }
                        />

                    </div>

                </div>

                <div className="mb-4">

                    <label className="mb-2 block font-semibold">
                        配信対象
                    </label>

                    <HospitalCheckList
                        hospitals={hospitals}
                        selectedHospitalIds={editAnnouncement.hospitalIds}
                        setSelectedHospitalIds={(hospitalIds: string[]) =>
                            setEditAnnouncement({
                                ...editAnnouncement,
                                hospitalIds
                            })
                        }
                    />

                </div>

                <div className="mb-4">

                    <label className="mb-1 block">
                        お知らせ内容
                    </label>

                    <textarea
                        rows={6}
                        className="w-full rounded border p-2"
                        value={editAnnouncement.message}
                        onChange={(e) =>
                            setEditAnnouncement({
                                ...editAnnouncement,
                                message: e.target.value
                            })
                        }
                    />

                </div>

                <div className="mb-6 flex items-center gap-2">

                    <input
                        type="checkbox"
                        checked={editAnnouncement.isActive}
                        onChange={(e) =>
                            setEditAnnouncement({
                                ...editAnnouncement,
                                isActive: e.target.checked
                            })
                        }
                    />

                    <span>
                        配信中
                    </span>

                </div>

            </div>

            <div className="flex justify-end gap-2">

                <button
                    className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                    onClick={() => {
                        setEditAnnouncement(initialEditAnnouncement)
                        onClose()
                    }}
                >
                    キャンセル
                </button>

                <button
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={async () => {

                        await updateAnnouncementTransaction({
                            announcement: editAnnouncement,
                            setAnnouncements
                        })
                        setEditAnnouncement(initialEditAnnouncement)
                        onClose()

                    }}
                >
                    保存
                </button>

            </div>

        </div>

    </div>

)}