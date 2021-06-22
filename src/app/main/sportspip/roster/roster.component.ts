import { Component, OnInit, ViewEncapsulation , 
  ViewChild,
  EventEmitter,
  Output,
  Input} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Character, Interpretation, IRoster } from '../interfaces';
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

  //-------ROSTER EDIT--------------------//

  @Input() selectedInterpretation: Interpretation;
  @Input() editState: boolean;
  @Output() quoteInterpretation: EventEmitter<
    Interpretation
  > = new EventEmitter();
  @Output() editQuoteInterpretation: EventEmitter<
    Interpretation
  > = new EventEmitter();
  @ViewChild('quoteForm') form: any;
  characterQuote: Character = {
    firstName: '',
    lastName: '',
    favQuote: '',
    interpretation: ''
  };

  displayForm: boolean = false;
  

  rosterId = 0;
 
  //-------ROSTER EDIT--------------------//

  constructor(private activatedRoute: ActivatedRoute,private _roster:RosterService) { }

 

  ngOnInit(): void {


    

    this._roster.getRoster().subscribe(data=> this.roster = data);

    
    
  }
  //-------ROSTER EDIT--------------------//

  submitQuote({ value, valid }: { value: Character; valid: boolean }) {
    if (!valid) {
      console.log('Not valid');
    } else {
      // console.log('Valid');
      this.form.reset();
    }
  }
  addQuote(firstName, lastName, quote, interpretation) {
    if (!firstName || !lastName || !quote || !interpretation) {
      alert('Please enter all fields.');
    } else {
      let thePost: Interpretation = {
        firstName,
        lastName,
        quote,
        interpretation
      };
      this.quoteInterpretation.emit(thePost);
    }
  }
  updateQuote(firstName, lastName, quote, interpretation) {
    let thePost: Interpretation = {
      firstName,
      lastName,
      quote,
      interpretation
    };
    // console.log('updated');
    this.editState = false;
    this.editQuoteInterpretation.emit(thePost);
    this.form.reset();
  }
  //-------ROSTER EDIT--------------------//
  
  

  ConfirmColorOpen() {
    console.log("ranjan"+ this.rosterId)
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



}
