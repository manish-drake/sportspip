import { Injectable} from '@angular/core';
import { StorageFactory } from '../Factory/StorageFactory';

@Injectable()
export class DeleteHeader {
localMatrices = [];
channels = [];
    constructor(private storagefactory: StorageFactory) {

    }
    DeleteLocalHeader(DirName, index, channel) {
    this.storagefactory.DeleteLocalHeader(DirName, channel);  
  }
   //Deleted Server Header
  DeleteServerHeader(DirName, index, value, channel) {
    this.storagefactory.DeleteServerHeader(DirName, channel);
  }
}