import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';

import { MatrixInfoPage } from '../editor/matrixinfo/matrixinfo'


@Component({
  selector: 'page-editor',
  templateUrl: 'editor.html',
})

export class EditorPage {

  selectedViewIndex: number = 0;

  matrix: any;
  views: any;

  constructor(public navCtrl: NavController, params: NavParams,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController) {
    this.matrix = params.get("matrixData");
    this.views = this.matrix["Matrix.Children"]["View"];

    this.showViewSegment(this.selectedViewIndex);
  }

  ionViewDidLoad() {
    console.log('Hello Editor Page');
  }

  presentInfoModal() {
    let modal = this.modalCtrl.create(MatrixInfoPage, {
      matrixData: this.matrix
    });
    modal.present();
  }

  showViewSegment(viewindex: number) {
    if (viewindex != this.selectedViewIndex) {
      this.selectedViewIndex = viewindex;
    }
  }

  hideViewSegment(a, b) {
    if (a != b)
      return true;
  }

  addView() {
    if (this.views.length <= 7) {
      var inum: number = this.views.length + 1;
      this.views.push({
        "name": "View " + inum,
        "Title": "View " + inum,
        "Source": "(Blank)"
      });
      this.showViewSegment(inum - 1);
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
                this.showViewSegment(0);
              }
              else {
                this.showViewSegment(index - 1)
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

  //Code for ViewOptions start
  addBlankCanvas() {
    var canvasView = {
      "name": "View " + this.selectedViewIndex,
      "Title": "View " + this.selectedViewIndex,
      "Source": 'Canvas'
    }
    this.views[this.selectedViewIndex] = canvasView;
  }

  addVideo(i) {
    var localView = {
      "Content": {
        "Capture": {
          "Marker": {
            "Marker.Objects": "",
            "name": "c379224ff2704c5ea5ad1f10275a28c1"
          },
          "View.ChronoMarker": "",
          "name": "ba160173f284474c9412192dcd77cb1c",
          "Kernel": "sample.mp4",
          "Title": "View " + this.selectedViewIndex,
          "Name": "ba160173f284474c9412192dcd77cb1c",
          "IsActive": "False"
        }
      },
      "name": "View " + this.selectedViewIndex,
      "Title": "View " + this.selectedViewIndex,
      "Source": "Local"
    }
    this.views[this.selectedViewIndex] = localView;
  }

  recordVideo() {
    let alert = this.alertCtrl.create({
      title: 'Under Progress!',
      subTitle: 'You cannot record video.',
      buttons: ['OK']
    });
    alert.present();
  }

  import() {
    let alert = this.alertCtrl.create({
      title: 'Unavailable!',
      subTitle: 'View library not available currently.',
      buttons: ['OK']
    });
    alert.present();
  }
  //Code for ViewOptions end
}
