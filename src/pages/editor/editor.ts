import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, FabContainer } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, params: NavParams,
    private alertCtrl: AlertController) {
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
      switch (typeparam) {
        case 'blank':
          this.views.push({ type: typeparam });
          this.showSegment(this.selectedViewIndex + 1);
          break;
        case 'canvas':
          this.views.push({ type: typeparam });
          this.showSegment(this.selectedViewIndex + 1);
          break;
        case 'video':
          this.views.push({ type: typeparam });
          this.showSegment(this.selectedViewIndex + 1);
          this.addLocalVideo();
          break;
        case 'camera':
          this.views.push({ type: 'video' });
          this.showSegment(this.selectedViewIndex + 1);
          this.cameraCapture();
          break;
        case 'library':
          this.importFromLibrary();
          break;
      }
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
