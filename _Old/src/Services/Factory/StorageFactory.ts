import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { File, IWriteOptions } from '@ionic-native/file';
import { Logger } from '../../logging/logger';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';


@Injectable()
export class StorageFactory {


    constructor(
        private platform: Platform,
        private _logger: Logger,
        private file: File) {
    }

    CheckFile(dirpath, fileName): Observable<any> {
        return Observable.fromPromise(this.file.checkFile(dirpath, fileName))
            .map(x => x);
    }

    CheckFolder(dirpath, dirName): Observable<any> {
        return Observable.fromPromise(this.file.checkDir(dirpath, dirName))
            .map(x => x);
    }

    createFolder(path: string, dirName: string): Observable<string> {
        return Observable.fromPromise(this.file.createDir(path, dirName, true))
            .map(value => value["nativeURL"]);
    }


    CreateFile(path, fileName): Observable<string> {
        return Observable.fromPromise(this.file.createFile(path, fileName, true))
            .map(x => x["nativeURL"]);
    }

    writeOptions: IWriteOptions = { replace: true }

    WriteFile(path, fileName, content): Observable<string> {
        return Observable.fromPromise(this.file.writeFile(path, fileName, content, this.writeOptions))
            .map(x => x["nativeURL"]);
    }

    CopyFile(filePath, fileName, newFilePath, newFileName): Observable<any> {
        return Observable.fromPromise(this.file.copyFile(filePath, fileName, newFilePath, newFileName))
            .map(x => x)
    }

    MoveFile(filePath, fileName, newFilePath, newFileName): Observable<string> {
        return Observable.fromPromise(this.file.moveFile(filePath, fileName, newFilePath, newFileName))
            .map(x => x["nativeURL"]);
    }

    RemoveFile(path, fileName): Promise<any> {
        return this.file.removeFile(path, fileName);
    }

    RemoveFolder(path, dirName): Observable<any> {
        return Observable.fromPromise(this.file.removeDir(path, dirName))
            .map(x => x.success);
    }

    RemoveFileAsync(path, dirName): Observable<boolean> {
        return Observable.fromPromise(this.file.removeRecursively(path, dirName))
            .map(x => x.success);
    }

    GetLisOfDirectory(path, DirName) {
        return this.file.listDir(path, DirName).then((success) => {
            return success;
        })
    }

    ReadFileAync(path, dirName): Observable<any> {
        this._logger.Debug("reading local file async.. ")
        return Observable.fromPromise(this.file.readAsText(path, dirName))
            .map(x => x.toString());
    }

    ReadFileDataAync(path, dirName): Observable<any> {
        this._logger.Debug("reading local file  data async.. ")
        return Observable.fromPromise(this.file.readAsDataURL(path, dirName))
            .map(x => x.toString());
    }

    ReadFileBufferAync(path, dirName): Observable<any> {
        this._logger.Debug("reading local file  data async.. ")
        return Observable.fromPromise(this.file.readAsArrayBuffer(path, dirName))
            .map(x => x);
    }

    ResolveLocalFileAsync(path): Observable<any> {
        this._logger.Debug("resolving local file async.. ")
        return Observable.fromPromise(this.file.resolveLocalFilesystemUrl (path))
            .map(x => x);
    }

    GetFile(path, fileName): Observable<any> {
        this._logger.Debug("get file.. ")
        return Observable.fromPromise(this.file.getFile(path, fileName, {}))
            .map(x => x);
    }
}