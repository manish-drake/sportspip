import { NavController, NavParams, AlertController } from 'ionic-angular';
export declare class EditorPage {
    navCtrl: NavController;
    private alertCtrl;
    firstParam: any;
    views: any;
    constructor(navCtrl: NavController, params: NavParams, alertCtrl: AlertController);
    selectedViewIndex: any;
    selectedView: any;
    ifViewOptions: boolean;
    ifViewCanvas: boolean;
    ifViewVideo: boolean;
    ionViewDidLoad(): void;
    showSegment(viewindex: any): void;
    hideSegment(a: any, b: any): boolean;
    evaluateView(): void;
    addView(typeparam: any): void;
    defineView(typeparam: any): void;
    addLocalVideo(): void;
    cameraCapture(): void;
    importFromLibrary(): void;
    deleteView(index: any): void;
}
