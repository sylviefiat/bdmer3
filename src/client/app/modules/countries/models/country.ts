export interface Country {
	_id: string;
  _rev?: string;
	code: string;
	name: string;
	_attachments?: any;
	users: User[];
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

export interface Flagimg {
	_id: string;
	_attachments: {
		flag: {
        type: string;
        data: object;
      }
	};
}
