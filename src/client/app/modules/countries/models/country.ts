export interface Country {
	_id: string;
  _rev?: string;
	code: string;
	name: string;
	_attachments?: any;
	users: User[];
  flag: string;
  coordinates: Coordinates;
}

export interface Coordinates{
  lat: number;
  lng: number;
}

export interface User {
  _id: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  countryCode: string;
  password?:string;
  repassword?:string;
  role: string;
}
