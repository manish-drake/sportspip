import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Connectivity page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-connectivity',
  templateUrl: 'connectivity.html'
})
export class Connectivity {

  connectivity: boolean = true;

  connections = [
    { title: 'Lobby 1', status: 'Available', description: 'Sports PIP Server', connected: false, saved: false },
    { title: 'Lobby 2', status: 'Available', description: 'Sports PIP Server', connected: false, saved: false },
    { title: 'Restroom', status: 'Available', description: 'Sports PIP Server', connected: false, saved: false }
  ];

  constructor(public navCtrl: NavController) { }

  ionViewDidLoad() {
    console.log('Hello Connectivity Page');
  }

  connect(conn) {
    this.connections.forEach(connection => {
      if (conn == connection) {
        connection.connected = true;
        connection.status = 'Connected';
        connection.saved = true;
      }
      else {
        connection.connected = false;
        connection.status = 'Available';
      }
    });
  }

  disconnect(conn) {
    this.connections.forEach(connection => {
      if (conn == connection) {
        connection.connected = false;
        connection.status = 'Available';
      }
    });
  }

  forget(conn) {
    this.connections.forEach(connection => {
      if (conn == connection) {
        connection.connected = false;
        connection.status = 'Available';
        connection.saved = false;
      }
    });
  }

  getStatusColor(status){
    if(status == "Available"){
      return 'green';
    } 
    if(status == "Connected"){
      return '#387ef5';
    }
    if(status == "Unavailable"){
      return 'gray';
    } 
  }

}

