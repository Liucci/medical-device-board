let timer: ReturnType<typeof setTimeout> | null = null

export function startAutoLogout(
                                logoutTime: string | null,
                                logout: () => void
                                ) 
{
    console.log("startAutoLogout")
    stopAutoLogout()
    if (!logoutTime) { return }
    const now = new Date()
    const logoutAt = new Date()
    const [hour, minute] = logoutTime.split(":").map(Number)
    logoutAt.setHours(hour, minute, 0, 0)
    // 今日のログアウト時刻を過ぎていたら翌日にする
    if (logoutAt <= now) {
        logoutAt.setDate(logoutAt.getDate() + 1)
    }
    const delay = logoutAt.getTime() - now.getTime()
    console.log("logout after", delay / 1000, "sec")
    timer = setTimeout(() => {
        timer = null
        logout()
        console.log("自動logout実施")
    }, delay)
}

export function stopAutoLogout() 
{
    console.log("stopAutoLogout")
    if (!timer) { return }
    clearTimeout(timer)
    timer = null
}