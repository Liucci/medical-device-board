"use client";

import { authFetch } from "../client/apiClient";

export default function TestAuthPage() {
  const testFetch = async () => {
    try {
      console.log("before authFetch");

      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/current-user`
      );

      console.log("status", res.status);

      const data = await res.json();

      console.log("data", data);

      alert("成功");
    } catch (e) {
      console.error(e);
      alert("失敗");
    }
  };

  const expireToken = () => {
  localStorage.setItem("access_token_expires_at", "abc");
    localStorage.removeItem("access_token")
  console.log(
    "expires_at =",
    localStorage.getItem("access_token_expires_at")
  );

  alert("Access Tokenを期限切れ扱いにしました");
};


const showTokenInfo = () => {
  console.log({
    accessToken: localStorage.getItem("access_token"),
    refreshToken: localStorage.getItem("refresh_token"),
    expiresAt: localStorage.getItem("access_token_expires_at"),
  });
};



 return (
    <div
      style={{
        padding: 40,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: 300,
      }}
    >
      <h2>Auth Test</h2>

      <button
        style={{ padding: "12px", fontSize: "16px", cursor: "pointer" }}
        onClick={showTokenInfo}
      >
        Token確認
      </button>

      <button
        style={{ padding: "12px", fontSize: "16px", cursor: "pointer" }}
        onClick={expireToken}
      >
        AccessToken期限切れ
      </button>

      <button
        style={{ padding: "12px", fontSize: "16px", cursor: "pointer" }}
        onClick={testFetch}
      >
        authFetch実行
      </button>
    </div>
  );
}