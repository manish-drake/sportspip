import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/Rx';
export declare class Factory {
    private http;
    private platform;
    constructor(http: Http, platform: Platform);
    SaveRoamingHeader(content: any, channel: any, sport: any, matrixName: any): void;
    SaveServerHeader(content: any, channel: any, sport: any, matrixName: any, typeFolder: any): void;
    SaveLocalHeader(content: any, channel: any, sport: any, matrixName: any, typeFolder: any): void;
    DeleteServerHeader(DirName: any): void;
}
