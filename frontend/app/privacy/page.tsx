import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー | DEVIX",
  description: "DEVIXにおける利用者情報およびサービス上の情報の取扱いについて定めています。",
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
    title: "第1条（基本方針）",
    paragraphs: [
      "DEVIX（以下「本サービス」といいます。）の運営者（以下「運営者」といいます。）は、本サービスの提供にあたり取り扱う利用者に関する情報を、適用される法令等に従い、適切に取り扱うよう努めます。",
      "本サービスは、医療機器の配置場所や状態等の管理を主な目的としており、個人情報の入力を原則として必要としない設計を目指しています。ただし、アカウント管理や利用者が任意で入力する情報など、情報を取り扱う場合があります。",
    ],
  },
  {
    title: "第2条（取得する情報）",
    paragraphs: [
      "運営者は、本サービスの提供に必要な範囲で、次の情報を取得・取り扱うことがあります。",
    ],
    list: [
      "アカウント情報：メールアドレス、表示名、所属施設、利用者の権限・アカウント状態等",
      "医療機器管理情報：機器の種類・機種、管理番号、シリアル番号、配置場所、稼働状態、点検・メンテナンスに関する記録、備考等",
      "任意入力情報：利用者が入力した患者名その他の情報。患者名の入力は必須ではありません",
      "お問い合わせ情報：お問い合わせ時に利用者が提供するメールアドレス、本文その他の情報",
      "利用・運用情報：ログインやデータ更新等の操作に関する記録、日時、障害対応・セキュリティ確保に必要な技術情報等",
    ],
  },
  {
    title: "第3条（利用目的）",
    paragraphs: [
      "運営者は、取得した情報を次の目的で利用します。",
    ],
    list: [
      "本サービスの提供、本人・利用権限の確認、アカウント管理のため",
      "医療機器の配置・状態・点検等の情報を表示・共有・記録する機能を提供するため",
      "お問い合わせへの対応、重要なお知らせや運用上必要な連絡を行うため",
      "不正利用の防止、セキュリティ確保、障害の調査・対応およびサービス品質の維持・改善のため",
      "本サービスの利用条件・利用規約への違反に対応するため",
      "法令等に基づく対応のため",
    ],
  },
  {
    title: "第4条（患者情報等の入力について）",
    paragraphs: [
      "患者名の入力は本サービスの必須要件ではありません。利用施設および利用者は、患者名その他の個人情報を入力する場合、施設内の規程・手順および適用される法令等を確認し、業務上必要な最小限の情報にとどめるものとします。",
      "本サービスは電子カルテではなく、電子カルテとの連携を前提としていません。利用者は、個人情報や機微な情報を必要以上に入力しないでください。",
    ],
  },
  {
    title: "第5条（第三者提供）",
    paragraphs: [
      "運営者は、次の場合を除き、取得した個人情報を本人の同意なく第三者に提供しません。",
    ],
    list: [
      "法令に基づく場合",
      "人の生命、身体または財産の保護のために必要であり、本人の同意を得ることが困難な場合",
      "公衆衛生の向上または児童の健全な育成の推進のために特に必要であり、本人の同意を得ることが困難な場合",
      "国の機関、地方公共団体等への協力が必要であり、本人の同意により当該事務の遂行に支障を及ぼすおそれがある場合",
    ],
  },
  {
    title: "第6条（外部サービスの利用・委託）",
    paragraphs: [
      "運営者は、本サービスの提供・運用のため、データベース、認証、ホスティングその他の外部サービスを利用することがあります。",
      "運営者は、外部サービスの利用にあたり、サービス提供に必要な範囲で情報を取り扱わせることがあり、利用するサービスの規約・プライバシー情報等を確認しながら、適切な管理に努めます。利用する外部サービスは、機能変更等により追加・変更される場合があります。",
    ],
  },
{
  title: "第7条（安全管理措置）",
  paragraphs: [
    "運営者は、本サービスで取り扱う情報の漏えい、滅失、毀損、不正アクセス等のリスクを低減するため、情報の性質やサービスの運用状況に応じた安全管理措置を講じるよう努めます。",
    "本サービスでは、通信の暗号化（HTTPS）および利用者の所属する医療機関に応じたアクセス制御を実施し、利用者が権限を有しない情報へのアクセスを制限するための対策を講じています。",
    "運営者は、利用する外部サービスの機能や提供条件を踏まえ、情報の適切な管理に努めるとともに、安全管理措置の継続的な確認および改善に努めます。",
    "セキュリティ上の問題が発生した場合、運営者は状況に応じて被害の拡大防止および必要な対応に努めます。また、法令上の報告や本人への通知等が必要となる場合には、関係法令に従って対応します。",
    "利用者および利用施設は、アカウント情報を適切に管理し、利用権限を必要な範囲に限定するとともに、施設内の情報管理ルールに従って本サービスを利用してください。"
  ],
},
  
  {
    title: "第8条（保存期間・削除）",
    paragraphs: [
      "運営者は、利用目的の達成に必要な期間、または法令上・運用上必要な期間、情報を保存します。具体的な保存期間は、情報の種類、利用状況、システム運用および法令上の要請等により異なります。",
      "利用施設から情報の削除依頼があった場合、運営者は依頼者の権限等を確認したうえで、合理的な範囲で削除に対応します。バックアップ、障害対応・セキュリティ確保に必要な記録、法令上保存が必要な情報等については、削除までに時間を要する場合や、直ちに削除できない場合があります。",
      "利用施設は、削除を依頼する前に、必要な記録の保存や施設内での引継ぎ等を確認するものとします。",
    ],
  },
  {
    title: "第9条（利用者による確認・訂正）",
    paragraphs: [
      "利用者は、本サービス上で提供される機能に応じて、自ら入力した情報の確認・更新を行うことができます。情報の開示、訂正、利用停止または削除等の依頼については、利用施設の管理者を通じて、または本ポリシー末尾のお問い合わせ窓口へご連絡ください。本人確認や権限確認等のため、対応に必要な情報の提供をお願いする場合があります。",
    ],
  },
  {
    title: "第10条（Cookie等の利用）",
    paragraphs: [
      "本サービスでは、ログイン状態の維持、認証、セキュリティ確保等のためにCookieその他これに類する技術を利用する場合があります。ブラウザの設定でCookieを制限した場合、本サービスの一部機能が利用できなくなることがあります。",
    ],
  },
  {
    title: "第11条（本ポリシーの変更）",
    paragraphs: [
      "運営者は、法令等への対応や本サービスの変更等に応じて、本ポリシーを改定することがあります。改定後の内容および適用時期は、本サービス上への掲載その他適切な方法でお知らせします。",
    ],
  },
  {
    title: "第12条（運営者・お問い合わせ窓口）",
    paragraphs: [
      "本サービスは現在、個人により運営されています。運営形態等に変更があった場合は、必要に応じて本ポリシーを更新します。",
      "本ポリシーまたは利用者情報の取扱いに関するお問い合わせは、お問い合わせページからご連絡ください。",
    ],
  },
];

export default function PrivacyPage() {
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
            <img src="/logo.png" alt="" className="h-10 w-10 object-contain" />
            <span
              className="text-xl font-bold tracking-tight text-white"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            >
              DEVIX
            </span>
          </Link>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#a5e7ff]/75">
            Privacy
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            プライバシーポリシー
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#b9c5e4]">
            DEVIXにおける利用者情報およびサービス上の情報の取扱いについて定めています。
          </p>
        </header>

        <div className="mb-8 rounded-xl border border-[#438fff]/20 bg-[#131a33]/70 p-4 text-sm leading-7 text-[#c8d4f0]">
          <p className="font-semibold text-white">DEVIXの情報管理について</p>
          <p className="mt-1">
            DEVIXは医療機器の「場所と状態」の管理を主な目的とし、患者名の入力は必須ではありません。
            個人情報を入力する場合は、施設内の規程に従い、必要最小限の情報を登録してください。
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
          <nav
            aria-label="関連ページ"
            className="flex flex-wrap justify-center gap-x-5 gap-y-2"
          >
            <Link href="/" className="transition-colors hover:text-[#a5e7ff]">
              トップページ
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-[#a5e7ff]"
            >
              利用規約
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
