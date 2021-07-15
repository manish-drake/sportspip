import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { IRoster } from '../interfaces';
import { RosterService } from './roster.service';


@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RosterComponent implements OnInit {

  roster:IRoster[];
  rosters: any;


  ConfirmColorOpen() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      }
    }).then(function (result) {
      if (result.value) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Your imaginary file is safe :)',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
      }
    });
  }
  


  constructor(private activatedRoute: ActivatedRoute,private _roster:RosterService) { }

 rosterId=0;

 deleteRoster(id): void {
  if (confirm("Are you sure you want to delete " + id + "?")){
     this._roster.delete(id).subscribe((res) => console.log(res));
  }

 }

  ngOnInit(): void {

    this._roster.getRoster().subscribe(data=> this.roster = data);
    this.activatedRoute.params.subscribe(data => {
      this.rosterId = data.id; // Capture the ID which i want delete product
      console.log(this.rosterId);
      
    });

    
    
  }
 
  

}
