type PageProps = {
  searchParams: Promise<{
    code?: string
  }>
}

export default async function Page({
  searchParams,
}: PageProps) {

  const params = await searchParams
  const code = params.code ?? ""

  return (
    <div>
      code : {code}
    </div>
  )
}