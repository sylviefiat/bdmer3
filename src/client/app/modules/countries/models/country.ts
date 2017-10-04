export interface Country {
	_id: string;
	code: string;
	name: string;
	flag: Flagimg;
	users: User[];
}

export interface User {
  _id: string;
  nom: string;
  prenom: string;
  username: string;
  email: string;
  countryCode: string;
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
