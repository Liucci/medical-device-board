export type Ward = {
  wardID: number
  name: string
}

export const wards: Ward[] = [
  { wardID: 1, name: "ICU" },
  { wardID: 2, name: "3A病棟" },
  { wardID: 3, name: "3B病棟" },
  { wardID: 4, name: "4A病棟" },
]

export type Room={
  id: number
  wardId: number
  roomName: string
  patientName?: string

  //patientName?: string
}

export const rooms: Room[] = [
  { id: 1, wardId: 1, roomName: "ICU-1" },
  { id: 2, wardId: 1, roomName: "ICU-2" },
    { id: 3, wardId: 1, roomName: "ICU-3" },
    { id: 4, wardId: 2, roomName: "301" },
    { id: 5, wardId: 2, roomName: "302" },
    { id: 6, wardId: 2, roomName: "303" },
    { id: 7, wardId: 3, roomName: "311" },
    { id: 8, wardId: 3, roomName: "312" },
    { id: 9, wardId: 3, roomName: "313" },
    { id: 10, wardId: 4, roomName: "401" },
    { id: 11, wardId: 4, roomName: "402" },
    { id: 12, wardId: 4, roomName: "403" },
]