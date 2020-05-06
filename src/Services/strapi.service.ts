import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@Injectable()
export class StrapiService {

  apiURL: string = 'http://3.22.235.152:1337'

  constructor(private httpClient: Http,
    private transfer: FileTransfer) {
    let token = localStorage.getItem("tid_token");
    if (token == null) {
      this.login("admin@mail.com", "sportspip");
    }
  }

  getApiUrl(): string {
    return this.apiURL;
  }

  getHttpOptions() {
    // let token = localStorage.getItem("tid_token");

    var headers = new Headers;
    // headers.set('Authorization', `Bearer ${token}`)
    return { headers: headers };

    // return {
    //   headers: {
    //     Authorization: `Bearer ${token}`
    //   }
    // }
  }

  login(email: string, password: string) {
    this.httpClient.post(`${this.apiURL}/admin/auth/local`,
      {
        identifier: email,
        password: password
      })
      .subscribe((res) => {
        localStorage.setItem("tid_token", res['jwt']);
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

  public deleteItem(apiName: string, id: string) {
    return this.httpClient.delete(`${this.apiURL}/${apiName}/${id}`, this.getHttpOptions());
  }

  // public uploadFile(formData: FormData){
  //   return this.httpClient.post(`${this.apiURL}/upload`,formData, this.getHttpOptions());
  // }

  public uploadFile(path: any, fileName: any, params: any) {
    let options: FileUploadOptions = {
      fileKey: 'files',
      fileName: fileName,
      params: params,
      headers: this.getHttpOptions()
    }
    const fileTransfer: FileTransferObject = this.transfer.create();
    let lpercent = 0;
    fileTransfer.onProgress((progress) => {
      var percent: any = Number(progress.loaded / progress.total * 100);
      percent = Math.round(percent);
      if ((percent % 10) === 0 && percent !== lpercent) {
        lpercent = percent;
        console.log("Upload Progress: " + percent + "%");
      }
    })
    return fileTransfer.upload(path + fileName, `${this.apiURL}/upload`, options, true)
  }
}