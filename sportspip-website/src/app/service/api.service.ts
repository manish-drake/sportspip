import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  apiURL: any = 'http://3.22.235.152:1337'//'http://localhost:1339'

  constructor(private httpClient: HttpClient) {
    let token = localStorage.getItem("mid_token");
    if (token == null) {
      this.login("admin@mail.com", "sportspip");
    }
  }

  getApiUrl(): any {
    return this.apiURL;
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

  public getItems(apiName: any) {
    return this.httpClient.get(`${this.apiURL}/${apiName}`, this.getHttpOptions());
  }
  public getItemById(apiName: any, id: any) {
    return this.httpClient.get(`${this.apiURL}/${apiName}/${id}`, this.getHttpOptions());
  }
  public addItem(apiName: any, item: any) {
    return this.httpClient.post(`${this.apiURL}/${apiName}`, item, this.getHttpOptions());
  }
  public updateItem(apiName: any, item: any) {
    return this.httpClient.put(`${this.apiURL}/${apiName}/${item.id}`, item, this.getHttpOptions());
  }
  public deleteItem(apiName: any, id: any) {
    return this.httpClient.delete(`${this.apiURL}/${apiName}/${id}`, this.getHttpOptions());
  }
  
}