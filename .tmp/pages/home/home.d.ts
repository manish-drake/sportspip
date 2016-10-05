import { Factory } from '../../Factory/Factory';
import { Http } from '@angular/http';
import { NavController, ActionSheetController, AlertController, PopoverController, ViewController, Platform } from 'ionic-angular';
export declare class HomePage {
    private http;
    private platform;
    navCtrl: NavController;
    private factory;
    private popoverCtrl;
    private actionSheetCtrl;
    private alertCtrl;
    selectedSegment: any;
    localMatrices: any;
    channels: any[];
    Header: any[];
    items: any[];
    constructor(http: Http, platform: Platform, navCtrl: NavController, factory: Factory, popoverCtrl: PopoverController, actionSheetCtrl: ActionSheetController, alertCtrl: AlertController);
    GetserverHeader(): void;
    SerializeServerData(headerData: any): void;
    SaveDownloadedHeaders(HeaderList: any, Data: any): void;
    DisplayHeader(): void;
    DeleteServerHeader(DirName: any, index: any): void;
    presentPopover(myEvent: any): void;
    openSettings(): void;
    newMatrix(): void;
    openMatrix(title: any): void;
    openCollection(): void;
    openChannelCollection(title: any): void;
    downloadMatrix(): void;
}
export declare class PopoverPage {
    viewCtrl: ViewController;
    private alertCtrl;
    versionNumber: any;
    constructor(viewCtrl: ViewController, alertCtrl: AlertController);
    onAbout(): void;
}
