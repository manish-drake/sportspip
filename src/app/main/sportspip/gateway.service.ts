import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GatewayService {

  constructor() { }
  private _serverUri: string = "http://115.246.85.186";

  serverUri(relativeUri: string = ""): string {
    return this._serverUri + relativeUri;
  }

  flaskUri(relativeUri: string) {
    return `http://115.246.85.186/:1337${relativeUri}`;
  }

  strapiUri(relativeUri: string): string {
    return this.serverUri(`:1337${relativeUri}`);
  }
}
