// Define enums and types
export enum UserRole {
  ADMIN = "admin",
  EDITOR = "editor",
}

export interface User {
  id?: string;
  username?: string;
  fullname?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  status: boolean;
  token?: string;
}
export const mediaTypeEnum = ["image", "video", "document", "audio"] as const;
export type MediaType = (typeof mediaTypeEnum)[number];
