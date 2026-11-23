
"use client"

import { useEffect, useState } from "react"
import { CreateAnnouncementFrontType } from "../../../types/announcementTypes"
import { HospitalManagementType } from "../../../types/hospitalTypes"
import { createAnnouncementTransaction } from "../../../../app/api/transactions/announcements/createAnnouncementTransaction"
import HospitalCheckList from "./HospitalCheckList"
import { LoadingOverlay } from "../../../components/common/LoadingOverlay"
import { executeWithErrorAndLoading } from "../../../components/common/executeWithErrorAndLoading"

type CreateAnnouncementModalProps = {
    open: boolean
    onClose: () => void
    hospitals: HospitalManagementType[]
    setAnnouncements: any
}

export default function CreateAnnouncementModal({
    open,
    onClose,
    hospitals,
    setAnnouncements
}: CreateAnnouncementModalProps) {
    const initialAnnouncement: CreateAnnouncementFrontType = {
        hospitalIds: [],
        message: "",
        startAt: "",
        endAt: ""
    }

    const [announcement, setAnnouncement] = useState<CreateAnnouncementFrontType>(initialAnnouncement)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open) setAnnouncement(initialAnnouncement)
    }, [open])

    if (!open) return null

    const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
    const labelClass = "mb-1 block text-sm font-medium text-gray-700"

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => {
                setAnnouncement(initialAnnouncement)
                onClose()
            }}>
                <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            お知らせ新規作成
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
                                        value={announcement.startAt}
                                        onChange={(e) => setAnnouncement({ ...announcement, startAt: e.target.value })}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className={labelClass}>終了日時</label>
                                    <input
                                        type="datetime-local"
                                        className={inputClass}
                                        value={announcement.endAt}
                                        onChange={(e) => setAnnouncement({ ...announcement, endAt: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-semibold text-gray-700">配信対象</label>
                                <HospitalCheckList
                                    hospitals={hospitals}
                                    selectedHospitalIds={announcement.hospitalIds}
                                    setSelectedHospitalIds={(hospitalIds: string[]) => setAnnouncement({ ...announcement, hospitalIds })}
                                />
                            </div>
                            <div className="mb-2">
                                <label className={labelClass}>お知らせ内容</label>
                                <textarea
                                    rows={6}
                                    className={inputClass}
                                    value={announcement.message}
                                    onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4 sm:px-8">
                        <button
                            className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-400"
                            onClick={() => {
                                setAnnouncement(initialAnnouncement)
                                onClose()
                            }}
                        >
                            キャンセル
                        </button>
                        <button
                            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:bg-gray-400"
                            disabled={loading}
                            onClick={async () => {
                                if (announcement.hospitalIds.length === 0) {
                                    alert("配信対象を選択してください。")
                                    return
                                }
                                if (!announcement.startAt) {
                                    alert("開始日時を入力してください。")
                                    return
                                }
                                if (!announcement.endAt) {
                                    alert("終了日時を入力してください。")
                                    return
                                }
                                if (new Date(announcement.startAt) >= new Date(announcement.endAt)) {
                                    alert("開始日時は終了日時より前にしてください。")
                                    return
                                }
                                if (!announcement.message.trim()) {
                                    alert("お知らせ内容を入力してください。")
                                    return
                                }
                                await executeWithErrorAndLoading({
                                    setLoading,
                                    action: async () => {
                                            await createAnnouncementTransaction({
                                                announcement: {
                                                    //backにはUTC時刻として渡す
                                                    ...announcement,
                                                    startAt: new Date(`${announcement.startAt}:00+09:00`).toISOString(),
                                                    endAt: new Date(`${announcement.endAt}:00+09:00`).toISOString()
                                                },
                                                setAnnouncements,
                                                onClose
                                            })

                                    setAnnouncement(initialAnnouncement)
                                    }
                                })
                            }}
                        >
                            登録
                        </button>
                    </div>
                </div>
            </div>
            <LoadingOverlay loading={loading} />
        </>
    )
}
