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
    const [editAnnouncement, setEditAnnouncement] =
        useState<UpdateAnnouncementFrontType>({
            id: 0,
            hospitalIds: [],
            message: "",
            startAt: "",
            endAt: "",
            isActive: true
        })

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

        if (!announcement) return

        setEditAnnouncement({
            id: announcement.id,
            hospitalIds: announcement.hospitalIds,
            message: announcement.message,
            startAt: toDateTimeLocal(announcement.startAt),
            endAt: toDateTimeLocal(announcement.endAt),
            isActive: announcement.isActive
        })

    }, [announcement])

    if (!open) return null

    return (

        <div className="fixed inset-0 flex items-center justify-center bg-black/40">

            <div className="w-[700px] rounded bg-white p-6">

                <h2 className="mb-6 text-xl font-bold">
                    お知らせ編集
                </h2>

                <div className="mb-4">

                    <label>
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

                <div className="mb-4">

                    <label>
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

                    <label>
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

                <div className="flex justify-end gap-2">

                    <button
                        onClick={onClose}
                        className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
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

                            onClose()

                        }}
                    >
                        保存
                    </button>

                </div>

            </div>

        </div>

    )
}