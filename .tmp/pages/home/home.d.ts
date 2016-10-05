import { NavController, ActionSheetController, AlertController, PopoverController, ViewController } from 'ionic-angular';
export declare class HomePage {
    navCtrl: NavController;
    private popoverCtrl;
    private actionSheetCtrl;
    private alertCtrl;
    selectedSegment: any;
    localMatrices: any;
    channels: any;
    constructor(navCtrl: NavController, popoverCtrl: PopoverController, actionSheetCtrl: ActionSheetController, alertCtrl: AlertController);
    presentPopover(myEvent: any): void;
    openSettings(): void;
    newMatrix(): void;
    openMatrix(title: any): void;
    matrixPressed(index: any, title: any): void;
    openCollection(): void;
    openChannelCollection(title: any): void;
    channelMatrixPressed(index: any, title: any): void;
}
export declare class PopoverPage {
    viewCtrl: ViewController;
    private alertCtrl;
    versionNumber: any;
    constructor(viewCtrl: ViewController, alertCtrl: AlertController);
    onAbout(): void;
}
