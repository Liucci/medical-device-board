
import type { Metadata } from "next"
import RegisterClient from "./RegisterClient"

export const metadata: Metadata = {
  title: "初回管理者登録 | devix",
  robots: {
    index: false,
    follow: true,
  },
}

type PageProps = {
  searchParams: Promise<{
    code?: string
  }>
}

export default async function Page({
  searchParams
}: PageProps) {
  const params = await searchParams

  return (
    <RegisterClient
      code={params.code ?? ""}
    />
  )
}
