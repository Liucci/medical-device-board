
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "お問い合わせ | devix",
  description: "医療機器管理システム devix に関するお問い合わせ",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

const inquiryTypes = [
  "アカウント申請",
  "サービスについて",
  "導入・利用方法について",
  "料金について",
  "不具合・トラブルについて",
  "その他",
];

type ContactPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function ContactPage({
  searchParams,
}: ContactPageProps) {
  const params = await searchParams;
  const status = params.status;
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080f23] text-white">
      {/* 背景装飾 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#00d2ff]/10 blur-[100px]" />
        <div className="absolute -right-32 top-64 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-8 sm:px-8 sm:py-12">
        {/* ヘッダー */}
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <Link
            href="/"
            className="text-xl font-bold tracking-[0.2em] text-white transition-colors hover:text-[#a5e7ff]"
          >
            DEVIX
          </Link>

          <Link
            href="/"
            className="text-sm text-[#a5b2cf] transition-colors hover:text-[#a5e7ff]"
          >
            トップページへ戻る
          </Link>
        </header>

        {/* メインコンテンツ */}
        <section className="flex-1 py-12 sm:py-16">
          <p className="mb-3 text-sm font-semibold tracking-[0.25em] text-[#00d2ff]">
            CONTACT
          </p>

          <h1 className="text-3xl font-bold tracking-wide sm:text-4xl">
            お問い合わせ
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#b4bfd6] sm:text-base">
            devixに関するご質問、ご相談、ご意見などがございましたら、
            以下のフォームよりお問い合わせください。
          </p>

          <div className="mt-9 rounded-2xl border border-white/10 bg-[#101a32]/90 p-5 shadow-2xl shadow-black/20 sm:p-8">
            <form
              action="/api/contact"
              method="POST"
              className="space-y-7"
            >
            
            {/* 迷惑送信対策用の隠し項目 */}
              <div
                aria-hidden="true"
                className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
              >
                <label htmlFor="website">ウェブサイト</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              {/* 問い合わせ種類 */}
              <div>
                <label
                  htmlFor="inquiryType"
                  className="mb-2 block text-sm font-semibold text-white"
                >
                  お問い合わせ種類
                  <span className="ml-2 text-xs font-normal text-[#ff9d9d]">
                    必須
                  </span>
                </label>

                <select
                  id="inquiryType"
                  name="inquiryType"
                  required
                  defaultValue=""
                  className="w-full rounded-lg border border-white/15 bg-[#0a1228] px-4 py-3 text-sm text-white outline-none transition focus:border-[#00d2ff] focus:ring-2 focus:ring-[#00d2ff]/20"
                >
                  <option value="" disabled>
                    選択してください
                  </option>

                  {inquiryTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            {/* 返信用アドレス入力欄 */}             
            <div>
            <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-white"
            >
                返信先メールアドレス
                <span className="ml-2 text-xs font-normal text-[#8795b2]">
                任意
                </span>
            </label>

            <input
                id="email"
                name="email"
                type="email"
                maxLength={254}
                autoComplete="email"
                placeholder="example@example.com"
                className="w-full rounded-lg border border-white/15 bg-[#0a1228] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#697895] focus:border-[#00d2ff] focus:ring-2 focus:ring-[#00d2ff]/20"
            />
            </div>
              {/* 問い合わせ内容 */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-white"
                >
                  お問い合わせ内容
                  <span className="ml-2 text-xs font-normal text-[#ff9d9d]">
                    必須
                  </span>
                </label>

                <textarea
                  id="message"
                  name="message"
                  required
                  rows={8}
                  maxLength={5000}
                  placeholder="お問い合わせ内容をご記入ください。"
                  className="w-full resize-y rounded-lg border border-white/15 bg-[#0a1228] px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-[#697895] focus:border-[#00d2ff] focus:ring-2 focus:ring-[#00d2ff]/20"
                />

                <p className="mt-2 text-xs leading-5 text-[#8795b2]">
                  患者名など、問い合わせに不要な個人情報は入力しないでください。
                </p>
              </div>

              {/* 送信ボタン */}
              <button
                type="submit"
                className="w-full rounded-lg bg-[#00d2ff] px-6 py-3.5 text-sm font-bold text-[#071326] shadow-lg shadow-[#00d2ff]/10 transition hover:bg-[#75e4ff] focus:outline-none focus:ring-2 focus:ring-[#00d2ff] focus:ring-offset-2 focus:ring-offset-[#101a32] active:scale-[0.99]"
              >
                送信する
              </button>

              <p className="text-center text-xs leading-6 text-[#8795b2]">
                お問い合わせいただいた情報は、対応および連絡のために利用します。
                詳細は
                <Link
                  href="/privacy"
                  className="mx-1 text-[#a5e7ff] underline underline-offset-4 hover:text-white"
                >
                  プライバシーポリシー
                </Link>
                をご確認ください。
              </p>
            </form>
          </div>

          {/* メールでの問い合わせ */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[#8795b2]">
              メールでのお問い合わせはこちら
            </p>

            <a
              href="mailto:info@devix.jp"
              className="mt-2 inline-block text-base font-medium text-[#a5e7ff] underline underline-offset-4 transition-colors hover:text-white"
            >
              info@devix.jp
            </a>
          </div>
        </section>

        {/* フッター */}
        <footer className="border-t border-white/10 pt-5 text-center text-xs text-[#8795b2]">
          <nav
            aria-label="法的情報"
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3"
          >
            <Link
              href="/terms"
              className="transition-colors hover:text-[#a5e7ff]"
            >
              利用規約
            </Link>

            <Link
              href="/privacy"
              className="transition-colors hover:text-[#a5e7ff]"
            >
              プライバシーポリシー
            </Link>

            <Link
              href="/"
              className="transition-colors hover:text-[#a5e7ff]"
            >
              トップページ
            </Link>
          </nav>

          <p className="mt-4">© {new Date().getFullYear()} devix</p>
        </footer>
      </div>
    </main>
  );
}
