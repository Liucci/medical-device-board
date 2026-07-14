"use client"

import { useEffect, useState } from "react"
import { verifyAccountEditCodeTransaction } from "../api/transactions/accountEdits/verifyAccountEditTransaction"
import { AccountInfoFrontType } from "../types/accountEditTypes"
import AccountEditForm from "./AccountEditForm"

type Props = {
                code: string
             }

export default function AccountEditClient({
                                            code
                                          }: Props) {

  const [loading, setLoading] = useState(true)
  const [accountInfo, setAccountInfo] = useState<AccountInfoFrontType | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {

    fetchAccountInfo()

  }, [])

  const fetchAccountInfo = async () => {

    try {

      const response =
        await verifyAccountEditCodeTransaction({
                                                  code
                                                })

      setAccountInfo(response)

    } catch {

      setError("編集URLが無効です。")

    } finally {

      setLoading(false)

    }

  }

  if (loading) {

    return <div>Loading...</div>

  }

  if (error) {

    return <div>{error}</div>

  }

  if (!accountInfo) {

    return null

  }

  return (
          <AccountEditForm
            code={code}
            displayName={accountInfo.displayName}
            email={accountInfo.email}
          />
        )

}