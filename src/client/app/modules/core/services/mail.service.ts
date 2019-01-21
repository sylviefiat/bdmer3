import { Injectable } from '@angular/core';

import { User } from '../../countries/models/country';


@Injectable()
export class MailService {

    constructor() { }

    sendPasswordMail(user: User): boolean {
        return true;
    }
}
