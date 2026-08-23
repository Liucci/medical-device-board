import { fetchCurrentUser } from "../api/auth/fetchCurrentUser"
import { normalizeCurrentUser } from "../utils/userMapper"

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
    //console.log("user:",user)
    if (!user) {
        console.log("Failed to fetch current user")
        setCurrentUser(null)
        return null
    }

    setCurrentUser(normalizeCurrentUser(user))
    setAccessToken(user.access_token)
    return user
}