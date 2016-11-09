import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';


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
    constructor(private platform: Platform) {

    }

    SaveUserAsync() {

    }
}