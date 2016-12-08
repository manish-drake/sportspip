import { Injectable } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { EditorPage } from '../pages/editor/editor';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { StorageFactory } from '../Factory/StorageFactory';
declare var cordova: any;
@Injectable()
export class OpenMatrix {

    constructor(private http: Http, private navCtrl: NavController, private platform: Platform, private storagefactory: StorageFactory) {
    }

    run(matrixName, Channel) {
        this.http.get(cordova.file.dataDirectory + "Local/" + Channel + "/Tennis/Matrices/" + matrixName + "/" + matrixName + ".mtx")
            .catch(err => new Observable(observer => {
                console.log("mtx not found");
                this.createNewMatrix(matrixName, Channel);
            }))
            .subscribe(data => {
                console.log("open matrix");
                var res = JSON.parse(data.text());
                var view = res.Matrix["Matrix.Children"].View[0];
                if ((view != undefined) && (view._Source == "IP")) {
                    alert("You Can not open IPCams Matrix");
                }
                else {
                    this.navCtrl.push(EditorPage, {
                        matrixData: res.Matrix
                    });

                }
            });
    }

    createNewMatrix(matrixName, Channel) {
        var data = this.storagefactory.ComposeNewMatrix();
        var result = data.Matrix;
        result._name = matrixName;
        result._Name = matrixName;
        result._Channel = Channel;
        this.storagefactory.SaveMatrixAsync(data, result._Channel, result._Sport, result._Name, "Matrices");

        var headerContent = this.storagefactory.ComposeMatrixHeader(result);
        this.storagefactory.SaveLocalHeader(headerContent, headerContent.Channel, headerContent.Sport, headerContent.Name, "Matrices")

        this.navCtrl.push(EditorPage, {
            matrixData: result
        });
    }
}