import { WardType } from "../types/wardTypes"
import { WardInfectionType } from "../types/wardInfectionTypes"
import { InfectionTypeType } from "../types/infectionTypeTypes"

import { FaVirus } from "react-icons/fa"

type Props = {
                title: string
                children?: React.ReactNode
                minWidth?: number
                cellSize:number
                ward: WardType
                wardInfections: WardInfectionType[]
                infectionTypes: InfectionTypeType[]
                onClick?: (ward: WardType) => void
              }
//病棟コンテナのUIを定義する関数コンポーネント
export default function WardGrid({ 
                                    title, 
                                    children, 
                                    minWidth,
                                    cellSize,
                                    ward,
                                    wardInfections,
                                    infectionTypes,
                                    onClick
                                  }: Props) {

  const wardInfectionsForWard =
    wardInfections.filter(
      wi => wi.wardId === ward.id
  )
  const statusFontSize =
    cellSize >= 88
      ? "16px"
      : cellSize >= 64
      ? "14px"
      : cellSize >= 40
      ? "12px"
    : "10px"

const hasInfection = wardInfectionsForWard.length > 0;

  return (
    <div
      className={`
        rounded-2xl
        p-3
        flex
        flex-col
        transition-all
        duration-200
        ease-out
        select-none
        border
        /* ─── 通常時の立体感（ダーク調多層シャドウ ＋ 上端光彩 ＋ 微細グラデーション） ─── */
        ${
          hasInfection
            ? "border-rose-500/80 bg-gradient-to-b from-[#2a1720] via-[#20141b] to-[#181116] shadow-[0_8px_24px_-4px_rgba(244,63,94,0.25),inset_0_1px_0_rgba(255,255,255,0.08)]"
            : "border-slate-700/80 bg-gradient-to-b from-[#1e293b] via-[#1a2433] to-[#131b26] shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]"
        }
        /* ─── マウスホバー時の浮遊エフェクト（リフトアップ ＋ スカイブルー発光） ─── */
        hover:-translate-y-1
        ${
          hasInfection
            ? "hover:border-rose-400 hover:shadow-[0_16px_36px_-6px_rgba(244,63,94,0.35)]"
            : "hover:border-sky-400/70 hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.65)]"
        }
        ${hasInfection ? "infection-glow" : ""}
      `}
      style={{
        minWidth,
      }}
    >
      {/* ─── 病棟ヘッダーバー（クリックで病棟詳細モーダル表示） ─── */}
      <div
        className="group/header cursor-pointer pb-2 mb-2.5 border-b border-slate-700/80 flex items-center justify-between gap-2"
        onClick={() => {
          console.log("ward click", ward.name);
          onClick?.(ward);
        }}
      >
        {/* 左側：病棟名 ＆ ステータスバッジ */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="font-bold text-slate-100 tracking-tight group-hover/header:text-sky-300 transition-colors"
            style={{
              fontSize:
                cellSize >= 88
                  ? "16px"
                  : cellSize >= 64
                  ? "14px"
                  : cellSize >= 40
                  ? "12px"
                  : "10px",
              lineHeight: 1.1,
            }}
          >
            {title}
          </span>

          {ward.status && (
            <span
              className="inline-flex items-center font-bold rounded-md bg-rose-950/80 text-rose-300 border border-rose-700/80 shadow-2xs"
              style={{
                fontSize: statusFontSize,
                padding: "2px 6px",
                lineHeight: 1.2,
              }}
            >
              {ward.status}
            </span>
          )}
        </div>

        {/* 右側：感染症アイコンバッジ群 */}
        {wardInfectionsForWard.length > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-950/90 border border-rose-700 shadow-2xs">
            {wardInfectionsForWard.map((wi) => {
              const infection = infectionTypes.find(
                (i) => i.id === wi.infectionTypeId
              );
              if (!infection) return null;

              return (
                <FaVirus
                  key={wi.id}
                  size={12}
                  color={infection.color}
                  title={infection.name}
                  className="filter drop-shadow-xs"
                />
              );
            })}
          </div>
        )}
      </div>

      {/* ─── 病室コンテナ配置領域 ─── */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}