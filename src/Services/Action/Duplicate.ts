import { Injectable } from '@angular/core';
import { StorageFactory } from '../Factory/StorageFactory';

@Injectable()
export class Duplicate {
    constructor(private storagefactory: StorageFactory) {
    }

    Run(channelName, matrixname) {
        var name = (new Date()).toISOString().replace(/[^0-9]/g, "").slice(0, 14);
        this.storagefactory.ReadFileAync("Local", channelName, matrixname, "Header.xml").then((res) => {
            var header = JSON.parse(res.toString());
            header.Name = name;
            header.DateCreated = name;
            this.storagefactory.SaveLocalHeader(header, channelName, header.Sport, name, "Matrices");
        })
        this.storagefactory.ReadFileAync("Local", channelName, matrixname, matrixname + ".mtx").then((res) => {
            var matrix = JSON.parse(res.toString());
            matrix.Matrix._Name = name;
            matrix.Matrix._DateCreated = name;
            this.storagefactory.SaveMatrixAsync(matrix, channelName, matrix.Matrix._Sport, name, "Matrices");
        })
    }
}