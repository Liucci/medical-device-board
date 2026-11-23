
"use client"

import { useEffect, useState } from "react"
import { AnnouncementFrontType, UpdateAnnouncementFrontType } from "../../../types/announcementTypes"
import { HospitalManagementType } from "../../../types/hospitalTypes"
import { updateAnnouncementTransaction } from "@/app/api/transactions/announcements/updateAnnouncementTransaction"
import HospitalCheckList from "./HospitalCheckList"
import { LoadingOverlay } from "../../../components/common/LoadingOverlay"
import { executeWithErrorAndLoading } from "../../../components/common/executeWithErrorAndLoading"

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
}: UpdateAnnouncementModalProps) {
    const initialEditAnnouncement: UpdateAnnouncementFrontType = {
        id: 0,
        hospitalIds: [],
        message: "",
        startAt: "",
        endAt: "",
        isActive: true
    }

    const [editAnnouncement, setEditAnnouncement] = useState<UpdateAnnouncementFrontType>(initialEditAnnouncement)
    const [loading, setLoading] = useState(false)

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
        if (!open || !announcement) return

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

    const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
    const labelClass = "mb-1 block text-sm font-medium text-gray-700"

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => {
                setEditAnnouncement(initialEditAnnouncement)
                onClose()
            }}>
                <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            お知らせ編集
                        </h2>
                    </div>
                    <div className="overflow-y-auto px-6 py-5 sm:px-8">
                        <div className="mx-auto max-w-2xl">
                            <div className="mb-4 flex flex-col gap-4 sm:flex-row">
                                <div className="flex-1">
                                    <label className={labelClass}>開始日時</label>
                                    <input
                                        type="datetime-local"
                                        className={inputClass}
                                        value={editAnnouncement.startAt}
                                        onChange={(e) => setEditAnnouncement({ ...editAnnouncement, startAt: e.target.value })}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className={labelClass}>終了日時</label>
                                    <input
                                        type="datetime-local"
                                        className={inputClass}
                                        value={editAnnouncement.endAt}
                                        onChange={(e) => setEditAnnouncement({ ...editAnnouncement, endAt: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-semibold text-gray-700">配信対象</label>
                                <HospitalCheckList
                                    hospitals={hospitals}
                                    selectedHospitalIds={editAnnouncement.hospitalIds}
                                    setSelectedHospitalIds={(hospitalIds: string[]) => setEditAnnouncement({ ...editAnnouncement, hospitalIds })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className={labelClass}>お知らせ内容</label>
                                <textarea
                                    rows={6}
                                    className={inputClass}
                                    value={editAnnouncement.message}
                                    onChange={(e) => setEditAnnouncement({ ...editAnnouncement, message: e.target.value })}
                                />
                            </div>
                            <div className="mb-2 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={editAnnouncement.isActive}
                                    onChange={(e) => setEditAnnouncement({ ...editAnnouncement, isActive: e.target.checked })}
                                    className="h-4 w-4 accent-blue-500"
                                />
                                <span className="text-sm text-gray-700">
                                    配信中
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4 sm:px-8">
                        <button
                            className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-400"
                            onClick={() => {
                                setEditAnnouncement(initialEditAnnouncement)
                                onClose()
                            }}
                        >
                            キャンセル
                        </button>
                        <button
                            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:bg-gray-400"
                            disabled={loading}
                            onClick={async () => {
                                if (editAnnouncement.hospitalIds.length === 0) {
                                    alert("配信対象を選択してください。")
                                    return
                                }
                                await executeWithErrorAndLoading({
                                    setLoading,
                                    action: async () => {
                                        //UTCに変換してbackendに渡す
                                        await updateAnnouncementTransaction({
                                            announcement: {
                                                ...editAnnouncement,
                                                startAt: new Date(`${editAnnouncement.startAt}:00+09:00`).toISOString(),
                                                endAt: new Date(`${editAnnouncement.endAt}:00+09:00`).toISOString()
                                            },
                                            setAnnouncements
                                        })

                                        setEditAnnouncement(initialEditAnnouncement)
                                        onClose()
                                    }
                                })
                            }}
                        >
                            保存
                        </button>
                    </div>
                </div>
            </div>
            <LoadingOverlay loading={loading} />
        </>
    )
}
