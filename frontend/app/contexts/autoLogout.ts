let timer: ReturnType<typeof setInterval> | null = null
let logoutDate = ""

export function startAutoLogout(
    enabled: boolean,
    logoutTime: string | null,
    logout: () => void
) {

    stopAutoLogout()

    if (!enabled) {return}

    if (!logoutTime) {return}

    timer = setInterval(() => {

        const now = new Date()

        const today =
            now.toISOString().slice(0, 10)

        if (logoutDate !== today) {
            logoutDate = ""
        }

        const currentTime =
            now.toTimeString().slice(0, 5)

        if (currentTime !== logoutTime) {return}

        if (logoutDate === today) {return}

        logoutDate = today

        logout()

    }, 60 * 1000)

}

export function stopAutoLogout() {

    if (!timer) {return}

    clearInterval(timer)
    timer = null

}