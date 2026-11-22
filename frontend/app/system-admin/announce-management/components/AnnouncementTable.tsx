
"use client"

import { AnnouncementFrontType } from "../../../types/announcementTypes"

type AnnouncementTableProps = {
    announcements: AnnouncementFrontType[]
    setSelectedAnnouncement: any
    setOpenUpdateModal: any
}

export default function AnnouncementTable({
    announcements,
    setSelectedAnnouncement,
    setOpenUpdateModal
}: AnnouncementTableProps) {
    console.log("AnnouncementTable")

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
        <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-sm">
                <thead className="bg-[#1a2a4d] text-[#c5d0eb]">
                    <tr>
                        <th className="border-b border-white/10 px-3 py-3 font-semibold"></th>
                        <th className="border-b border-white/10 px-3 py-3 font-semibold">対象</th>
                        <th className="border-b border-white/10 px-3 py-3 font-semibold">開始日時</th>
                        <th className="border-b border-white/10 px-3 py-3 font-semibold">終了日時</th>
                        <th className="border-b border-white/10 px-3 py-3 font-semibold">状態</th>
                        <th className="border-b border-white/10 px-3 py-3 text-left font-semibold">内容</th>
                    </tr>
                </thead>
                <tbody>
                    {announcements.map((announcement) => (
                        <tr key={announcement.id} className="border-b border-white/5 text-[#dbe1ff] transition-colors hover:bg-white/5">
                            <td className="px-3 py-3 text-center">
                                <button
                                    className="rounded-lg border border-[#438fff]/30 bg-[#438fff]/15 px-3 py-1.5 text-xs font-semibold text-[#8bc5ff] transition hover:bg-[#438fff]/25"
                                    onClick={() => {
                                        setSelectedAnnouncement(announcement)
                                        setOpenUpdateModal(true)
                                    }}
                                >
                                    編集
                                </button>
                            </td>
                            <td className="px-3 py-3 text-center">
                                {announcement.hospitalIds.length === 0
                                    ? "全病院"
                                    : `${announcement.hospitalIds.length}病院`}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 text-center text-[#aebbd8]">
                                {formatDateTime(announcement.startAt)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 text-center text-[#aebbd8]">
                                {formatDateTime(announcement.endAt)}
                            </td>
                            <td className="px-3 py-3 text-center">
                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                    announcement.isActive
                                        ? "bg-emerald-400/10 text-emerald-300"
                                        : "bg-rose-400/10 text-rose-300"
                                }`}>
                                    {announcement.isActive ? "表示中" : "停止"}
                                </span>
                            </td>
                            <td className="max-w-[400px] whitespace-pre-wrap break-words px-3 py-3">
                                {announcement.message}
                            </td>
                        </tr>
                    ))}
                    {announcements.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-4 py-12 text-center text-sm text-[#8e9dbc]">
                                該当するお知らせがありません
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
