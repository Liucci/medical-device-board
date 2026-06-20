import { Suspense } from "react"
import RegisterContent from "./RegisterContent"

export const dynamic = "force-dynamic"

export default function Page() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  )
}