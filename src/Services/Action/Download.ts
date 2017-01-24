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

    DownloadServerHeaderAsync(fileName, channelName, path): Promise<any> {
        return new Promise((resolve, reject) => {
            this._logger.Debug("Authenticatnig user..");
            return this.core.ReadMatrixFile(path + "Roaming", "User.json").subscribe((res) => {
                var result = JSON.parse(res.toString());
                return this.AuthenticateUser(channelName, result.UserId).then((res) => {
                    if (res) {
                        this._logger.Debug("downloading matrix from server..");
                        return this.packages.DownloadServerHeader(fileName, channelName).then((serverHeader) => {
                            this._logger.Debug("unzip file in folder..");
                            return this.packages.unzipPackage().then((res) => {
                                this._logger.Debug("moving file in local..");
                                return this.packages.MoveToLocalCollection(channelName).subscribe((res) => {
                                    return resolve(res);
                                    // this.core.RemoveMatrixFile(this.dataDirectory, "Temp").subscribe((res) => {
                                    //     return resolve(res);
                                    // });
                                });
                            });
                        }).catch(err => { return reject(err) });
                    }
                });
            })

        })
    }

    AuthenticateUser(channel, userId) {
        console.log("Authenticatnig user..");
        return this.packages.AuthenticateUser(channel, userId).then((res) => {
            return res;
        });
    }
}