import { Injectable } from '@angular/core';
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
        this._logger.Debug("Adding file mannualy..");
        if (this.platform.is('cordova')) {
            FileChooser.open().then(uri => {
                console.log(uri);
                FilePath.resolveNativePath(uri)
                    .then(filePath => {
                        console.log(filePath);
                        var path = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                        var fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
                        var newFileName = Date.now() + ".mp4";

                        this.storagefactory.CopyFile(path, fileName, this.rootDirectory + "SportsPIP/Video", newFileName)
                            .then(success => {
                                console.log('Successfully copied video');
                                cmdArgs.editor.CreateVideoView(newFileName,cmdArgs.editor.selectedViewIndex,"Local");
                                if (Connection.connectedServer != null)
                                    this.backGroundTransferProcess.TransferVideo(fileName, cmdArgs.editor.Connection.connectedServer.Address, cmdArgs.editor.views);

                            })
                            .catch(err => {
                                console.log('Failed copying video:' + JSON.stringify(err))
                                this.chooseVideoErrorMsg('Failed copying video:' + JSON.stringify(err));
                            });

                    })
                    .catch(err => {
                        console.log(err);
                        this.chooseVideoErrorMsg('Failed Resolving nativepath:' + JSON.stringify(err));
                    });

            }).catch(err => {
                console.log(err);
                this.chooseVideoErrorMsg('Error opening file chooser:' + JSON.stringify(err));
            });
        }
    }

    chooseVideoErrorMsg(err) {
        this._logger.Error("Error in chooseVideo", err);
        this.alertCtrls.BasicAlert('Failed saving video!', err);

    }
}