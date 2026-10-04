import React, { useState, useEffect, useRef } from "react";

interface QuickScrollBarProps {
  targetRef: React.RefObject<HTMLElement | null>;
  colorScheme?: "slate" | "teal";
  mobileOnly?: boolean;
}

export const QuickScrollBar: React.FC<QuickScrollBarProps> = ({
  targetRef,
  colorScheme = "slate",
  mobileOnly = true,
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [scrollRatio, setScrollRatio] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    // スクロールイベント時のみ位置を更新（ResizeObserverは使わない＝アニメ暴走ゼロ）
    const handleScroll = () => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll > 0) {
        setScrollRatio(Math.min(1, Math.max(0, el.scrollTop / maxScroll)));
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 初期位置計算

    return () => el.removeEventListener("scroll", handleScroll);
  }, [targetRef]);

  // レール上を指でなぞった時のスクロール連動
  const handlePointerAction = (clientY: number) => {
    const el = targetRef.current;
    const track = trackRef.current;
    if (!el || !track) return;

    const trackRect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientY - trackRect.top) / trackRect.height));
    const maxScroll = el.scrollHeight - el.clientHeight;

    el.scrollTop = ratio * maxScroll;
    setScrollRatio(ratio);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    handlePointerAction(e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.stopPropagation();
    handlePointerAction(e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.stopPropagation();
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const themeClasses =
    colorScheme === "teal"
      ? {
          track: "bg-teal-950/50 border-teal-800/40",
          thumb: isDragging ? "bg-teal-400" : "bg-teal-500/80",
        }
      : {
          track: "bg-slate-950/50 border-slate-800/40",
          thumb: isDragging ? "bg-sky-400" : "bg-slate-400/80",
        };

  return (
    <div
      ref={trackRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`absolute right-0.5 top-1 bottom-1 z-20 flex items-center justify-center select-none touch-none w-6 ${
        mobileOnly ? "sm:hidden" : ""
      }`}
    >
      {/* 背景レール（幅3px・親コンテナの高さ内に完全に収まる） */}
      <div className={`relative h-full w-[3px] rounded-full border ${themeClasses.track}`}>
        {/* つまみ（高さ36px固定） */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-[5px] h-9 rounded-full ${themeClasses.thumb}`}
          style={{
            top: `calc(${scrollRatio * 100}% - ${scrollRatio * 36}px)`,
          }}
        />
      </div>
    </div>
  );
};