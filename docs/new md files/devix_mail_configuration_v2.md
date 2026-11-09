# Devix メール送受信構成

最終更新：2026-11-09

## 役割分担

  サービス                   役割
  -------------------------- ----------------------------------------------------
  Resend                     Devixからの自動送信、Gmailからの手動送信に使うSMTP
  Cloudflare Email Routing   `@devix.jp` 宛てメールを個人Gmailへ転送
  Gmail                      メールの確認・作成・返信

## 送信

### 自動送信（Devix / FastAPI）

Resend API（`https://api.resend.com/emails`）を利用する。

  用途                 送信元アドレス
  -------------------- -------------------
  ユーザー招待         `invite@devix.jp`
  アカウント編集関連   `edit@devix.jp`
  パスワードリセット   `reset@devix.jp`
  デモ申請・運営連絡   `info@devix.jp`

### 手動送信（Gmail）

Gmailに `info@devix.jp`
を「他のメールアドレスから送信」として登録し、Resend
SMTP経由で送信する。

  項目           設定値
  -------------- -------------------
  SMTPサーバー   `smtp.resend.com`
  ポート         `587`
  ユーザー名     `resend`
  パスワード     Resend API Key
  接続方式       TLS

Gmailの作成画面で差出人を選択する。通常の個人Gmailアドレスもそのまま使用できる。

## 受信

Cloudflare Email Routingで `info@devix.jp`
宛てのメールを個人Gmailへ転送する。

相手が `info@devix.jp`
に返信した場合も、Cloudflare経由で個人Gmailに届く。

※ `invite@`、`edit@`、`reset@`
は送信元として利用するアドレスであり、受信転送は自動設定されない。これら宛ての返信も受け付ける場合は、Cloudflareに転送ルールを追加する。

## 現在の状態

-   Resendによる自動送信：利用中
-   Gmailから `info@devix.jp` 名義で送信：設定済み・送信成功
-   Cloudflareから `info@devix.jp` から個人Gmailへの転送：設定済み
-   `invite@`、`edit@`、`reset@`：用途別の送信元として使用する設計

## 運用上の注意

-   ResendのAPI Keyは秘密情報として管理する。
-   Resendで送信元アドレスを指定しても、そのアドレスの受信箱や転送設定は作成されない。
-   自動送信メールで返信を受け付ける場合は、用途に応じて `Reply-To`
    を設定する。
-   Resendで `devix.jp` のドメイン認証状態を維持する。
-   送信元や返信先を変更した場合は、送信テストと返信の受信テストを行う。
