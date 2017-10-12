export interface ResponsePDB {
    ok?: boolean;
    error?: string;
    id: string;
    rows?: any;
    _rev: string;
}

export interface UserPDB {
    "_id": string,
    "name": string,
    "type": string,
    "roles": string[],
    "password": string
}