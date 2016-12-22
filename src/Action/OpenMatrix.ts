import { Injectable } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { EditorPage } from '../pages/editor/editor';
import { Http } from '@angular/http';
import { File } from 'ionic-native';
import { StorageFactory } from '../Factory/StorageFactory';
declare var cordova: any;
@Injectable()
export class OpenMatrix {

    constructor(private http: Http, private navCtrl: NavController, private platform: Platform, private storagefactory: StorageFactory) {
    }

    run(matrixName, Channel) {
        File.readAsText(cordova.file.dataDirectory + "Local/" + Channel + "/Tennis/Matrices/" + matrixName, matrixName + ".mtx")
            .then(data => {
                console.log("open matrix");
                var res = JSON.parse(data.toString());
                var view = res.Matrix["Matrix.Children"].View;
                if (view != undefined) {
                    this.navCtrl.push(EditorPage, {
                        matrixData: res.Matrix
                    });
                }
            }).catch(err => {
                console.log("mtx not found");
                this.createNewMatrix(matrixName, Channel);
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