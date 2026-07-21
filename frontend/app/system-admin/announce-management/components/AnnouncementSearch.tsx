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
}: AnnouncementSearchProps)
{
    return (
        <div className="mb-6 rounded border bg-white p-4">

            <div className="grid grid-cols-4 gap-4">

                <div>
                    <label className="mb-1 block font-semibold">
                        お知らせ内容
                    </label>

                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full rounded border p-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block font-semibold">
                        配信状態
                    </label>

                    <select
                        value={isActive}
                        onChange={(e) => setIsActive(e.target.value)}
                        className="w-full rounded border p-2"
                    >
                        <option value="all">すべて</option>
                        <option value="true">配信中</option>
                        <option value="false">停止</option>
                    </select>
                </div>

                <div>
                    <label className="mb-1 block font-semibold">
                        配信開始
                    </label>

                    <input
                        type="date"
                        value={startAt}
                        onChange={(e) => setStartAt(e.target.value)}
                        className="w-full rounded border p-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block font-semibold">
                        配信終了
                    </label>

                    <input
                        type="date"
                        value={endAt}
                        onChange={(e) => setEndAt(e.target.value)}
                        className="w-full rounded border p-2"
                    />
                </div>

            </div>

        </div>
    )
}