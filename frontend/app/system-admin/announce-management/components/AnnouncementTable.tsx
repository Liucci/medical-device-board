"use client"

import { AnnouncementFrontType } from "../../../types/announcementType"

type AnnouncementTableProps = {
    announcements: AnnouncementFrontType[]
    setSelectedAnnouncement: any
    setOpenUpdateModal: any
}

export default function AnnouncementTable({
    announcements,
    setSelectedAnnouncement,
    setOpenUpdateModal
}: AnnouncementTableProps)

{

const formatDateTime = (value: string) => {

    const date = new Date(value)

    return date.toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    })

}
    return (
        <table className="mt-4 w-full border border-gray-300">

            <thead className="bg-gray-100">

                <tr>
                    <th className="border p-2"></th>
                    <th className="border p-2">対象</th>
                    <th className="border p-2">開始日時</th>
                    <th className="border p-2">終了日時</th>
                    <th className="border p-2">状態</th>
                    <th className="border p-2">内容</th>
                </tr>

            </thead>

            <tbody>

                {
                    announcements.map((announcement) => (

                        <tr key={announcement.id}>

                            <td className="border p-2 text-center">
                                <button
                                    className="rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600"
                                    onClick={() => {
                                        setSelectedAnnouncement(announcement)
                                        setOpenUpdateModal(true)
                                    }}
                                >
                                    編集
                                </button>
                            </td>

                            <td className="border p-2">
                                {
                                    announcement.hospitalIds.length === 0
                                        ? "全病院"
                                        : `${announcement.hospitalIds.length}病院`
                                }
                            </td>

                            <td className="border p-2">
                            {formatDateTime(announcement.startAt)}
                            </td>

                            <td className="border p-2">
                            {formatDateTime(announcement.endAt)}
                            </td>

                            <td className="border p-2 text-center">
                                {
                                    announcement.isActive
                                        ? "表示中"
                                        : "停止"
                                }
                            </td>

                            <td className="border p-2">
                                {announcement.message}
                            </td>

                        </tr>

                    ))
                }

            </tbody>

        </table>
    )
}