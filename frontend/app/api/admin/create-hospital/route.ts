import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {

    // =========================
    // authorization
    // =========================

    const authHeader =
      req.headers.get("authorization")

    if (!authHeader) {

      return NextResponse.json(
        { error: "unauthorized" },
        { status: 401 }
      )
    }

    // =========================
    // supabase client
    // =========================

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: authHeader
          }
        }
      }
    )

    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // =========================
    // auth user
    // =========================

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {

      return NextResponse.json(
        { error: "unauthorized" },
        { status: 401 }
      )
    }

    // =========================
    // current user
    // =========================

    const {
      data: currentUser,
      error: currentUserError
    } = await adminSupabase

      .from("users")

      .select(`
        id,
        role,
        is_active
      `)

      .eq("id", user.id)

      .single()

    if (
      currentUserError ||
      !currentUser
    ) {

      return NextResponse.json(
        { error: "user not found" },
        { status: 404 }
      )
    }

    // =========================
    // permission check
    // =========================

    if (!currentUser.is_active) {

      return NextResponse.json(
        { error: "inactive user" },
        { status: 403 }
      )
    }

    if (
      currentUser.role !==
      "system_admin"
    ) {

      return NextResponse.json(
        { error: "forbidden" },
        { status: 403 }
      )
    }

    // =========================
    // request body
    // =========================

    const body = await req.json()

    const {
    hospitalName,
    displayName,
    password,
    pricePlan
    } = body

    const email =
    body.email
        ?.trim()
        .toLowerCase()
        
    // =========================
    // validation
    // =========================

    if (
      !hospitalName ||
      !displayName ||
      !email ||
      !password
    ) {

      return NextResponse.json(
        { error: "missing required fields" },
        { status: 400 }
      )
    }

    // =========================
    // hospital create
    // =========================

    const {
      data: hospitalData,
      error: hospitalError
    } = await adminSupabase

      .from("hospitals")

      .insert({
        hospital_name: hospitalName,
        price_plan:
          pricePlan || null,
        is_active: true
      })

      .select()

      .single()

    if (hospitalError) {

      return NextResponse.json(
        {
          error:
            hospitalError.message
        },
        { status: 500 }
      )
    }

    // =========================
    // auth create
    // =========================

    const {
      data: authData,
      error: authCreateError
    } =
      await adminSupabase
        .auth.admin
        .createUser({
          email,
          password,
          email_confirm: true
        })

    if (
      authCreateError ||
      !authData.user
    ) {

      // rollback hospital

      await adminSupabase

        .from("hospitals")

        .delete()

        .eq(
          "id",
          hospitalData.id
        )

      return NextResponse.json(
        {
          error:
            authCreateError?.message ||
            "auth user create failed"
        },
        { status: 500 }
      )
    }

    // =========================
    // users insert
    // =========================

    const {
      data: createdUser,
      error: insertUserError
    } = await adminSupabase

      .from("users")

      .insert({
        id:
          authData.user.id,

        hospital_id:
          hospitalData.id,

        email,

        display_name:
          displayName,

        role: "admin",

        is_active: true
      })

      .select()

      .single()

    if (insertUserError) {

      // rollback auth user

      await adminSupabase
        .auth.admin
        .deleteUser(
          authData.user.id
        )

      // rollback hospital

      await adminSupabase

        .from("hospitals")

        .delete()

        .eq(
          "id",
          hospitalData.id
        )

      return NextResponse.json(
        {
          error:
            insertUserError.message
        },
        { status: 500 }
      )
    }

    // =========================
    // success
    // =========================

    return NextResponse.json({
      hospital: hospitalData,
      user: createdUser
    })

  } catch (err) {

    console.error(err)

    return NextResponse.json(
      { error: "server error" },
      { status: 500 }
    )
  }
}