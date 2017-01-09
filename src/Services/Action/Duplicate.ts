import { Injectable } from '@angular/core';
import { Storage } from '../Factory/Storage';
import { Core } from '../core';
import { Platform } from 'ionic-angular';

/*$Candidate for refactoring$*/
@Injectable()
export class Duplicate {
    storageDataDir: string;

    constructor(private core: Core, private storage: Storage, private platform: Platform) {
        this.platform.ready().then(() => {
            this.storageDataDir = this.storage.externalDataDirectory();
        })
    }


    Run(channelName, matrixname) {
        var name = (new Date()).toISOString().replace(/[^0-9]/g, "").slice(0, 14);
        return this.core.ReadMatrixFile(this.storageDataDir + "Local/" + channelName + "/Tennis/Matrices/" + matrixname, "Header.xml").then((res) => {
            var header = JSON.parse(res.toString());
            header.Name = name;
            header.DateCreated = name;
            return this.core.SaveLocalHeader(header, channelName, header.Sport, name, "Matrices").then(() => {
                return this.core.ReadMatrixFile(this.storageDataDir + "Local/" + channelName + "/Tennis/Matrices/" + matrixname, matrixname + ".mtx").then((res1) => {
                    var matrix = JSON.parse(res1.toString());
                    matrix.Matrix._Name = name;
                    matrix.Matrix._DateCreated = name;
                    return this.core.SaveMatrixAsync(matrix, channelName, matrix.Matrix._Sport, name, "Matrices");
                })
            });

        })
    }
}