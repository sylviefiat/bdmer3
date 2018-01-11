export interface Authenticate {
  username: string;
  password: string;
  roles?: string[];
}


export interface AuthInfo {
  access_token?: Authenticate,
  expires?: number,
  expires_in?: number
}