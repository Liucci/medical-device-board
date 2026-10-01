type Props = {
  title: string;
  children?: React.ReactNode;
  cellSize: number;
};

export default function StockGrid({
  title,
  children,
  cellSize,
}: Props) {
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
        /* ─── 通常時の立体感（ME室・保管庫のディープティール立体パネル） ─── */
        border-teal-900/80
        bg-gradient-to-b
        from-[#102832]
        via-[#0d222b]
        to-[#08171e]
        shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]
        /* ─── マウスホバー時の浮遊エフェクト（リフトアップ ＋ 明るいティール光彩） ─── */
        hover:-translate-y-1
        hover:border-teal-400/80
        hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.65)]
      `}
      style={{
        minWidth: "90px",
        width: "fit-content",
        alignSelf: "flex-start",
      }}
    >
      {/* ─── 倉庫ヘッダーバー ─── */}
      <div className="pb-2 mb-2.5 border-b border-teal-900/80 flex items-center justify-between gap-2">
        <div
          className="font-bold text-teal-100 tracking-tight"
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
        </div>
      </div>

      {/* ─── 倉庫内部機器グリッド配置領域 ─── */}
      <div className="flex flex-wrap gap-2.5 items-start">
        {children}
      </div>
    </div>
  );
}