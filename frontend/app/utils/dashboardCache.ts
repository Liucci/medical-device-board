let cachedDashboardData: any = null
let needsRefreshToday = false

export const getDashboardCache = () => {
  console.log("getDashboardCache")
  return cachedDashboardData
}

export const setDashboardCache = (data: any) => {
  console.log("setDashboardCache")
  cachedDashboardData = data
}

export const hasDashboardCache = () => {
  return cachedDashboardData !== null
}

export const clearDashboardCache = () => {
  console.log("clearDashboardCache")
  cachedDashboardData = null
}


//点検実施後、TodayInspectionsだけの情報を取得するためのフラグ
export const flagNeedsRefreshTodayInspections = (flag: boolean) => {
  needsRefreshToday = flag
}

export const getNeedsRefreshTodayInspections = () => {
  return needsRefreshToday
}