import { Injectable } from '@angular/core';
import { Camera, CameraOptions, CameraPopoverOptions } from 'ionic-native';

import { ICommand } from '../../../Contracts/ICommand';
import { Logger } from '../../../logging/logger';
import { AlertControllers } from '../../../Services/Alerts';
import { BackGroundTransferProcess } from '../../../Services/BackGroundTransferProcess';
import { FileChooser, FilePath } from 'ionic-native';
import { StorageFactory } from '../../../Services/Factory/StorageFactory';
import { Platform } from 'ionic-angular';
import { Connection } from '../../../Services/Connection';
import { Storage } from '../../../Services/Factory/Storage';

@Injectable()
export class AddCapture implements ICommand {
    rootDirectory: string;
    constructor(private _logger: Logger,
        private alertCtrls: AlertControllers,
        private backGroundTransferProcess: BackGroundTransferProcess,
        private platform: Platform,
        private storage: Storage,
        private storagefactory: StorageFactory) {
        this.rootDirectory = this.storage.externalRootDirectory();
    }
    run(cmdArgs) {
        // if (this.platform.is('cordova')) {
        //     FileChooser.open().then(uri => {
        //         console.log(uri);
        //         FilePath.resolveNativePath(uri)
        //             .then(filePath => {
        //                 console.log(filePath);
        //                 var fileDir = filePath.substr(0, filePath.lastIndexOf('/') + 1);
        //                 console.log(fileDir);
        //                 var fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
        //                 console.log(fileName);
        //                 var newFileName = Date.now() + ".mp4";

        //                 this.storagefactory.CopyFile(fileDir, fileName, this.rootDirectory + "SportsPIP/Video", newFileName)
        //                     .then(success => {
        //                         console.log('Successfully copied video');
        //                         cmdArgs.editor.CreateVideoView(newFileName, cmdArgs.editor.selectedViewIndex, "Local");
        //                         if (Connection.connectedServer != null)
        //                             this.backGroundTransferProcess.TransferVideo(newFileName, cmdArgs.editor.Connection.connectedServer.Address, cmdArgs.editor.views);

        //                     })
        //                     .catch(err => {
        //                         this.chooseVideoErrorMsg('Failed copying video:' + JSON.stringify(err));
        //                     });

        //             })
        //             .catch(err => {
        //                 this.chooseVideoErrorMsg('Failed Resolving nativepath:' + JSON.stringify(err));
        //             });

        //     }).catch(err => {
        //         this.chooseVideoErrorMsg('Error opening file chooser:' + JSON.stringify(err));
        //     });
        // }

        this._logger.Debug("Going to add Video..");

        var _cameraPopoverOptions: CameraPopoverOptions = { x: 0, y: 0, height: 400, width: 200, arrowDir: 15 }

        var _cameraOptions: CameraOptions = { sourceType: Camera.PictureSourceType.PHOTOLIBRARY, mediaType: Camera.MediaType.VIDEO, popoverOptions: _cameraPopoverOptions }

        Camera.getPicture(_cameraOptions)
            .then((filePath => {
                this._logger.Debug("Got video: " + filePath);
                var fileDir = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                var fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
                var ext = fileName.substr(-4);
                var newFileName = Date.now() + ext;

                this.storagefactory.CopyFile(fileDir, fileName, this.rootDirectory + "SportsPIP/Video", newFileName)
                    .then(success => {
                        this._logger.Debug('Successfully copied video');
                        cmdArgs.editor.CreateVideoView(newFileName, cmdArgs.editor.selectedViewIndex, "Local");
                        if (Connection.connectedServer != null)
                            this.backGroundTransferProcess.TransferVideo(newFileName, cmdArgs.editor.Connection.connectedServer.Address, cmdArgs.editor.views);

                    })
                    .catch(err => {
                        this._logger.Error('Failed copying video', JSON.stringify(err));
                        this.alertCtrls.BasicAlert('Failed getting video', JSON.stringify(err));
                    });
            }))
            .catch(err => {
                this._logger.Debug("Cancelled or Failed getting video: " + JSON.stringify(err));
            })

    }

    // chooseVideoErrorMsg(err) {
    //     this._logger.Error(err);
    //     this.alertCtrls.BasicAlert('Failed saving video!', err);
    // }
}