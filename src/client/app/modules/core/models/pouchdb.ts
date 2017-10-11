export interface ResponsePDB {
    ok: boolean;
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