import { Injectable } from '@angular/core';
import { ICommand } from '../../../Contracts/ICommand';
import { CaptureVideoOptions, MediaFile, CaptureError, MediaCapture } from '@ionic-native/media-capture';

import { Logger } from '../../../logging/logger';
import { Alert } from '../../../Services/common/alerts';
import { BackGroundTransferProcess } from '../../../Services/BackGroundTransferProcess';
import { StorageFactory } from '../../../Services/Factory/StorageFactory';
import { Platform } from 'ionic-angular';
import { Connection } from '../../../Services/Connection';
import { Storage } from '../../../Services/Factory/Storage';


@Injectable()
export class AddPhoneCapture implements ICommand {

    rootDirectory: string;
    constructor(
        private mediaCapture: MediaCapture,
        private alertCtrls: Alert,
        private _logger: Logger,
        private backGroundTransferProcess: BackGroundTransferProcess,
        private platform: Platform,
        private storage: Storage,
        private storagefactory: StorageFactory) {
        this.storage.externalRootDirectory().then((res) => {
            this.rootDirectory = res;
        })



    }
    run(cmdArgs) {
        let options: CaptureVideoOptions = {};
        this.mediaCapture.captureVideo(options)
            .then(
            (data: MediaFile[]) => { this.captureSuccess(data, cmdArgs) },
            (err: CaptureError) => { this.captureError(err) }
            );
    }

    captureSuccess(MediaFiles, Model) {
        MediaFiles.forEach(mediaFile => {
            var fileUrl = mediaFile.localURL;

            var filePath = fileUrl.substr(0, fileUrl.lastIndexOf('/') + 1);
            var fileName = fileUrl.substr(fileUrl.lastIndexOf('/') + 1);
            var ext = fileName.substr(-4);
            var newFileName = Date.now() + ext;

            this.storagefactory.MoveFile(filePath, fileName, this.rootDirectory + "SportsPIP/Video", newFileName)
                .subscribe(success => {
                    Model.editor.CreateVideoView(newFileName, Model.editor.selectedViewIndex, "Phone");
                    console.log('Successfully saved video')
                    if (Connection.connectedServer != null)
                        this.backGroundTransferProcess.TransferVideo(newFileName, Connection.connectedServer.Address, Model.editor.views);
                })
        });
    }

    captureError(err) {
        if (err.code == "3") {
            console.log("Reording: " + err.message + ", Code:" + err.code)
            this._logger.Error("Reording: ", err.message)
            this._logger.Error("Code:", err.code)
        }
        else {
            this._logger.Error('Recording Failed!', err.code + ", " + err.message);
            this.alertCtrls.BasicAlert('Recording Failed!', err.code + ", " + err.message);
        }
    }
}