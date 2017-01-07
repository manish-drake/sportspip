import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StorageFactory } from '../Factory/StorageFactory';
import { Observable } from 'rxjs/Rx';
import { Logger } from '../../logging/logger';
import { Package } from '../../Services/Package';

/*$Candidate for refactoring$*/
@Injectable()
export class Download {
    constructor(private packages: Package, private platform: Platform, private storagefactory: StorageFactory, private _logger: Logger) {

    }
    
}