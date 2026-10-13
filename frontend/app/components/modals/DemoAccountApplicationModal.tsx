
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
  Building2,
  Mail,
} from "lucide-react";

interface DemoAccountApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_APPLICATION_MESSAGE = `【アカウント申請について】

以下について、分かる範囲でご記入ください。

・利用予定の部署・病棟：
・管理予定の医療機器の種類・台数（概数）：
・現在の医療機器の管理方法：
・devixを利用したい目的・解決したい課題：
・利用開始希望時期：
・その他、ご要望・ご質問：

※ 上記担当者を初回の組織管理者として登録する想定です。別の方を希望する場合は、その旨と担当者情報をご記入ください。`;

const ROLE_OPTIONS = [
  "臨床工学技士・CE",
  "ME機器管理責任者",
  "医師",
  "看護部長・病棟師長",
  "看護師・現場スタッフ",
  "医療安全管理室",
  "事務長・経営企画",
  "医療情報・システム担当",
  "その他",
];

const BED_COUNT_OPTIONS = [
  "99床以下",
  "100〜299床",
  "300〜499床",
  "500床以上",
];

export default function DemoAccountApplicationModal({
  isOpen,
  onClose,
}: DemoAccountApplicationModalProps) {
  const [hospitalName, setHospitalName] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("臨床工学技士・CE");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bedCount, setBedCount] = useState("100〜299床");
  const [message, setMessage] = useState(
    INITIAL_APPLICATION_MESSAGE
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const resetForm = () => {
    setHospitalName("");
    setName("");
    setRole("臨床工学技士・CE");
    setEmail("");
    setPhone("");
    setBedCount("100〜299床");
    setMessage(INITIAL_APPLICATION_MESSAGE);
    setErrors({});
    setErrorMessage("");
    setSubmitted(false);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setErrorMessage("");

    const nextErrors: Record<string, string> = {};

    if (!hospitalName.trim()) {
      nextErrors.hospitalName = "医療機関名を入力してください。";
    }

    if (!name.trim()) {
      nextErrors.name = "ご担当者名を入力してください。";
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "有効なメールアドレスを入力してください。";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // 初期テンプレートがそのままの場合は、
    // テンプレート全体を申請内容として送信しない。
    const actualMessage =
      message.trim() === INITIAL_APPLICATION_MESSAGE.trim()
        ? ""
        : message.trim();

    // 既存GASの受信フィールドと形式を維持する。
    const payload = {
      hospitalName: hospitalName.trim(),
      name: name.trim(),
      role: `${role}（病床規模：${bedCount}）`,
      email: email.trim(),
      phone: phone.trim(),
      preferredDate1: "",
      preferredDate2: "",
      message: `[病床規模: ${bedCount}]${actualMessage ? `\n${actualMessage}` : ""}`,
    };

    try {
      // ブラウザからGASを直接呼ばず、Next.js API Routeを経由する。
      const response = await fetch("/api/demo-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.success !== true) {
        throw new Error(
          result?.error || "アカウント申請の送信に失敗しました。"
        );
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Demo application submission error:", error);

      setErrorMessage(
        "送信処理でエラーが発生しました。通信環境をご確認のうえ、再度お試しください。"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-white/15 bg-[#0a1228] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#697895] focus:border-[#00d2ff] focus:ring-2 focus:ring-[#00d2ff]/20 disabled:opacity-60";

  const labelClass =
    "mb-2 block text-sm font-semibold text-white";

  const selectClass =
    "w-full rounded-lg border border-white/15 bg-[#0a1228] px-4 py-3 text-sm text-white outline-none transition focus:border-[#00d2ff] focus:ring-2 focus:ring-[#00d2ff]/20 disabled:opacity-60";

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-[#080f23] p-3 sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-application-title"
        className="flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#101a32] shadow-2xl shadow-black/40"
      >
        {/* Header */}
        <div className="relative shrink-0 overflow-hidden bg-[#0a122a] px-5 py-5 text-white sm:px-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full blur-[90px]"
            style={{ background: "rgba(0,210,255,0.18)" }}
          />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">

              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300">
                  DEVIX / APPLICATION
                </p>

                <h2
                  id="demo-application-title"
                  className="text-lg font-bold tracking-tight sm:text-xl"
                >
                  無料デモアカウント申請
                </h2>

                <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                  まずは無料で実際の運用を想定してお試しください。
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              aria-label="閉じる"
              className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto overscroll-contain bg-[#101a32]">
          {submitted ? (
            <div className="px-5 py-10 text-center text-white sm:px-8 sm:py-14">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#00d2ff]/20 bg-[#00d2ff]/10 text-[#00d2ff]">
                <CheckCircle className="h-9 w-9" />
              </div>

              <h3 className="text-xl font-bold text-white">
                申請フォームの送信処理が完了しました
              </h3>

              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#b4bfd6]">
                ご入力いただいた内容を送信しました。
                受付状況を確認のうえ、担当者よりご連絡いたします。
              </p>

              <div className="mx-auto mt-6 max-w-md rounded-xl border border-white/10 bg-[#0a1228] p-4 text-left">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#00d2ff]" />
                  <div className="text-sm leading-6 text-[#b4bfd6]">
                    <p className="font-semibold text-white">
                      受付メールをご確認ください
                    </p>
                    <p className="mt-1">
                      自動返信メールが届かない場合は、迷惑メールフォルダもご確認ください。
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="mt-8 w-full rounded-lg bg-[#00d2ff] px-5 py-3.5 text-sm font-bold text-[#071326] shadow-lg shadow-[#00d2ff]/10 transition hover:bg-[#75e4ff] focus:outline-none focus:ring-2 focus:ring-[#00d2ff] sm:max-w-xs"
              >
                閉じる
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5 px-5 py-6 sm:px-7 sm:py-7"
            >
              <div className="rounded-lg border border-white/10 bg-[#0a1228] p-3.5">
                <div className="flex items-start gap-2.5">
                  <p className="text-xs leading-6 text-[#b4bfd6] sm:text-sm">
                    申請内容を運営者が確認し、初回の組織管理者アカウントを作成します。
                    アカウントのご案内はメールでお送りします。
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-red-400/25 bg-red-400/10 p-3.5 text-sm text-[#ffb4b4]"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              {/* Hospital */}
              <div>
                <label htmlFor="demo-hospital" className={labelClass}>
                  医療機関・施設名 <span className="text-[#ff9d9d]">*</span>
                </label>
                <input
                  id="demo-hospital"
                  type="text"
                  autoComplete="organization"
                  value={hospitalName}
                  onChange={(event) => setHospitalName(event.target.value)}
                  placeholder="例：○○総合病院"
                  disabled={isSubmitting}
                  className={inputClass}
                  aria-invalid={!!errors.hospitalName}
                  required
                />
                {errors.hospitalName && (
                  <p className="mt-1 text-xs text-[#ff9d9d]">
                    {errors.hospitalName}
                  </p>
                )}
              </div>

              {/* Name and role */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="demo-name" className={labelClass}>
                    ご担当者名 <span className="text-[#ff9d9d]">*</span>
                  </label>
                  <input
                    id="demo-name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="例：山田 太郎"
                    disabled={isSubmitting}
                    className={inputClass}
                    aria-invalid={!!errors.name}
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-[#ff9d9d]">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="demo-role" className={labelClass}>
                    ご役職・所属
                  </label>
                  <select
                    id="demo-role"
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    disabled={isSubmitting}
                    className={selectClass}
                  >
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option} value={option} className="bg-[#0a1228] text-white">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email and phone */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="demo-email" className={labelClass}>
                    メールアドレス <span className="text-[#ff9d9d]">*</span>
                  </label>
                  <input
                    id="demo-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@hospital.jp"
                    disabled={isSubmitting}
                    className={inputClass}
                    aria-invalid={!!errors.email}
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-[#ff9d9d]">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="demo-phone" className={labelClass}>
                    電話番号 <span className="text-[#8795b2]">任意</span>
                  </label>
                  <input
                    id="demo-phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="045-000-0000"
                    disabled={isSubmitting}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Bed count */}
              <div>
                <label htmlFor="demo-bed-count" className={labelClass}>
                  病床規模
                </label>
                <select
                  id="demo-bed-count"
                  value={bedCount}
                  onChange={(event) => setBedCount(event.target.value)}
                  disabled={isSubmitting}
                  className={selectClass}
                >
                  {BED_COUNT_OPTIONS.map((option) => (
                    <option key={option} value={option} className="bg-[#0a1228] text-white">
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Application details */}
              <div>
                <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                  <label htmlFor="demo-message" className={labelClass}>
                    アカウント申請に関する補足
                  </label>
                  <span className="text-xs text-[#8795b2]">任意</span>
                </div>

                <textarea
                  id="demo-message"
                  rows={9}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  disabled={isSubmitting}
                  className={`${inputClass} resize-y leading-6`}
                />

                <p className="mt-2 text-xs leading-5 text-[#8795b2]">
                  分かる範囲でご記入ください。未定の項目は空欄のままで構いません。
                </p>
              </div>

              {/* Submit */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#00d2ff] px-5 py-4 text-sm font-bold text-[#071326] shadow-lg shadow-[#00d2ff]/10 transition hover:bg-[#75e4ff] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>送信処理中...</span>
                    </>
                  ) : (
                    <>
                      <span>無料デモアカウントを申請する</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-xs leading-6 text-[#8795b2]">
                ご入力いただいた情報は、申請への対応および本サービスのご案内に使用します。
                <br />
                詳細は
                <a
                  href="/privacy"
                  className="font-medium text-[#a5e7ff] underline underline-offset-4 hover:text-white"
                >
                  プライバシーポリシー
                </a>
                をご確認ください。
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  , document.body);
}
