import { supabase }
from "@/app/lib/supabase"

export const createInviteCode =
async (
  hospitalId: string,
  createdBy: string,
  email: string,
  role: string
) => {

  // 招待コード生成
  const code =
    crypto.randomUUID()

  // 7日後期限
  const expiresAt =
    new Date(
      Date.now()
      + 7 * 24 * 60 * 60 * 1000
    )

  // DB保存
  const { data, error } =
    await supabase
      .from("invite_codes")
      .insert({
        code,
        hospital_id: hospitalId,
        created_by:createdBy,
        email,
        role: role,
        used: false,
        expires_at:
          expiresAt
      })
      .select()
      .single()

  if (error) {
    throw error
  }

  return data
}