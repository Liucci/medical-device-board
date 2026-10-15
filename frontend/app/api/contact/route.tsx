import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ContactPayload = {
  inquiryType?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown;
};

const allowedTypes = [
  "アカウント申請",
  "サービスについて",
  "導入・利用方法について",
  "料金について",
  "不具合・トラブルについて",
  "セキュリティについて",
  "その他",
];

const isString = (value: unknown): value is string =>
  typeof value === "string";

export async function POST(request: Request) {
  try {
    // 1. リクエストJSONを取得
    const body = (await request.json()) as ContactPayload;

    // 2. 入力値を文字列として取得・整形
    const inquiryType = isString(body.inquiryType)
      ? body.inquiryType.trim()
      : "";

    const email = isString(body.email)
      ? body.email.trim()
      : "";

    const message = isString(body.message)
      ? body.message.trim()
      : "";

    const website = isString(body.website)
      ? body.website.trim()
      : "";

    // 3. ボット対策
    // 隠し項目に値がある場合は保存せず、成功扱いにする
    if (website) {
      return NextResponse.json({ success: true });
    }

    // 4. お問い合わせ種別を検証
    if (!allowedTypes.includes(inquiryType)) {
      return NextResponse.json(
        {
          success: false,
          error: "お問い合わせ種類を選択してください。",
        },
        { status: 400 }
      );
    }

    // 5. お問い合わせ内容を検証
    if (!message || message.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          error: "お問い合わせ内容を正しく入力してください。",
        },
        { status: 400 }
      );
    }

    // 6. メールアドレスを検証（任意）
    if (
      email.length > 254 ||
      (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "メールアドレスを正しく入力してください。",
        },
        { status: 400 }
      );
    }

    // 7. GASのURLと秘密鍵を取得
    const gasUrl = process.env.GAS_CONTACT_URL;
    const secret = process.env.GAS_CONTACT_SECRET;

    if (!gasUrl || !secret) {
      console.error(
        "Contact API environment variables are missing.",
        {
          gasUrlConfigured: Boolean(gasUrl),
          secretConfigured: Boolean(secret),
        }
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "送信設定に問題があります。時間をおいて再度お試しください。",
        },
        { status: 500 }
      );
    }

    // 8. GASへ送信
    const payload = {
      inquiryType,
      email,
      message,
      secret,
    };

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

    // 9. GASのレスポンスを取得
    const responseText = await response.text();

    console.log(
      "[Contact API] GAS HTTP status:",
      response.status
    );
    console.log("[Contact API] GAS response:", responseText);
    let result: unknown;

    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error(
        `GAS returned non-JSON response: ${responseText.slice(0, 300)}`
      );
    }

    // 10. GASが成功を明示した場合のみ受付成功とする
    if (
      typeof result !== "object" ||
      result === null ||
      !("status" in result) ||
      (result as { status?: unknown }).status !== "success"
    ) {
      console.error(
        "[Contact API] GAS did not confirm successful receipt."
      );

      throw new Error("GAS did not confirm successful contact receipt.");
    }

    // 11. フロントへ成功レスポンス
    return NextResponse.json({ success: true });
  } catch (error) {
    // SECRET鍵や問い合わせ本文、メールアドレスはログに出さない
    console.error(
      "Contact submission failed:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "送信処理でエラーが発生しました。通信環境をご確認のうえ、再度お試しください。",
      },
      { status: 500 }
    );
  }
}
