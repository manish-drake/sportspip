import { Injectable } from "@angular/core";


export interface IUser {
    FirstName: string;
    LastName: string;
    Email: string;
    Password: string;
}

@Injectable()
export class user implements IUser {
    FirstName: string;
    LastName: string;
    Email: string;
    Password: string;
    constructor() {

    }

    SaveUserAsync(file) {
        // var data = <user[]>file.json();
    }
}