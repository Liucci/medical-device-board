import {refreshToken} from "../api/auth/refreshToken"
//不要なら削除
//export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_URL!
    : process.env.NEXT_PUBLIC_PROD_API_URL!


