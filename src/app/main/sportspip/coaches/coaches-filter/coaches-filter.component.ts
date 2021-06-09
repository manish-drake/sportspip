<<<<<<< HEAD
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { CoachesService } from '../coaches.service';
=======
import { Component, OnInit } from '@angular/core';
>>>>>>> d8a3d7043a986104be2afc65f022a98b20c96c71

@Component({
  selector: 'app-coaches-filter',
  templateUrl: './coaches-filter.component.html',
<<<<<<< HEAD
  styleUrls: ['./coaches-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CoachesFilterComponent implements OnInit {

   // Public
   public coachesRef = [];
   public tempRef = [];
   public checkAll = true;

  constructor(private _coreSidebarService: CoreSidebarService,private _coachesService: CoachesService) { }

  /**
   * If all checkbox are checked : returns TRUE
   */
   allChecked() {
    return this.coachesRef.every(v => v.checked === true);
  }
   /**
   * Checkbox Change
   *
   * @param event
   * @param id
   */
    checkboxChange(event, id) {
      const index = this.coachesRef.findIndex(r => {
        if (r.id === id) {
          return id;
        }
      });
      this.coachesRef[index].checked = event.target.checked;
      this._coachesService.coachesUpdate(this.coachesRef);
      this.checkAll = this.allChecked();
    }

     /**
   * Toggle All Checkbox
   *
   * @param event
   */
  toggleCheckboxAll(event) {
    this.checkAll = event.target.checked;
    if (this.checkAll) {
      this.coachesRef.map(res => {
        res.checked = true;
      });
    } else {
      this.coachesRef.map(res => {
        res.checked = false;
      });
    }
    this._coachesService.coachesUpdate(this.coachesRef);
  }

 /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to Calendar changes
    this._coachesService.onCoachesChange.subscribe(res => {
      this.coachesRef = res;
    });
  }
=======
  styleUrls: ['./coaches-filter.component.scss']
})
export class CoachesFilterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

>>>>>>> d8a3d7043a986104be2afc65f022a98b20c96c71
}
