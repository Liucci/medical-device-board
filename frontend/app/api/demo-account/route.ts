import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ApplicationPayload = {
  hospitalName?: unknown;
  name?: unknown;
  role?: unknown;
  email?: unknown;
  phone?: unknown;
  preferredDate1?: unknown;
  preferredDate2?: unknown;
  message?: unknown;
};

const isString = (value: unknown): value is string =>
  typeof value === "string";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ApplicationPayload;

    const hospitalName = isString(body.hospitalName)
      ? body.hospitalName.trim()
      : "";
    const name = isString(body.name) ? body.name.trim() : "";
    const role = isString(body.role) ? body.role.trim() : "";
    const email = isString(body.email) ? body.email.trim() : "";
    const phone = isString(body.phone) ? body.phone.trim() : "";
    const preferredDate1 = isString(body.preferredDate1)
      ? body.preferredDate1
      : "";
    const preferredDate2 = isString(body.preferredDate2)
      ? body.preferredDate2
      : "";
    const message = isString(body.message) ? body.message.trim() : "";

    if (!hospitalName || hospitalName.length > 200) {
      return NextResponse.json(
        { success: false, error: "医療機関名を正しく入力してください。" },
        { status: 400 }
      );
    }

    if (!name || name.length > 100) {
      return NextResponse.json(
        { success: false, error: "ご担当者名を正しく入力してください。" },
        { status: 400 }
      );
    }

    if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "メールアドレスを正しく入力してください。" },
        { status: 400 }
      );
    }

    if (
      role.length > 200 ||
      phone.length > 50 ||
      message.length > 5000
    ) {
      return NextResponse.json(
        { success: false, error: "入力内容が長すぎます。" },
        { status: 400 }
      );
    }

    // GASの既存受信フィールド形式を維持する。
    const payload = {
      hospitalName,
      name,
      role,
      email,
      phone,
      preferredDate1,
      preferredDate2,
      message,
    };

    const gasUrl = process.env.GAS_CONTACT_URL;

    if (!gasUrl) {
      console.error("GAS_CONTACT_URL is not configured.");
      return NextResponse.json(
        { success: false, error: "送信設定に問題があります。時間をおいて再度お試しください。" },
        { status: 500 }
      );
    }

    const response = await fetch(gasUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    
    if (!response.ok) {
      throw new Error(`GAS HTTP error: ${response.status}`);
    }

    const responseText = await response.text();
        console.log("[Demo Account API] GAS status:", response.status);
        console.log("[Demo Account API] GAS response:", responseText);


    let result: unknown;
    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error(
        `GAS returned non-JSON response: ${responseText.slice(0, 300)}`
      );
    }


    if (
    typeof result !== "object" ||
    result === null ||
    !("status" in result) ||
    (result as { status?: unknown }).status !== "success"
    ) {
    throw new Error("GAS did not confirm successful application receipt.");
    }


    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Demo account application failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "送信処理でエラーが発生しました。通信環境をご確認のうえ、再度お試しください。",
      },
      { status: 500 }
    );
  }
  
}
