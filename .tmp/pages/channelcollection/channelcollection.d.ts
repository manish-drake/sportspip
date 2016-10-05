import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
export declare class ChannelCollectionPage {
    navCtrl: NavController;
    private actionSheetCtrl;
    private alertCtrl;
    firstParam: any;
    channelMatrices: any;
    constructor(navCtrl: NavController, params: NavParams, actionSheetCtrl: ActionSheetController, alertCtrl: AlertController);
    channelMatrixPressed(index: any, title: any): void;
}
