import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { Storage } from './Storage';
import { File, WriteOptions } from 'ionic-native';
import { Logger } from '../../logging/logger';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';


@Injectable()
export class StorageFactory {

    private storageRoot: string;
    private storageDataDir: string;

    constructor(private storage: Storage,
        private platform: Platform,
        private _logger: Logger) {
        platform.ready().then(() => {
            this.storageDataDir = this.storage.externalDataDirectory();
            this.storageRoot = this.storage.externalRootDirectory();
        });
    }
    CheckFile(dirpath, fileName): Promise<any> {
        return File.checkFile(dirpath, fileName);
    }



    createFolder(path: string, dirName: string): Promise<any> {
        return File.createDir(path, dirName, true).then((success) => {
            return success
        });
    }


    CreateFile(path, fileName): Promise<any> {
        return File.createFile(path, fileName, true);
    }

    writeOptions: WriteOptions = { replace: true }

    WriteFile(path, fileName, content): Promise<any> {
        return File.writeFile(path, fileName, content, this.writeOptions);
    }

    CopyFile(oldPath, oldName, newPath, fileName): Promise<any> {
        return File.copyFile(oldPath, oldName, newPath, fileName);
    }

    MoveFile(oldPath, newPath, fileName): Observable<string> {
        return Observable.fromPromise(File.moveFile(oldPath, fileName, newPath, fileName))
            .map(x => x["nativeUrl"]);
    }

    RemoveFile(path, fileName): Promise<any> {
        return File.removeFile(path, fileName);
    }

    RemoveFileAsync(path, dirName): Observable<boolean> {
        return Observable.fromPromise(File.removeRecursively(path, dirName))
            .map(x => x.success);
    }

    ReadMatixFileAync(dirName, channelName, matrixname, fileName): Promise<any> {
        this._logger.Debug("reading local file async.. ")
        return File.readAsText(this.storageDataDir + dirName + "/" + channelName + "/Tennis/Matrices/" + matrixname, fileName);
    }

    GetLisOfDirectory(path, DirName) {
        return File.listDir(path, DirName).then((success) => {
            return success;
        })
    }

    ReadFileAync(path, dirName): Promise<any> {
        this._logger.Debug("reading local file async.. ")
        return File.readAsText(path, dirName);
    }


}