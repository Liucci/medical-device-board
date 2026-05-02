export type Ward = {
  wardID: number
  name: string
}

export const wards: Ward[] = [
  { wardID: 1, name: "ICU" },
  { wardID: 2, name: "HCU" },
  { wardID: 3, name: "E3" },
  { wardID: 4, name: "CCU" },
  { wardID: 5, name: "W6" },
  { wardID: 6, name: "SCU" },
  { wardID: 7, name: "E6" },
  { wardID: 8, name: "NICU" },
  { wardID: 9, name: "E4小児" },
  { wardID: 10, name: "E4産科" },
  { wardID: 11, name: "W5" },
  { wardID: 12, name: "E5" },
  { wardID: 13, name: "W7" },
  { wardID: 14, name: "E7" }
]

export type Room={
  id: number
  wardId: number
  roomName: string
  patientName?: string

  //patientName?: string
}
export type RoomDB={
  id: number
  ward_id: number
  name: string
  patient_name?: string
}

export const rooms: Room[] = [
  // --- ICU ---
  { id: 1, wardId: 1, roomName: "ICU-1" },
  { id: 2, wardId: 1, roomName: "ICU-2" },
  { id: 3, wardId: 1, roomName: "ICU-3" },
  { id: 4, wardId: 1, roomName: "ICU-4" },
  { id: 5, wardId: 1, roomName: "ICU-5" },
  { id: 6, wardId: 1, roomName: "ICU-6" },
  { id: 7, wardId: 1, roomName: "ICU-7" },
  { id: 8, wardId: 1, roomName: "ICU-8" },
  { id: 9, wardId: 1, roomName: "ICU-9" },
  { id: 10, wardId: 1, roomName: "ICU-10" },

  // --- HCU ---
  { id: 11, wardId: 2, roomName: "HCU-1" },
  { id: 12, wardId: 2, roomName: "HCU-2" },
  { id: 13, wardId: 2, roomName: "HCU-3" },
  { id: 14, wardId: 2, roomName: "HCU-4" },
  { id: 15, wardId: 2, roomName: "HCU-5" },
  { id: 16, wardId: 2, roomName: "HCU-6" },
  { id: 17, wardId: 2, roomName: "HCU-7" },
  { id: 18, wardId: 2, roomName: "HCU-8" },

  // --- E3 ---
  { id: 19, wardId: 3, roomName: "301-A" },
  { id: 20, wardId: 3, roomName: "301-B" },
  { id: 21, wardId: 3, roomName: "301-C" },
  { id: 22, wardId: 3, roomName: "301-D" },
  { id: 23, wardId: 3, roomName: "302" },
  { id: 24, wardId: 3, roomName: "303" },
  { id: 25, wardId: 3, roomName: "304" },
  { id: 26, wardId: 3, roomName: "305" },
  { id: 27, wardId: 3, roomName: "306" },

  // --- CCU ---
  { id: 28, wardId: 4, roomName: "CCU-1" },
  { id: 29, wardId: 4, roomName: "CCU-2" },
  { id: 30, wardId: 4, roomName: "CCU-3" },
  { id: 31, wardId: 4, roomName: "CCU-4" },
  { id: 32, wardId: 4, roomName: "CCU-5" },
  { id: 33, wardId: 4, roomName: "CCU-6" },

  // --- W6 (660–673) ---
  { id: 34, wardId: 5, roomName: "660" },
  { id: 35, wardId: 5, roomName: "661" },
  { id: 36, wardId: 5, roomName: "662" },
  { id: 37, wardId: 5, roomName: "663" },
  { id: 38, wardId: 5, roomName: "664" },
  { id: 39, wardId: 5, roomName: "665" },
  { id: 40, wardId: 5, roomName: "666" },
  { id: 41, wardId: 5, roomName: "667" },
  { id: 42, wardId: 5, roomName: "668" },
  { id: 43, wardId: 5, roomName: "669" },
  { id: 44, wardId: 5, roomName: "670" },
  { id: 45, wardId: 5, roomName: "671" },
  { id: 46, wardId: 5, roomName: "672" },
  { id: 47, wardId: 5, roomName: "673" },

  // --- E6 (614–627) ---
  { id: 48, wardId: 7, roomName: "614" },
  { id: 49, wardId: 7, roomName: "615" },
  { id: 50, wardId: 7, roomName: "616" },
  { id: 51, wardId: 7, roomName: "617" },
  { id: 52, wardId: 7, roomName: "618" },
  { id: 53, wardId: 7, roomName: "619" },
  { id: 54, wardId: 7, roomName: "620" },
  { id: 55, wardId: 7, roomName: "621" },
  { id: 56, wardId: 7, roomName: "622" },
  { id: 57, wardId: 7, roomName: "623" },
  { id: 58, wardId: 7, roomName: "624" },
  { id: 59, wardId: 7, roomName: "625" },
  { id: 60, wardId: 7, roomName: "626" },
  { id: 61, wardId: 7, roomName: "627" },

  // --- NICU ---
  { id: 62, wardId: 8, roomName: "NICU-1" },
  { id: 63, wardId: 8, roomName: "NICU-2" },
  { id: 64, wardId: 8, roomName: "NICU-3" },
  { id: 65, wardId: 8, roomName: "NICU-4" },
  { id: 66, wardId: 8, roomName: "NICU-5" },
  { id: 67, wardId: 8, roomName: "NICU-6" },
  { id: 68, wardId: 8, roomName: "NICU-7" },
  { id: 69, wardId: 8, roomName: "NICU-8" },
  { id: 70, wardId: 8, roomName: "NICU-9" },

  // --- W5 ---
  { id: 71, wardId: 11, roomName: "565" },
  { id: 72, wardId: 11, roomName: "566" },
  { id: 73, wardId: 11, roomName: "567" },
  { id: 74, wardId: 11, roomName: "568" },
  { id: 75, wardId: 11, roomName: "569" },
  { id: 76, wardId: 11, roomName: "570" },
  { id: 77, wardId: 11, roomName: "571" },
  { id: 78, wardId: 11, roomName: "572" },
  { id: 79, wardId: 11, roomName: "573" },
  { id: 80, wardId: 11, roomName: "574" },
  { id: 81, wardId: 11, roomName: "575" },
  { id: 82, wardId: 11, roomName: "576" },
  { id: 83, wardId: 11, roomName: "577" },
  { id: 84, wardId: 11, roomName: "578" },

  // --- E5 ---
  { id: 85, wardId: 12, roomName: "518" },
  { id: 86, wardId: 12, roomName: "519" },
  { id: 87, wardId: 12, roomName: "520" },
  { id: 88, wardId: 12, roomName: "521" },
  { id: 89, wardId: 12, roomName: "522" },
  { id: 90, wardId: 12, roomName: "523" },
  { id: 91, wardId: 12, roomName: "524" },
  { id: 92, wardId: 12, roomName: "525" },
  { id: 93, wardId: 12, roomName: "526" },
  { id: 94, wardId: 12, roomName: "527" },
  { id: 95, wardId: 12, roomName: "528" },
  { id: 96, wardId: 12, roomName: "529" },
  { id: 97, wardId: 12, roomName: "530" },
  { id: 98, wardId: 12, roomName: "531" },
]