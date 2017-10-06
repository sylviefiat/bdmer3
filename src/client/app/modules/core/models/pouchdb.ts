export interface ResponsePDB {
    ok: boolean;
    id: string;
    _rev: string;
}

export interface UserPDB {
    "_id": string,
    "name": string,
    "type": string,
    "roles": string[],
    "password": string
}