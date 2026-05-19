import { supabase }
from "@/app/lib/supabase"

export const createInviteCode =
  async (
    hospitalId: string,
    createdBy: string
  ) => {

    const code =
      crypto.randomUUID()

    const { data, error } =
      await supabase
        .from("invite_codes")
        .insert({
          code,
          hospital_id: hospitalId,
          created_by: createdBy,
          role: "staff"
        })
        .select()
        .single()

    if (error) throw error

    return data
}