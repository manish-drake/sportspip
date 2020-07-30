import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  apiURL: any = 'http://localhost:1339'  ;//'http://3.22.235.152:1337'//
  apiURLPlyr: any = 'http://localhost:1339';
  apiURLCoch: any = 'http://localhost:1340';
  constructor(private httpClient: HttpClient) {
    let token = localStorage.getItem("mid_token");
    if (token == null) {
      //this.login("admin@mail.com", "sportspip");
    }
  }

  getApiUrl(): any {
    return this.apiURL;
  }
  getPlayerApiUrl(): any {
    return this.apiURLPlyr;
  }
  getCoachApiUrl(): any {
    return this.apiURLCoch;
  }
  getHttpOptions() {
    let token = localStorage.getItem("mid_token");
    return {
      headers: {
        // Authorization: `Bearer ${token}`
      }
    }
  }

  login(email: any, password: any) {
    this.httpClient.post(`${this.apiURL}/admin/auth/local`,
      {
        identifier: email,
        password: password
      })
      .subscribe((res) => {
        localStorage.setItem("mid_token", res['jwt']);
        window.location.reload();
      },
        (error) => {
          console.log("Login error: ", error);
        });
  }

  public getItems(apiName: any, apiUrl: any = this.apiURL) {
    return this.httpClient.get(`${apiUrl}/${apiName}`, this.getHttpOptions());
  }
  public getItemById(apiName: any, id: any,apiUrl: any = this.apiURL) {
    return this.httpClient.get(`${apiUrl}/${apiName}/${id}`, this.getHttpOptions());
  }
  public addItem(apiName: any, item: any, apiUrl: any = this.apiURL) {
    return this.httpClient.post(`${apiUrl}/${apiName}`, item, this.getHttpOptions());
  }
  public updateItem(apiName: any, item: any, apiUrl: any = this.apiURL) {
    //console.log(item);
    //console.log(this.apiURL + "/" + apiName + "/" + item.id);
    return this.httpClient.put(`${apiUrl}/${apiName}/${item.id}`, item, this.getHttpOptions());
  }
  public deleteItem(apiName: any, id: any, apiUrl: any = this.apiURL) {
    return this.httpClient.delete(`${apiUrl}/${apiName}/${id}`, this.getHttpOptions());
  }

}