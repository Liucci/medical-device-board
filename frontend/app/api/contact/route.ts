
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const allowedTypes = [
  "サービスについて",
  "導入・利用方法について",
  "料金について",
  "不具合・トラブルについて",
  "セキュリティについて",
  "その他",
];

function redirectToContact(request: Request, status: string) {
  return NextResponse.redirect(
    new URL(`/contact?status=${status}`, request.url),
    303
  );
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // ボット対策用の隠しフィールド
    // 値が入っていた場合は保存せず、完了扱いにする
    if (String(formData.get("website") || "").trim()) {
      return redirectToContact(request, "success");
    }

    const inquiryType = String(formData.get("inquiryType") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!allowedTypes.includes(inquiryType)) {
      return redirectToContact(request, "error");
    }

    if (!message || message.length > 5000) {
      return redirectToContact(request, "error");
    }

    if (email.length > 254) {
      return redirectToContact(request, "error");
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return redirectToContact(request, "error");
    }

    const gasUrl = process.env.GAS_CONTACT_URL;
    const secret = process.env.GAS_CONTACT_SECRET;

    if (!gasUrl || !secret) {
      console.error("Contact API environment variables are missing.");
      return redirectToContact(request, "error");
    }

    const response = await fetch(gasUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret,
        inquiryType,
        email,
        message,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`GAS HTTP error: ${response.status}`);
    }

 

const responseText = await response.text();

console.log("[Contact API] GAS HTTP status:", response.status);
console.log("[Contact API] GAS response content-type:",
  response.headers.get("content-type")
);
console.log("[Contact API] GAS response body:",
  responseText.slice(0, 2000)
);

let result;

try {
  result = JSON.parse(responseText);
} catch {
  throw new Error(
    `GAS returned non-JSON response: ${responseText.slice(0, 300)}`
  );
}

if (result.success !== true) {
  console.error("[Contact API] GAS rejected inquiry:", result);
  throw new Error(
    `GAS rejected the inquiry: ${result.error || "Unknown error"}`
  );
}

if (result.success !== true) {
  console.error("GAS rejected inquiry:", {
    httpStatus: response.status,
    error: result.error || "Unknown error",
  });

  throw new Error(
    `GAS rejected the inquiry: ${result.error || "Unknown error"}`
  );
}


    return redirectToContact(request, "success");
  } catch (error) {
    console.error("Contact submission failed:", error);
    return redirectToContact(request, "error");
  }
}
