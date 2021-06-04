import { Injectable } from "@angular/core";
import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class NativeStorageFactory {

    constructor(private nativeStorage: NativeStorage) { }

    SetItem(reference, value): Promise<any> {
        return this.nativeStorage.setItem(reference, value);
    }

    GetItem(reference): Promise<any> {
        return this.nativeStorage.getItem(reference);
    }
}