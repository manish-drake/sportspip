import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Logger } from '../../logging/logger';
import { LoadingController } from 'ionic-angular';
import { Core } from '../../Services/core';
import { Observable } from 'rxjs/Rx';
import { Package } from '../../Services/Package';

/*$Candidate for refactoring$*/
@Injectable()
export class Download {
    constructor(
        private core: Core,
        private platform: Platform,
        private _logger: Logger,
        private packages: Package,
        private loadingCtrl: LoadingController) {

    }

    DownloadServerHeaderAsync(fileName, channelName):Promise<any> {
        var authenticate = this.AuthenticateUser();
        if (authenticate) {
           return this.packages.DownloadServerHeader(fileName, channelName)
                .then((serverHeader) => {
                    Observable.interval(2000)/*$Candidate for refactoring$*///BAD!!
                        .take(2).map((x) => x + 5)
                        .subscribe((x) => {
                         return   this.packages.unzipPackage();
                        })
                    Observable.interval(4000)/*$Candidate for refactoring$*///BAD!!
                        .take(1).map((x) => x + 5)
                        .subscribe((x) => {
                           return this.packages.MoveToLocalCollection(channelName);
                        })
                    Observable.interval(6000)/*$Candidate for refactoring$*///BAD!!
                        .take(1).map((x) => x + 5)
                        .subscribe((x) => {
                           return this.core.ReadMatrixFile("file:/storage/emulated/0/DCIM", "Temp").subscribe((res) => {
                                return res;
                            });
                        })
                }).catch(err => { this._logger.Error('Error,downloading server header async: ', err) });
        }
    }

    AuthenticateUser() {
        console.log("Authenticatnig user..");
        return true;/*$Candidate for refactoring$*///WOW! We'll have to write the code some day!
    }
}