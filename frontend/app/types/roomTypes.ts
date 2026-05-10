
export type Room={
  roomId: number
  hospitalId: string
  wardId: number
  roomName: string
  patientName?: string

  //patientName?: string
}
export type RoomDB={
  id: number
  hospital_id: string
  ward_id: number
  name: string
  patient_name?: string
  created_at?: string
  updated_at?: string
}
