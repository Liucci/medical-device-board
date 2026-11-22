import { fetchCurrentUser } from "../api/auth/fetchCurrentUser"
import { normalizeCurrentUser } from "../mapper/userMapper"

type InitDashboardParams = {
                            setCurrentUser: (user: any) => void
}
//Dashboardの初期化関数
//setCurrentUserをする
export const initDashboard = async ({
                                    setCurrentUser,
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
    return user
}