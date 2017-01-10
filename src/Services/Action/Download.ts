import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ICommand } from '../../Contracts/ICommand';
import { Logger } from '../../logging/logger';
import { AlertControllers } from '../../Services/Alerts';
import { LoadingController } from 'ionic-angular';
import { Core } from '../../Services/core';
import { Observable } from 'rxjs/Rx';
import { Package } from '../../Services/Package';

/*$Candidate for refactoring$*/
@Injectable()
export class Download implements ICommand {
    constructor(private alertCtrls: AlertControllers,
        private core: Core,
        private platform: Platform,
        private _logger: Logger,
        private packages: Package,
        private loadingCtrl: LoadingController) {

    }

    run(cmdArgs) {
        this._logger.Debug('Channel matrix clicked..');
        this.alertCtrls.ConfirmationAlert(" Download Confirmation?", null, "Download").then((res) => {
            if (res.toString() == "Download")
                this.DownloadServerHeaderAsync(cmdArgs.matrix.Name, cmdArgs.matrix.Channel, cmdArgs.index, cmdArgs.channelCollection);
        })
    }

    DownloadServerHeaderAsync(fileName, channelName, index, model) {/*$Candidate for refactoring$*///This function really needs SOME refactoring..also, can go to actions
        this._logger.Debug('Download server header async..');
        let loader = this.loadingCtrl.create({
            content: 'Downloading..',
            duration: 300000
        });
        loader.present();
        var authenticate = this.AuthenticateUser();
        if (authenticate) {
            this.packages.DownloadServerHeader(fileName, channelName).then((serverHeader) => {
                Observable.interval(2000)/*$Candidate for refactoring$*///BAD!!
                    .take(3).map((x) => x + 5)
                    .subscribe((x) => {
                        this.packages.unzipPackage();
                    })
                Observable.interval(4000)/*$Candidate for refactoring$*///BAD!!
                    .take(1).map((x) => x + 5)
                    .subscribe((x) => {
                        this.packages.MoveToLocalCollection(channelName);
                    })
                Observable.interval(6000)/*$Candidate for refactoring$*///BAD!!
                    .take(1).map((x) => x + 5)
                    .subscribe((x) => {
                        this.core.ReadMatrixFile("file:/storage/emulated/0/DCIM", "Temp").then(() => {
                            model.DeleteChannelMatrix(fileName, channelName, index);
                            console.log("delete server header");
                            loader.dismiss();
                        });
                    })
            }).then((err) => {
                this._logger.Error('Error,downloading server header async: ', err);
            })

        }
    }

    AuthenticateUser() {
        console.log("Authenticatnig user..");
        return true;/*$Candidate for refactoring$*///WOW! We'll have to write the code some day!
    }
}