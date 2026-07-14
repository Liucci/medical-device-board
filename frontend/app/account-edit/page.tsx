import AccountEditClient from "./AccountEditClient"

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
    <AccountEditClient
      code={params.code ?? ""}
    />
  )
}