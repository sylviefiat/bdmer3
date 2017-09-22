export interface Country {
	_id: string;
	id: string;
	countryInfo: {
		name: string;
		flag: Image;		
	};
	users: User[];
}

export interface User {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  country: string;
}

export interface Image {
	_id: string;
	id: string;
	_attachments: {
		filename: {
        type: string;
        data: object;
      }
	};
}