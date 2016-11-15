import { Injectable} from '@angular/core';
import { StorageFactory } from '../Factory/StorageFactory';

@Injectable()
export class DeleteHeader {
localMatrices = [];
channels = [];
    constructor(private storagefactory: StorageFactory) {

    }
    DeleteLocalHeader(DirName, channel) {
    this.storagefactory.DeleteLocalHeader(DirName, channel);  
  }
   //Deleted Server Header
  DeleteServerHeader(DirName, channel) {
    this.storagefactory.DeleteServerHeader(DirName, channel);
  }
}