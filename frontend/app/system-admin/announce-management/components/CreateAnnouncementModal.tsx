"use client"

import { useEffect,useState } from "react"

import { CreateAnnouncementFrontType } from "../../../types/announcementType"
import { HospitalManagementType } from "../../../types/hospitalTypes"

import { createAnnouncementTransaction } from "../../../../app/api/transactions/announcements/createAnnouncementTransaction"

import HospitalCheckList from "./HospitalCheckList"


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
                                                }: CreateAnnouncementModalProps)
{
    const initialAnnouncement: CreateAnnouncementFrontType = {
                                                            hospitalIds: [],
                                                            message: "",
                                                            startAt: "",
                                                            endAt: ""
    }

    const [announcement, setAnnouncement] =useState<CreateAnnouncementFrontType>(initialAnnouncement)

    useEffect(() => {
        if (open) {
            setAnnouncement(initialAnnouncement)
        }
    }, [open])

    if (!open) return null

  return (

<div
    className="fixed inset-0 flex items-center justify-center bg-black/40"
    onClick={() => {
        setAnnouncement(initialAnnouncement)
        onClose()
    }}
>

    <div
        className="w-full max-w-3xl rounded-xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
    >
        <div className="w-full max-w-3xl rounded-2xl bg-white p-6">
            <h2 className="mb-6 text-xl font-bold">
                お知らせ新規作成
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
                            value={announcement.startAt}
                            onChange={(e) =>
                                setAnnouncement({
                                    ...announcement,
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
                            value={announcement.endAt}
                            onChange={(e) =>
                                setAnnouncement({
                                    ...announcement,
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
                        selectedHospitalIds={announcement.hospitalIds}
                        setSelectedHospitalIds={(hospitalIds: string[]) =>
                            setAnnouncement({
                                ...announcement,
                                hospitalIds
                            })
                        }
                    />

                </div>

                <div className="mb-6">

                    <label className="mb-1 block">
                        お知らせ内容
                    </label>

                    <textarea
                        rows={6}
                        className="w-full rounded border p-2"
                        value={announcement.message}
                        onChange={(e) =>
                            setAnnouncement({
                                ...announcement,
                                message: e.target.value
                            })
                        }
                    />

                </div>

            </div>

            <div className="flex justify-end gap-2">

                <button
                    className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                    onClick={() => {
                        setAnnouncement(initialAnnouncement)
                        onClose()
                    }}
                >
                    キャンセル
                </button>

                <button
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
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

                        await createAnnouncementTransaction({
                            announcement,
                            setAnnouncements,
                            onClose
                        })

                        setAnnouncement(initialAnnouncement)

                    }}
                >
                    登録
                </button>

            </div>

        </div>

    </div>
</div>
    )}