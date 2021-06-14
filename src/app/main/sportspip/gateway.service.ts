import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GatewayService {

  constructor() { }
  private _serverUri: string = "http://192.168.10.50";

  serverUri(relativeUri: string = ""): string {
    return this._serverUri + relativeUri;
  }

  flaskUri(relativeUri: string) {
    return `http://192.168.10.50:5002${relativeUri}`;
  }

  strapiUri(relativeUri: string): string {
    return this.serverUri(`:1337${relativeUri}`);
  }
}
