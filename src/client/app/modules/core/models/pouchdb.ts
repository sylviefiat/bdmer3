export interface ResponsePDB {
    id: string;
    ok?: boolean;
    error?: string;
    name?: string;
    rows?: any;
    roles?: any;
    info?: any;
    userCtx?: any;
    _rev: string;
}

export interface UserPDB {
    "_id": string,
    "name": string,
    "type": string,
    "roles": string[],
    "password": string
}