import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

/*$Candidate for refactoring$*/
@Injectable()
export class HttpService {
    constructor(private http: Http) {

    }

    GetFileFromServer(path) {
        return this.http.get(path)
            .map(res => res.json())
            .map(success => {
                return success;
            }).toPromise();
    }

}