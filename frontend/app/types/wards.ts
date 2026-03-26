type Ward = {
  wardID: number
  name: string
}

export const wards: Ward[] = [
  { wardID: 1, name: "ICU" },
  { wardID: 2, name: "3A病棟" },
  { wardID: 3, name: "3B病棟" },
  { wardID: 4, name: "4A病棟" },
]

type Room={
  id: number
  wardId: number
  name: string
}

export const rooms: Room[] = [
  { id: 1, wardId: 1, name: "ICU-1" },
  { id: 2, wardId: 1, name: "ICU-2" },
    { id: 3, wardId: 1, name: "ICU-3" },
    { id: 4, wardId: 2, name: "301" },
    { id: 5, wardId: 2, name: "302" },
    { id: 6, wardId: 2, name: "303" },
    { id: 7, wardId: 3, name: "311" },
    { id: 8, wardId: 3, name: "312" },
    { id: 9, wardId: 3, name: "313" },
    { id: 10, wardId: 4, name: "401" },
    { id: 11, wardId: 4, name: "402" },
    { id: 12, wardId: 4, name: "403" },
]