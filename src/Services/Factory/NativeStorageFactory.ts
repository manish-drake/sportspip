import { Injectable } from "@angular/core";
import { NativeStorage } from 'ionic-native';

@Injectable()
export class NativeStorageFactory {

    constructor() { }

    SetItem(reference, value): Promise<any> {
        return NativeStorage.setItem(reference, value);
    }

    GetItem(reference): Promise<any> {
        return NativeStorage.getItem(reference);
    }
}