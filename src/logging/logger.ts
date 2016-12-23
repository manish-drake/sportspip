import { Injectable } from '@angular/core'

@Injectable()
export class Logger {
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

    }
}