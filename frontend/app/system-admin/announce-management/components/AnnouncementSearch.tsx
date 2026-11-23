
"use client"

type AnnouncementSearchProps = {
    keyword: string
    setKeyword: any
    isActive: string
    setIsActive: any
    startAt: string
    setStartAt: any
    endAt: string
    setEndAt: any
}

export default function AnnouncementSearch({
    keyword,
    setKeyword,
    isActive,
    setIsActive,
    startAt,
    setStartAt,
    endAt,
    setEndAt
}: AnnouncementSearchProps) {
    console.log("AnnouncementSearch")
    const labelClass = "mb-1 block text-sm font-medium text-[#c5d0eb]"
    const inputClass = "w-full rounded-lg border border-white/10 bg-[#0a1632] px-3 py-2 text-sm text-white outline-none transition focus:border-[#75dfff] focus:ring-2 focus:ring-[#75dfff]/20 [color-scheme:dark]"

    return (
        <div className="mb-2">
            <div className="mb-4 text-sm font-semibold text-white">
                検索条件
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div>
                    <label className={labelClass}>お知らせ内容</label>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className={inputClass}
                        placeholder="内容で検索"
                    />
                </div>
                <div>
                    <label className={labelClass}>配信状態</label>
                    <select
                        value={isActive}
                        onChange={(e) => setIsActive(e.target.value)}
                        className={inputClass}
                    >
                        <option value="all">すべて</option>
                        <option value="true">配信中</option>
                        <option value="false">停止</option>
                    </select>
                </div>
                <div>
                    <label className={labelClass}>配信開始</label>
                    <input
                        type="date"
                        value={startAt}
                        onChange={(e) => setStartAt(e.target.value)}
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className={labelClass}>配信終了</label>
                    <input
                        type="date"
                        value={endAt}
                        onChange={(e) => setEndAt(e.target.value)}
                        className={inputClass}
                    />
                </div>
            </div>
        </div>
    )
}
