import { Injectable } from '@angular/core';
import { StorageFactory } from '../Factory/StorageFactory';
import { Core } from '../core';

/*$Candidate for refactoring$*/
@Injectable()
export class Duplicate {
    constructor(private storagefactory: StorageFactory,
    private core: Core) {
        
    }

    Run(channelName, matrixname) {
        var name = (new Date()).toISOString().replace(/[^0-9]/g, "").slice(0, 14);
        return this.storagefactory.ReadMatixFileAync("Local", channelName, matrixname, "Header.xml").then((res) => {
            var header = JSON.parse(res.toString());
            header.Name = name;
            header.DateCreated = name;
            return this.core.SaveLocalHeader(header, channelName, header.Sport, name, "Matrices").then(() => {
                return this.storagefactory.ReadMatixFileAync("Local", channelName, matrixname, matrixname + ".mtx").then((res1) => {
                    var matrix = JSON.parse(res1.toString());
                    matrix.Matrix._Name = name;
                    matrix.Matrix._DateCreated = name;
                    return this.core.SaveMatrixAsync(matrix, channelName, matrix.Matrix._Sport, name, "Matrices");
                })
            });

        })
    }
}