export interface Country {
	_id: string;
	code: string;
	name: string;
	flag: Image;
	users: User[];
}

export interface User {
  _id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  country: string;
}

export interface Image {
	_id: string;
	_attachments: {
		flag: {
        type: string;
        data: object;
      }
	};
}
