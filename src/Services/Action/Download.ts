import { Injectable } from '@angular/core';
import { Logger } from '../../logging/logger';
import { Core } from '../../Services/core';
import { Observable } from 'rxjs/Rx';
import { Package } from '../../Services/Package';

/*$Candidate for refactoring$*/
@Injectable()
export class Download {
    constructor(
        private core: Core,
        private _logger: Logger,
        private packages: Package) {

    }

    DownloadServerHeaderAsync(fileName, channelName): Promise<any> {
        return new Promise((resolve, reject) => {
            this._logger.Debug("Authenticatnig user..");
            return this.AuthenticateUser(channelName, 125).then((res) => {
                if (res) {
                    this._logger.Debug("downloading matrix from server..");
                    return this.packages.DownloadServerHeader(fileName, channelName).then((serverHeader) => {
                        this._logger.Debug("unzip file in folder..");
                        return this.packages.unzipPackage().then((res) => {
                            this._logger.Debug("moving file in local..");
                            return this.packages.MoveToLocalCollection(channelName).add((res) => {
                                this._logger.Debug("loading downloading matrix from local..");
                                return this.core.RemoveMatrixFile("file:/storage/emulated/0/DCIM", "Temp").subscribe((res) => {
                                    return resolve(res);
                                });
                            });
                        });
                    }).catch(err => { return reject(err) });
                }
            });
        })
    }

    AuthenticateUser(channel, userId) {
        console.log("Authenticatnig user..");
        return this.packages.AuthenticateUser(channel, userId).then((res) => {
            return res;
        });
    }
}