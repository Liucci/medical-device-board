import RegisterClient from "./RegisterClient"

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