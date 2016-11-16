import { Injectable } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { EditorPage } from '../pages/editor/editor';
import { Http } from '@angular/http';
declare var cordova: any;
@Injectable()
export class OpenMatrix {

    constructor(private http: Http, private navCtrl: NavController, private platform: Platform) {
    }

    run(matrixName, Channel) {
        this.platform.ready().then(() => {
            this.http.get(cordova.file.dataDirectory + "Local/" + Channel + "/Tennis/Matrices/" + matrixName + "/" + matrixName + ".mtx")
                .subscribe(data => {
                    console.log("open matrix");
                    var res = JSON.parse(data.text());
                    this.navCtrl.push(EditorPage, {
                        matrixData: res.Matrix
                    });
                });
        });
    }
}