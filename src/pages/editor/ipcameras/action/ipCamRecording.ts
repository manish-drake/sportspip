import { Injectable } from '@angular/core';
import { ICommand } from '../../../../Contracts/ICommand';
import { Connection } from '../../../../Services/Connection';
import { Logger } from '../../../../logging/logger';
import { HttpService } from '../../../../Services/httpService';
import { AlertControllers } from '../../../../Services/Alerts';


@Injectable()
export class IPCamRecording implements ICommand {
    constructor(private _logger: Logger, private httpService: HttpService, private alertCtrls: AlertControllers) {

    }

    run(cmdArgs) {
        cmdArgs.ipCam.isRecording = true;
        if (cmdArgs.ipCam.isTimerOn) {
            var time = Number(cmdArgs.ipCam.timerDelay);
            cmdArgs.ipCam.loader.present();
            cmdArgs.ipCam.loader.setContent('Wait ' + time.toString() + 's');

            var interval = setInterval(() => {
                time--;
                cmdArgs.ipCam.loader.setContent('Wait ' + time.toString() + 's');
                if (time <= 0) {
                    clearInterval(interval);
                    this.record(cmdArgs);
                }
            }, 1000)
        }
        else {
            this.record(cmdArgs);
        }
    }

    record(cmdArgs) {
        cmdArgs.ipCam.loader.present();
        cmdArgs.ipCam.loader.setContent('Starting Recording..');
        var connectedServerIP = Connection.connectedServer.Data.Location;
        var fileName = Date.now();
        var uri: string = "http://" + connectedServerIP + ":10080/icamera/cams/ip/" + fileName + "/rec?duration=" + cmdArgs.ipCam.recordingDuration;
        this._logger.Debug('Recording request uri: ' + uri);
        this.httpService.PostFileToServer(uri, null,null)/*$Candidate for refactoring$*///delegate http tasks to a seaparate service
            .then(res => {
                this._logger.Debug("Recording for IP Cams on network: " + JSON.stringify(res));
                var time: number = 0;
                var interval = setInterval(() => {
                    time++;
                    cmdArgs.ipCam.loader.setContent('Recording ' + time.toString() + 's');
                    if (time >= cmdArgs.ipCam.recordingDuration) {
                        clearInterval(interval);
                        cmdArgs.ipCam.TransferMatrix(fileName, connectedServerIP);
                        cmdArgs.ipCam.createViews(fileName);
                    }
                }, 1000);
            })
            .catch(err => {
                cmdArgs.ipCam.loader.dismiss();
                cmdArgs.ipCam.isRecording = false;
                this._logger.Error("Error,Recording IPCam Videos", err);
                this.alertCtrls.BasicAlert('Error,Recording IPCam Videos', err);
            });
    }

}
