import { Injectable } from '@angular/core';
import { Core } from '../core';

/*$Candidate for refactoring$*/
@Injectable()
export class DeleteHeader {
  localMatrices = [];
  channels = [];
  constructor(private core: Core) {

  }
  DeleteLocalHeader(DirName, channel) {
    this.core.DeleteLocalHeader(DirName, channel);
  }
  //Deleted Server Header
  DeleteServerHeader(DirName, channel) {
    this.core.DeleteServerHeader(DirName, channel);
  }
}