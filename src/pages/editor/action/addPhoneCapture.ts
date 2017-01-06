import { Injectable, Inject } from '@angular/core';
import { ICommand } from '../../../Contracts/ICommand';
import { CaptureVideoOptions, MediaFile, CaptureError, FilePath, MediaCapture } from 'ionic-native';
import { Logger } from '../../../logging/logger';
import { AlertControllers } from '../../../Services/Alerts';
import { BackGroundTransferProcess } from '../../../Services/BackGroundTransferProcess';
import { StorageFactory } from '../../../Services/Factory/StorageFactory';
import { Platform } from 'ionic-angular';
import { Connection } from '../../../Services/Connection';
import { Storage } from '../../../Services/Factory/Storage';


@Injectable()
export class AddPhoneCapture implements ICommand {

    rootDirectory: string;
    constructor(private alertCtrls: AlertControllers,
        private _logger: Logger,
        private backGroundTransferProcess: BackGroundTransferProcess,
        private platform: Platform,
        private storage: Storage,
        private storagefactory: StorageFactory) {
        this.rootDirectory = this.storage.externalRootDirectory();

    }
    run(cmdArgs) {
        let options: CaptureVideoOptions = {};
        MediaCapture.captureVideo(options)
            .then(
            (data: MediaFile[]) => { this.captureSuccess(data,cmdArgs) },
            (err: CaptureError) => { this.captureError(err) }
            );
    }

    captureSuccess(MediaFiles, Model) {
        MediaFiles.forEach(mediaFile => {
            var fileUrl = mediaFile.localURL;

            var path = fileUrl.substr(0, fileUrl.lastIndexOf('/') + 1);
            var fileName = fileUrl.substr(fileUrl.lastIndexOf('/') + 1);

            this.storagefactory.MoveFile(path, this.rootDirectory + "SportsPIP/Video", fileName)
                .subscribe(success => {
                    Model.editor.CreateVideoView(fileName,Model.editor.selectedViewIndex,"Phone");
                    console.log('Successfully saved video')
                    if (Connection.connectedServer != null)
                        this.backGroundTransferProcess.TransferVideo(fileName, Connection.connectedServer.Address, Model.editor.views);
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