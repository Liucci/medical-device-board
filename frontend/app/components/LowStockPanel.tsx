"use client"
import { useMemo, useState, useRef, useEffect } from "react"
import { DeviceModelType } from "../types/deviceModelTypes"
import { ChevronDown, ChevronUp, AlertCircle, Package } from "lucide-react"
import { memo } from "react"
type Device = {
  id: number
  typeName: string
  modelName: string
  isUnderMaintenance?: boolean
  currentWardId?: number | null
}

type Props = {
  devices?: Device[]
  deviceModels?: DeviceModelType[]
}

type SummaryItem = {
  key: string
  typeName: string
  modelName: string
  stockCount: number
  usingCount: number
  maintenanceCount: number
  totalCount: number
  alertCount: number
}

function LowStockPanel({ devices = [], deviceModels = [] }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const summaries = useMemo(() => {
    if (!deviceModels || !devices) return []
    const displayMap = new Map(deviceModels.map(m => [m.name, { display: m.displayRemainingCount, alert: m.remainingAlertCount }]))
    const map = new Map<string, SummaryItem>()

    devices.forEach(d => {
      const key = `${d.typeName}-${d.modelName}`
      if (!map.has(key)) {
        map.set(key, {
          key,
          typeName: d.typeName,
          modelName: d.modelName,
          stockCount: 0,
          usingCount: 0,
          maintenanceCount: 0,
          totalCount: 0,
          alertCount: displayMap.get(d.modelName)?.alert ?? 0
        })
      }
      const item = map.get(key)!
      item.totalCount += 1
      if (d.isUnderMaintenance) item.maintenanceCount += 1
      else if (d.currentWardId) item.usingCount += 1
      else item.stockCount += 1
    })

    return Array.from(map.values())
      .filter(item => displayMap.get(item.modelName)?.display)
      .sort((a, b) => {
        const aAlert = a.stockCount <= a.alertCount ? 1 : 0
        const bAlert = b.stockCount <= b.alertCount ? 1 : 0
        if (aAlert !== bAlert) return bAlert - aAlert
        return a.stockCount - b.stockCount
      })
  }, [devices, deviceModels])

  const alertItems = useMemo(() => summaries.filter(s => s.stockCount <= s.alertCount), [summaries])
  const hasAlert = alertItems.length > 0

  return (
    <div ref={menuRef} className="relative inline-block text-xs select-none z-30">
      {/* ─── ヘッダー組み込みボタントリガー ─── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-7 px-2.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs ${
          hasAlert
            ? "bg-rose-950/70 border-rose-500/80 text-rose-200 hover:bg-rose-900/80"
            : "bg-[#1e293b] border-slate-700 text-slate-200 hover:bg-[#283548]"
        }`}
        title="機器残数一覧を表示"
      >
        <span className="text-[11px] whitespace-nowrap">機器残数</span>
        {hasAlert && (
          <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-mono text-[10px] font-bold animate-pulse flex items-center gap-0.5">
            <span className="sm:hidden">{alertItems.length}</span>
            <span className="hidden sm:inline">残少 {alertItems.length}</span>
          </span>
        )}
        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
      </button>

      {/* ─── Devix Design System 準拠オペレーショナルカード ─── */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-[300px] sm:w-[320px] rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
          {/* カードヘッダー */}
          <div className="border-b border-slate-100 bg-slate-50 px-3.5 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Package className="w-4 h-4 text-teal-700" />
              <span className="text-xs font-bold tracking-wide text-slate-800">機器残数サマリー</span>
            </div>
            {hasAlert ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                <AlertCircle className="w-3 h-3" />
                {alertItems.length}機種 不足警告
              </span>
            ) : (
              <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                在庫全適正
              </span>
            )}
          </div>

          {/* テーブル見出し行 */}
          <div className="grid grid-cols-[1fr_44px_44px_44px] gap-1 border-b border-slate-100 bg-white px-3.5 py-1.5 text-[11px] font-bold text-slate-500">
            <div>機種 / 型式名</div>
            <div className="text-center text-teal-700">在庫</div>
            <div className="text-center">使用</div>
            <div className="text-center">保守</div>
          </div>

          {/* データ行一覧 */}
          <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-100">
            {summaries.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">表示対象の機器がありません</div>
            ) : (
              summaries.map(item => {
                const isAlert = item.stockCount <= item.alertCount
                return (
                  <div
                    key={item.key}
                    className={`grid grid-cols-[1fr_44px_44px_44px] gap-1 px-3.5 py-2 items-center text-xs transition-colors ${
                      isAlert ? "bg-rose-50/60" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="leading-tight min-w-0 pr-1">
                      <div className="font-bold text-slate-900 truncate">{item.typeName}</div>
                      <div className="font-mono text-[11px] text-slate-500 truncate">{item.modelName}</div>
                    </div>
                    {/* 在庫（残数）: 警告時はrose、通常時はemerald */}
                    <div className="text-center">
                      <span className={`inline-block min-w-[28px] px-1 py-0.5 rounded font-mono font-bold text-xs ${
                        isAlert ? "bg-rose-100 text-rose-700 border border-rose-300 animate-pulse" : "text-emerald-700 font-bold"
                      }`}>
                        {item.stockCount}
                      </span>
                    </div>
                    {/* 使用中 */}
                    <div className="text-center font-mono text-xs text-slate-700">{item.usingCount}</div>
                    {/* 保守中 */}
                    <div className={`text-center font-mono text-xs ${item.maintenanceCount > 0 ? "font-bold text-amber-700" : "text-slate-300"}`}>
                      {item.maintenanceCount}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* カードフッター */}
          <div className="border-t border-slate-100 bg-slate-50 px-3.5 py-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>※安全基準を下回ると赤色強調</span>
            <span className="font-mono">対象: {summaries.length}型式</span>
          </div>
        </div>
      )}
    </div>
  )
}
export default memo(LowStockPanel)