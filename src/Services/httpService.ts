import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

/*$Candidate for refactoring$*/
@Injectable()
export class HttpService {
    constructor(private http: Http) {}

    GetFileFromServer(path: string) {
        return this.http.get(path)
            .map(res => res.json())
            .map(success => {
                return success;
            }).toPromise();
    }

    GetCamFromServer(path: string) {
        return this.http.get(path)
            .map(res => res.text())
            .map(data => {
                return data;
            }).toPromise();
    }

    PostFileToServer(path: string, body, option) {
        return this.http.post(path, body, option)
            .map((res) => {
                return res;
            }).toPromise();
    }

}