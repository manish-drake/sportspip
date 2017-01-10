import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { File, WriteOptions } from 'ionic-native';
import { Logger } from '../../logging/logger';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';


@Injectable()
export class StorageFactory {


    constructor( private platform: Platform,private _logger: Logger) {
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

    CopyFile(filePath, fileName, newFilePath, newFileName): Promise<any> {
        return File.copyFile(filePath, fileName, newFilePath, newFileName);
    }

    MoveFile(filePath, fileName, newFilePath, newFileName): Observable<string> {
        return Observable.fromPromise(File.moveFile(filePath, fileName, newFilePath, newFileName))
            .map(x => x["nativeUrl"]);
    }

    RemoveFile(path, fileName): Promise<any> {
        return File.removeFile(path, fileName);
    }

    RemoveFileAsync(path, dirName): Observable<boolean> {
        return Observable.fromPromise(File.removeRecursively(path, dirName))
            .map(x => x.success);
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