export interface UserInfo {
  id: number;
  token: string; // accessToken
  name: string; // nickname
  role: Role;
}

export type Role = "mentor" | "mentee" | null;
