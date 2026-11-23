
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AnnouncementFrontType } from "../../types/announcementTypes"
import { fetchAnnouncementsTransaction } from "@/app/api/transactions/announcements/fetchAnnouncementsTransaction"
import { LoadingOverlay } from "../../components/common/LoadingOverlay"
import AnnouncementSearch from "./components/AnnouncementSearch"
import AnnouncementTable from "./components/AnnouncementTable"
import CreateAnnouncementModal from "./components/CreateAnnouncementModal"
import UpdateAnnouncementModal from "./components/UpdateAnnouncementModal"
import { HospitalManagementType } from "../../types/hospitalTypes"
import { fetchHospitalManagementTransaction } from "@/app/api/transactions/hospitals/fetchHospitalManagementTransaction"

export default function AnnouncementManagementPage() {
    console.log("AnnouncementManagementPage")
    const [announcements, setAnnouncements] = useState<AnnouncementFrontType[]>([])
    const [openCreateModal, setOpenCreateModal] = useState(false)
    const [openUpdateModal, setOpenUpdateModal] = useState(false)
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementFrontType | null>(null)
    const [keyword, setKeyword] = useState("")
    const [isActive, setIsActive] = useState("all")
    const [startAt, setStartAt] = useState("")
    const [endAt, setEndAt] = useState("")
    const [hospitals, setHospitals] = useState<HospitalManagementType[]>([])
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const filteredAnnouncements = announcements.filter((announcement) => {
        if (keyword && !announcement.message.includes(keyword)) return false
        if (isActive === "true" && !announcement.isActive) return false
        if (isActive === "false" && announcement.isActive) return false
        if (startAt && announcement.startAt.substring(0, 10) < startAt) return false
        if (endAt && announcement.endAt.substring(0, 10) > endAt) return false
        return true
    })

    useEffect(() => {
        fetchAnnouncementsTransaction({ setAnnouncements })
        fetchHospitalManagementTransaction({ setHospitals, setLoading })
    }, [])

    return (
        <>
            <div className="min-h-screen bg-[#0a122a] p-4 text-[#dbe1ff] sm:p-6">
                {/* ヘッダー */}
                <div className="mb-6 flex items-center gap-3">
                    <button
                        onClick={() => router.push("/system-admin")}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-[#c5d0eb] transition hover:bg-white/10"
                    >
                        ← 戻る
                    </button>
                    <h1 className="text-xl font-bold text-white sm:text-2xl">
                        お知らせ管理
                    </h1>
                </div>

                {/* 検索条件 */}
                <div className="rounded-xl border border-white/10 bg-[#111d3b]/80 p-4 sm:p-5">
                    <AnnouncementSearch
                        keyword={keyword}
                        setKeyword={setKeyword}
                        isActive={isActive}
                        setIsActive={setIsActive}
                        startAt={startAt}
                        setStartAt={setStartAt}
                        endAt={endAt}
                        setEndAt={setEndAt}
                    />
                </div>

                {/* 新規作成 */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={() => setOpenCreateModal(true)}
                        className="rounded-lg border border-[#75dfff]/30 bg-[#1685b5] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#1685b5]/10 transition hover:bg-[#1b9acb]"
                    >
                        ＋ 新規作成
                    </button>
                </div>

                {/* お知らせ一覧 */}
                <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-[#111d3b]/70">
                    <AnnouncementTable
                        announcements={filteredAnnouncements}
                        setSelectedAnnouncement={setSelectedAnnouncement}
                        setOpenUpdateModal={setOpenUpdateModal}
                    />
                </div>

                {/* 新規作成モーダル */}
                <CreateAnnouncementModal
                    open={openCreateModal}
                    onClose={() => setOpenCreateModal(false)}
                    hospitals={hospitals}
                    setAnnouncements={setAnnouncements}
                />

                {/* 更新モーダル */}
                {selectedAnnouncement && (
                    <UpdateAnnouncementModal
                        open={openUpdateModal}
                        onClose={() => setOpenUpdateModal(false)}
                        announcement={selectedAnnouncement}
                        hospitals={hospitals}
                        setAnnouncements={setAnnouncements}
                    />
                )}
            </div>
            <LoadingOverlay loading={loading} />
        </>
    )
}
