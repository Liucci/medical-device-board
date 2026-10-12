import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "利用規約 | DEVIX",
  description: "DEVIXの利用条件を定める利用規約です。",
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

const sections = [
  {
    title: "第1条（適用）",
    paragraphs: [
      "本利用規約（以下「本規約」といいます。）は、DEVIX（以下「本サービス」といいます。）の利用条件を定めるものです。本サービスを利用するすべての利用者に適用されます。",
      "利用者は、本規約の内容を確認し、これに同意したうえで本サービスを利用するものとします。",
    ],
  },
  {
    title: "第2条（本サービスの目的・内容）",
    paragraphs: [
      "本サービスは、医療機器の配置場所、稼働状態、点検その他の管理情報をデジタル上で共有・管理するためのサービスです。",
      "本サービス上に表示される情報は、利用者による入力・更新等に基づくものであり、実際の医療機器の所在、稼働状態、点検の実施状況または使用可否を自動的・確定的に証明するものではありません。",
    ],
  },
  {
    title: "第3条（利用環境・アカウント管理）",
    paragraphs: [
      "利用者は、自己の責任において、利用に必要な端末、通信環境その他の環境を準備するものとします。",
      "利用者および利用施設は、アカウント情報を適切に管理し、第三者との共有、貸与、譲渡または不正利用を防止するものとします。アカウントを通じて行われた操作については、当該アカウントを管理する利用者または利用施設が責任を負うものとします。",
      "アカウント情報の漏えい、不正利用またはそのおそれを認識した場合、利用者は速やかに運営者へ連絡するものとします。",
    ],
  },
  {
    title: "第4条（入力情報の管理）",
    paragraphs: [
      "利用者は、本サービスに登録する情報について、正確性および最新性を保つよう努めるものとします。医療機器の移動、点検、状態変更等を行った場合は、施設内の運用ルールに従い、必要な情報を適切に更新してください。",
      "患者名等の患者に関する情報の入力は、本サービスの利用に必須ではありません。利用施設および利用者は、入力する情報を必要最小限とし、施設内の規程および適用される法令等に従って取り扱うものとします。",
      "利用者は、第三者の権利を侵害する情報、法令に違反する情報、または本サービスの運営に支障をきたす情報を登録してはなりません。",
    ],
  },
  {
    title: "第5条（医療安全上の注意）",
    paragraphs: [
      "本サービスは、医療機器の配置・状態等を管理するための補助的な情報共有ツールです。医療機器の使用可否、患者への使用判断、点検・保守の完了、安全性その他の医療上または臨床上の判断を代替するものではありません。",
      "利用者および利用施設は、実機の所在・状態を必要に応じて直接確認し、院内規程、製造販売業者の指示および関係法令等に従って判断・運用するものとします。本サービスの表示のみを根拠として、医療機器の使用可否や安全性を判断しないでください。",
    ],
  },
  {
    title: "第6条（禁止事項）",
    paragraphs: [
      "利用者は、以下の行為を行ってはなりません。",
    ],
    list: [
      "法令または公序良俗に違反する行為",
      "本サービス、サーバーまたはネットワークの運営を妨害する行為",
      "不正アクセス、他者のアカウントの利用、またはこれらを試みる行為",
      "本サービスを通じて取得した情報を、権限なく第三者に開示・提供する行為",
      "本サービスのリバースエンジニアリング、過度な負荷を与える行為、その他運営者が不適切と判断する行為",
      "運営者または第三者の権利・利益を侵害する行為",
    ],
  },
  {
    title: "第7条（サービスの変更・停止）",
    paragraphs: [
      "運営者は、保守、障害対応、セキュリティ上の必要、災害その他の事情により、利用者への事前通知なく、本サービスの全部または一部を変更、停止または中断することがあります。可能な場合には、事前または事後に適切な方法でお知らせします。",
      "運営者は、本サービスの継続が困難と判断した場合、本サービスの全部または一部を終了することがあります。終了する場合は、可能な範囲で事前にお知らせします。",
    ],
  },
  {
    title: "第8条（利用制限・登録の取消し）",
    paragraphs: [
      "運営者は、利用者が本規約に違反した場合、不正利用のおそれがある場合、または本サービスの運営上必要と判断した場合、事前の通知なく、利用の制限、アカウントの停止その他必要な措置を講じることがあります。",
    ],
  },
  {
    title: "第9条（料金）",
    paragraphs: [
      "本サービスの利用条件および料金は、運営者が別途表示する場合、その表示に従うものとします。",
      "将来、本サービスの全部または一部を有料化する場合、運営者は料金、支払方法および適用開始時期等を事前に案内します。有料化に伴う条件に同意しない場合、利用者は案内された方法に従って利用を終了することができます。",
    ],
  },
  {
    title: "第10条（データの取扱い・削除）",
    paragraphs: [
      "運営者は、本サービスの提供に必要な範囲で、利用者が登録した情報を取り扱います。個人情報等の取扱いについては、別途定めるプライバシーポリシーに従います。",
      "利用施設からデータの削除依頼があった場合、運営者は依頼内容および本人確認・権限確認等を行ったうえで、合理的な範囲で対応します。ただし、法令上保存が必要な情報、障害対応・セキュリティ確保のために必要な記録、バックアップ等については、直ちに削除できない場合があります。",
      "利用者および利用施設は、必要に応じて本サービス上の情報を確認・保存するなど、施設内の運用に必要な措置を講じるものとします。",
    ],
  },
  {
    title: "第11条（知的財産権）",
    paragraphs: [
      "本サービスに関するプログラム、デザイン、文章、ロゴその他のコンテンツに関する権利は、運営者または正当な権利を有する第三者に帰属します。本規約に基づく利用は、これらの権利の譲渡または利用許諾を意味するものではありません。",
    ],
  },
  {
    title: "第12条（保証の否認・免責）",
    paragraphs: [
      "運営者は、本サービスの正確性、完全性、継続性、特定目的への適合性、エラーや障害が発生しないこと等について、明示または黙示を問わず保証しません。",
      "運営者は、法令上認められる範囲で、本サービスの利用または利用不能、登録情報の誤り・更新遅延、通信障害、データの消失等により利用者または第三者に生じた損害について責任を負いません。ただし、運営者の故意または重大な過失による場合その他法令上免責が認められない場合は、この限りではありません。",
      "利用施設および利用者は、本サービスを医療機器の実物確認、院内の安全管理手順、点検・保守その他必要な業務の代替として使用しないものとします。",
    ],
  },
  {
    title: "第13条（規約の変更）",
    paragraphs: [
      "運営者は、必要に応じて本規約を変更することがあります。変更内容および効力発生日は、本サービス上への掲載その他適切な方法で周知します。法令上利用者の同意が必要となる変更については、適切な方法で同意を取得します。",
    ],
  },
  {
    title: "第14条（準拠法・管轄）",
    paragraphs: [
      "本規約は日本法に準拠します。本サービスまたは本規約に関して紛争が生じた場合、運営者の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。ただし、法令に別段の定めがある場合はその定めに従います。",
    ],
  },
];

