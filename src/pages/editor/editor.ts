import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController, ViewController } from 'ionic-angular';

/*
  Generated class for the Editor page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-editor',
  templateUrl: 'editor.html'
})
export class EditorPage {

  public firstParam: any;
  views: any;

  title: any;

  constructor(public navCtrl: NavController, params: NavParams,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController) {
    this.firstParam = params.get("firstPassed");
    
    this.views = [{ type: 'blank' }]
  }

  selectedViewIndex: any;
  selectedView: any;

  ifViewOptions: boolean;
  ifViewCanvas: boolean;
  ifViewVideo: boolean;

  ionViewDidLoad() {
    console.log('Hello Editor Page');
    this.showSegment(0);
  }

  presentInfoModal() {
    let modal = this.modalCtrl.create(InfoModalPage);
    modal.present();
  }

  showSegment(viewindex) {
    if (viewindex != this.selectedViewIndex) {
      this.selectedViewIndex = viewindex;
    }
    this.selectedView = this.views[viewindex];
    this.evaluateView();
  }

  hideSegment(a, b) {
    if (a != b)
      return true;
  }

  evaluateView() {
    if (this.selectedView.type == 'blank') {
      this.ifViewOptions = true;
    }
    else {
      this.ifViewOptions = false;
    }
    if (this.selectedView.type == 'canvas') {
      this.ifViewCanvas = true;
    }
    else {
      this.ifViewCanvas = false;
    }
    if (this.selectedView.type == 'video') {
      this.ifViewVideo = true;
    }
    else {
      this.ifViewVideo = false;
    }
  }

  addView(typeparam) {
    if (this.views.length <= 7) {
      this.views.push({ type: 'blank' });
      this.showSegment(this.selectedViewIndex + 1);
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'Maximum 8 views!',
        subTitle: 'No more views could be added.',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  // Define View using view options
  defineView(typeparam) {
    switch (typeparam) {
      case 'canvas':
        this.views[this.selectedViewIndex] = { type: typeparam };
        this.showSegment(this.selectedViewIndex);
        break;
      case 'video':
        this.views[this.selectedViewIndex] = { type: typeparam };
        this.showSegment(this.selectedViewIndex);
        this.addLocalVideo();
        break;
      case 'camera':
        this.views[this.selectedViewIndex] = { type: 'video' };
        this.showSegment(this.selectedViewIndex);
        this.addLocalVideo();
        break;
    }
  }

  addLocalVideo() {
    let alert = this.alertCtrl.create({
      title: 'Under Progress!',
      subTitle: 'You cannot add local video.',
      buttons: ['OK']
    });
    alert.present();
  }

  cameraCapture() {
    let alert = this.alertCtrl.create({
      title: 'Under Progress!',
      subTitle: 'You cannot record video.',
      buttons: ['OK']
    });
    alert.present();
  }

  importFromLibrary() {
    let alert = this.alertCtrl.create({
      title: 'Unavailable!',
      subTitle: 'View library not available currently.',
      buttons: ['OK']
    });
    alert.present();
  }

  deleteView(index) {
    if (this.views.length > 1) {
      let confirm = this.alertCtrl.create({
        title: 'Are you sure?',
        message: 'Do you want to delete the view pressed?',
        buttons: [
          {
            text: 'Cancel',
            handler: () => { }
          },
          {
            text: 'Delete',
            handler: () => {
              this.views.splice(index, 1);
              if (this.selectedViewIndex == 0) {
                this.showSegment(index)
              }
              else {
                this.showSegment(index - 1)
              }
            }
          }
        ]
      });
      confirm.present();
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'Can not be deleted!',
        subTitle: 'Atleast 1 view is required.',
        buttons: ['OK']
      });
      alert.present();
    }
  }
}

@Component({
  template: `
    <ion-header>
  <ion-toolbar>
    <ion-title>
      Matrix Info.
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()"><ion-icon name="close"></ion-icon></button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-list>
      <ion-item>
        <ion-avatar item-left>
          <img src="assets/sample.jpg">
        </ion-avatar>
        <h2>Matrix</h2>
        <p>Info</p>
      </ion-item>

      <ion-item>Title<ion-note item-right>{{Matrix.Title}}</ion-note></ion-item>
      <ion-item>Sport<ion-note item-right>{{Matrix.Sport}}</ion-note></ion-item>
      <ion-item>Skill<ion-note item-right>{{Matrix.Skill}}</ion-note></ion-item>
      <ion-item>Location<ion-note item-right>{{Matrix.Location}}</ion-note></ion-item>
      <ion-item>PIN<ion-note item-right>{{Matrix.PIN}}</ion-note></ion-item>
      <ion-item>Views<ion-note item-right>{{Matrix.View}}</ion-note></ion-item>
      <ion-item>Date Created<ion-note item-right>{{Matrix.DateCreated}}</ion-note></ion-item>
  </ion-list>
</ion-content>
  `
})
export class InfoModalPage {
  constructor(private viewCtrl: ViewController) {
  }

  dismiss() {
    this.viewCtrl.dismiss();

  }
}

