"use client";
import { useState } from "react";
import DemoAccountApplicationModal from "./components/DemoAccountApplicationModal";
import Link from "next/link";

export default function HomePage() {
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  
  return (
    <main
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden"
      style={{
        background: "#0a122a",
        color: "#dbe1ff",
        fontFamily: '"Manrope", sans-serif',
      }}
    >
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2 h-[840px] w-[840px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[160px]"
          style={{ background: "rgba(0,210,255,0.10)" }}
        />
        <div
          className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
          style={{ background: "rgba(171,199,255,0.10)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 75% 65% at 50% 45%, rgba(67,143,255,0.07), transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex w-full max-w-[420px] flex-col items-center px-4 py-12 text-center">
        <div className="group relative mb-8">
          <div
            className="absolute -inset-4 rounded-full blur-2xl transition-all duration-700 group-hover:blur-3xl"
            style={{ background: "rgba(0,210,255,0.20)" }}
          />
          <div
            className="relative flex h-36 w-36 items-center justify-center rounded-[2rem] p-6 backdrop-blur-md md:h-44 md:w-44"
            style={{ background: "rgba(19,26,51,0.40)" }}
          >
            <img
              alt="DEVIX Medical System Identity"
              className="h-full w-full object-contain"
              style={{ filter: "drop-shadow(0 0 24px rgba(165,231,255,0.6))" }}
              src="/logo.png"            />
          </div>
        </div>

        <h1
          className="mb-3 text-4xl font-bold tracking-tight text-white md:text-[42px] md:leading-[50px]"
          style={{ fontFamily: '"Space Grotesk", sans-serif' }}
        >
          DEVIX
        </h1>

        <p
          className="mb-10 max-w-sm text-sm font-normal tracking-wider md:text-base"
          style={{ color: "rgba(165,231,255,0.80)" }}
        >
          Medical Device Management &amp; Digital Whiteboard
        </p>

        <div className="flex w-full flex-col items-center gap-4">
          <Link
            href="/login"
            className="flex h-14 w-full items-center justify-center rounded-full text-base font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] md:text-lg"
            style={{
              background: "linear-gradient(to right, #438fff, #00d2ff)",
              color: "#002959",
              boxShadow: "0 8px 30px -4px rgba(0,210,255,0.4)",
              fontFamily: '"Space Grotesk", sans-serif',
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.boxShadow =
                "0 12px 36px -2px rgba(0,210,255,0.6)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.boxShadow =
                "0 8px 30px -4px rgba(0,210,255,0.4)";
            }}
          >
            ログイン / Login
          </Link>


          <button
            type="button"
            onClick={() => setIsApplicationOpen(true)}
            className="flex h-12 w-full items-center justify-center rounded-full text-sm font-medium tracking-wide transition-all duration-200 hover:bg-white/5 hover:text-white md:text-base"
            style={{
              color: "#c1c6d7",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            アカウント申請
          </button>

          <DemoAccountApplicationModal
            isOpen={isApplicationOpen}
            onClose={() => setIsApplicationOpen(false)}
          />
          </div>

      </div>

{/* 利用規約・プライバシーポリシー */}
<footer className="relative z-10 w-full px-4 pb-6 text-center text-xs text-[#9ba9c9]">
  <nav
    aria-label="法的情報"
    className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
  >
    <Link
      href="/terms"
      className="rounded-sm transition-colors hover:text-[#a5e7ff]"
    >
      利用規約
    </Link>

    <Link
      href="/privacy"
      className="rounded-sm transition-colors hover:text-[#a5e7ff]"
    >
      プライバシーポリシー
    </Link>
    <Link
      href="/contact"
      className="rounded-sm transition-colors hover:text-[#a5e7ff]"
    >
      問い合わせ
    </Link>

  </nav>
</footer>
    </main>
  );
}