export default function TermsPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden px-4 py-10 text-[#dbe1ff] sm:px-6 sm:py-14"
      style={{
        background: "#0a122a",
        fontFamily: '"Manrope", sans-serif',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-0 h-[520px] w-[760px] -translate-x-1/2 rounded-full blur-[150px]"
          style={{ background: "rgba(0,210,255,0.08)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 75% 55% at 50% 0%, rgba(67,143,255,0.07), transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <header className="mb-8 border-b border-white/10 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-lg outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#00d2ff]"
            aria-label="DEVIXトップページへ戻る"
          >
            <img
              src="/logo.png"
              alt=""
              className="h-10 w-10 object-contain"
            />
            <span
              className="text-xl font-bold tracking-tight text-white"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            >
              DEVIX
            </span>
          </Link>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#a5e7ff]/75">
            Legal
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            利用規約
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#b9c5e4]">
            本利用規約は、医療機器管理サービス「DEVIX」の利用条件を定めるものです。
            ご利用前に内容をご確認ください。
          </p>
        </header>

        <div className="mb-8 rounded-xl border border-[#438fff]/20 bg-[#131a33]/70 p-4 text-sm leading-7 text-[#c8d4f0]">
          <p className="font-semibold text-white">ご利用にあたって</p>
          <p className="mt-1">
            DEVIXは、医療機器の配置や状態などを共有・管理するための補助ツールです。
            実機の所在・状態、点検の実施状況および使用可否は、施設内の手順に従って別途確認してください。
          </p>
        </div>

        <article className="space-y-5">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-xl border border-white/10 bg-[#131a33]/65 p-5 shadow-sm sm:p-6"
            >
              <h2 className="text-base font-bold leading-7 text-white sm:text-lg">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-7 text-[#c8d4f0]">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                {section.list && (
                  <ul className="list-disc space-y-1 pl-5 marker:text-[#00d2ff]">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </article>

        <footer className="mt-10 border-t border-white/10 pt-6 text-center text-xs leading-6 text-[#9ba9c9]">
          <p>本規約に関するお問い合わせは、DEVIXのお問い合わせ窓口までご連絡ください。</p>
          <nav
            aria-label="関連ページ"
            className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2"
          >
            <Link href="/" className="transition-colors hover:text-[#a5e7ff]">
              トップページ
            </Link>
            <Link
              href="/privacy"
              className="transition-colors hover:text-[#a5e7ff]"
            >
              プライバシーポリシー
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-[#a5e7ff]"
            >
              お問い合わせ
            </Link>
          </nav>
        </footer>
      </div>
    </main>
  );
}
