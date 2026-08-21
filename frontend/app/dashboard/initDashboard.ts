import { fetchCurrentUser } from "../api/auth/fetchCurrentUser"
type InitDashboardParams = {
                            setCurrentUser: (user: any) => void
                            setAccessToken: (token: string) => void
}
//Dashboardの初期化関数
//setCurrentUserとsetAccessTokenをする
export const initDashboard = async ({
                                    setCurrentUser,
                                    setAccessToken,
}: InitDashboardParams) => 
{
    console.log("initDashboard")
    const user = await fetchCurrentUser()
    if (!user) {
        throw new Error("Failed to fetch current user")
    }
    setCurrentUser(user)
    setAccessToken(user.access_token)
    return user
}