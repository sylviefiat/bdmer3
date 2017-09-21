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
  firstname: string;
  lastname: string;
  email: string;
  countryId: string;
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