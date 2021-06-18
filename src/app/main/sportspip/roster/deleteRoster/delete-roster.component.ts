import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RosterService } from '../roster.service';

@Component({
  selector: 'app-delete-roster',
  templateUrl: './delete-roster.component.html',
  styleUrls: ['./delete-roster.component.scss']
})
export class DeleteRosterComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private _roster:RosterService) { }
 

  rosterId = 0;
  ngOnInit(): void {

    this.activatedRoute.params.subscribe(data => {
      this.rosterId = data.id; // Capture the ID which i want delete product
console.log(this.rosterId);
      this._roster.deleteRoster(this.rosterId).subscribe(deleteddata=>{
        console.log("Roster has been Deleted") //delete Data  selected id
      })
    });
  }


}
