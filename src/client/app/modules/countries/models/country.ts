export interface Country {
	_id: string;
	code: string;
	name: string;
	flag: Flagimg;
	users: User[];
}

export interface User {
  _id: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  countryCode: string;
  password:string;
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
