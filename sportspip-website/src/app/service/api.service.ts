import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  apiURL: string = 'http://localhost:1337'

  constructor(private httpClient: HttpClient) {
    let token = localStorage.getItem("mid_token");
    if (token == null) {
      this.login("admin@mail.com", "sportspip");
    }
  }

  getApiUrl(): string {
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

  login(email: string, password: string) {
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

  public getItems(apiName: string) {
    return this.httpClient.get(`${this.apiURL}/${apiName}`, this.getHttpOptions());
  }
  public getItemById(apiName: string, id: any) {
    return this.httpClient.get(`${this.apiURL}/${apiName}/${id}`, this.getHttpOptions());
  }
  public addItem(apiName: string, item) {
    return this.httpClient.post(`${this.apiURL}/${apiName}`, item, this.getHttpOptions());
  }
  public updateItem(apiName: string, item) {
    return this.httpClient.put(`${this.apiURL}/${apiName}/${item.id}`, item, this.getHttpOptions());
  }
  public deleteItem(apiName: string, id: number) {
    return this.httpClient.delete(`${this.apiURL}/${apiName}/${id}`, this.getHttpOptions());
  }
  
}