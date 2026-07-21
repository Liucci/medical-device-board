"use client"

import { useEffect, useState } from "react"

import { AnnouncementFrontType } from "../../types/announcementType"

import { fetchAnnouncementsTransaction } from "@/app/api/transactions/announcements/fetchAnnouncementsTransaction"

import AnnouncementSearch from "./components/AnnouncementSearch"
import AnnouncementTable from "./components/AnnouncementTable"
import CreateAnnouncementModal from "./components/CreateAnnouncementModal"
import UpdateAnnouncementModal from "./components/UpdateAnnouncementModal"
import { HospitalManagementType } from "../../types/hospitalTypes"

import { fetchHospitalManagementTransaction } from "@/app/api/transactions/hospitals/fetchHospitalManagementTransaction"
export default function AnnouncementManagementPage()
{
    const [announcements, setAnnouncements] = useState<AnnouncementFrontType[]>([])
    const [openCreateModal, setOpenCreateModal] = useState(false)
    const [openUpdateModal, setOpenUpdateModal] = useState(false)
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementFrontType | null>(null)
    const [keyword, setKeyword] = useState("")
    const [isActive, setIsActive] = useState("all")
    const [startAt, setStartAt] = useState("")
    const [endAt, setEndAt] = useState("")
    const [hospitals, setHospitals] = useState<HospitalManagementType[]>([])
    
    const filteredAnnouncements = announcements.filter((announcement) => {

    if (
        keyword &&
        !announcement.message.includes(keyword)
    ) {
        return false
    }

    if (
        isActive === "true" &&
        !announcement.isActive
    ) {
        return false
    }

    if (
        isActive === "false" &&
        announcement.isActive
    ) {
        return false
    }

    if (
        startAt &&
        announcement.startAt.substring(0, 10) < startAt
    ) {
        return false
    }

    if (
        endAt &&
        announcement.endAt.substring(0, 10) > endAt
    ) {
        return false
    }

    return true
})

useEffect(() => {
        fetchAnnouncementsTransaction({
            setAnnouncements
        })
    }, [])
useEffect(() => {

    fetchAnnouncementsTransaction({
        setAnnouncements
    })
    fetchHospitalManagementTransaction({
        setHospitals
    })


}, [])
    return (
        <div className="p-6">

            <h1 className="mb-6 text-2xl font-bold">
                お知らせ管理
            </h1>
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
            <div className="mt-6 flex justify-end">
                <button
                    onClick={() => setOpenCreateModal(true)}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    新規作成
                </button>
            </div>

            <AnnouncementTable
                announcements={filteredAnnouncements}
                setSelectedAnnouncement={setSelectedAnnouncement}
                setOpenUpdateModal={setOpenUpdateModal}
            />

            <CreateAnnouncementModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                hospitals={hospitals}
                setAnnouncements={setAnnouncements}
            />

            {
                selectedAnnouncement &&
                <UpdateAnnouncementModal
                    open={openUpdateModal}
                    onClose={() => setOpenUpdateModal(false)}
                    announcement={selectedAnnouncement}
                    hospitals={hospitals}
                    setAnnouncements={setAnnouncements}
                />
            }

        </div>
    )
}