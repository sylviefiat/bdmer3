import { User, Country } from '../../countries/models/country';

export interface Authenticate {
  user: string;
  password: string;
  roles?: string[];
}

export interface AccessToken {
    user: User;
    country: Country;
}


export interface AuthInfo {
  access_token?: AccessToken,
  expires?: number,
  expires_in?: number
}