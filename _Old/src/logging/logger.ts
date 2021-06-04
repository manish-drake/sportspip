import { Injectable } from '@angular/core'
import { AProvider } from './aProvider'

@Injectable()
export class Logger {

    private _Level: number;
    public get Level(): number {
        return this._Level;
    }

    constructor(private _provider: AProvider) {
        this._Level = 5;
    }

    Debug(message: string, exception: any = null) {
        this.write(message, 0, exception);
    }
    Info(message: string, exception: any = null) {
        this.write(message, 1, exception);
    }
    Warn(message: string, exception: any = null) {
        this.write(message, 2, exception);
    }
    Error(message: string, exception: any = null) {
        this.write(message, 3, exception);
    }
    Fatal(message: string, exception: any = null) {
        this.write(message, 4, exception);
    }

    private write(message: string, level: number = 0, exception: any = null) {
        // console.log("writing log..");
        if (this.Level >= level) {
            var log = this.createLog(message, exception);
            this._provider.write(log)
        }
        // console.log("written log..");
    }
    private createLog(message: string, exception: any): string {
        var log = "";
        if (message)
            log = message;
        if (exception)
            log = (message ? message : "") + JSON.stringify(exception);
        return log;
    }
}