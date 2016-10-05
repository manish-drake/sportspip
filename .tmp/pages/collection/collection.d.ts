import { NavController, ActionSheetController } from 'ionic-angular';
export declare class CollectionPage {
    navCtrl: NavController;
    private actionSheetCtrl;
    localMatrices: any;
    constructor(navCtrl: NavController, actionSheetCtrl: ActionSheetController);
    ionViewDidLoad(): void;
    openMatrix(title: any): void;
    matrixPressed(index: any, title: any): void;
}
