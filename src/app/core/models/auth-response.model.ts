import { User } from "./user.model";

export interface LoginResponse {
    exists: boolean;
    user?: User;
    token?: string;
  }
  
  export interface RegisterResponse {
    user: User;
    token: string;
  }
  