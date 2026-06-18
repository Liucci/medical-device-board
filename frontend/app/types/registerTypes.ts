export type RegisteredUserDB = {
  display_name:string
  email: string
  role:string
  hospital_name:string
}

export type RegisteredUser = {
  displayName:string
  email: string
  role:string
  hospitalName:string
}

export type RegisterUserRequest = {
  code:string
  password:string
  displayName:string
}

export type RegisterUserRequestDB = {
  code:string
  password:string
  display_name:string
}