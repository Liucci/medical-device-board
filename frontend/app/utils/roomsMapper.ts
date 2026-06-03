import {
          Room,
          RoomDB
        } from "../types/roomTypes"

//DB情報をUI用に変換
export const normalizeRoom = (
                                r: RoomDB
                              ): Room => ({
                                            roomId: r.id,
                                            hospitalId: r.hospital_id,
                                            wardId: r.ward_id,
                                            roomName: r.name,
                                            patientName: r.patient_name ?? ""
                                          })

//UI情報をDB用に変換
export const toDBRoom = (
                          r: Room
                        ): RoomDB => ({
                                        id: r.roomId,
                                        hospital_id: r.hospitalId,
                                        ward_id: r.wardId,
                                        name: r.roomName,
                                        patient_name: r.patientName
                                      })

                                      
