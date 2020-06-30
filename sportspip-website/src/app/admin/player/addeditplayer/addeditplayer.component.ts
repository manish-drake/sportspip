import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../service/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-addeditplayer',
  templateUrl: './addeditplayer.component.html',
  styleUrls: ['./addeditplayer.component.css']
})
export class AddeditplayerComponent implements OnInit {

  loadingData: Boolean = false;
  apiURL: string = '';
  playerId: string = '';
  player: any = {};
  sports: any = [];
  levels: any = [];
  years: any = [];
  programs: any = [];
  selectedProgram: string = '';
  selectedYear: any = [];
  selectedGame: string = '';
  selectedLevel: string = '';
  updateItem: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService, private _snackBar: MatSnackBar) {
    this.route.params.subscribe(params => {
      // console.log(params.id);
      if (params.id !== undefined) {
        this.playerId = params.id;
        if (this.playerId.trim() === "0" || this.playerId.trim() === "") {
          this.updateItem = false;
        }
      }
      else {
        this.updateItem = false;
      }
    });
  }

  ngOnInit(): void {
    this.apiURL = this.apiService.getApiUrl();
    if (this.updateItem) {
      this.FetchItem();
    }
    this.FetchCategory("sports");
    this.FetchCategory("levels");
    this.FetchCategory("years");
    this.FetchCategory("programs");
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  FetchItem(): void {
    this.loadingData = true;
    this.apiService.getItemById('players', this.playerId)
      .subscribe(
        (data) => {
          this.loadingData = false;
          this.player = data;
          //console.log(this.player);
          this.MapPlayerToCategories();
          // this.years = this.player.years.map(e => e.Name).join(", ");
        },
        (error) => {
          console.log("Error; get player data: ", error);
          this.loadingData = false;
        }
      );
  }

  FetchCategory(apiName: string): void {
    this.apiService.getItems(apiName)
      .subscribe(
        (data) => {
          if (apiName === "sports") {
            this.sports = data;
          }
          if (apiName === "levels") {
            this.levels = data;
          }
          if (apiName === "programs") {
            this.programs = data;
          }
          if (apiName === "years") {
            this.years = data;
          }
        },
        (error) => {
          console.log("Error; get sports data: ", error);
        }
      );
  }

  MapCategoriesToPlayer(): void {
    this.player.sport = this.sports.find(x => x.id === this.selectedGame);
    this.player.level = this.levels.find(x => x.id === this.selectedLevel);
    this.player.program = this.programs.find(x => x.id === this.selectedProgram);
    this.player.years = this.selectedYear;
  }

  MapPlayerToCategories(): void { 
    this.selectedGame = this.player.sport !== undefined ? this.player.sport.id : '';
    this.selectedLevel = this.player.level !== undefined ? this.player.level.id : '';
    this.selectedProgram = this.player.program !== undefined ? this.player.program.id : '';
    this.selectedYear = this.player.years.map(e => e.id);
  }

  UpdateItem(): void {
    this.loadingData = true;
    this.MapCategoriesToPlayer();
    console.log(this.player);
    this.apiService.updateItem('players', this.player)
      .subscribe(
        (data) => {
          this.loadingData = false;
          this.openSnackBar("Item updated successfully!", "");
          //console.log(data);
          this.player = data;
          this.MapPlayerToCategories();
        },
        (error) => {
          console.log("Error; update player data: ", error);
          this.loadingData = false;
        }
      );
  }

  AddItem(): void {
    this.loadingData = true;
    this.MapCategoriesToPlayer();
    this.apiService.addItem('players', this.player)
      .subscribe(
        (data) => {
          this.loadingData = false;
          this.player = data;
          this.openSnackBar("Item added successfully!", "");
          this.router.navigate(['/admin/player', this.player.id]);
        },
        (error) => {
          console.log("Error; add player data: ", error);
          this.loadingData = false;
        }
      );
  }

  uploadFile(e) {
    //console.log(e.target.files);
    const uploadFile = new FormData();
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      uploadFile.append('files', file);
      this.apiService.addItem('upload/', uploadFile)
        .subscribe(
          (data) => {
            this.player.ProfileImage = data[0];
          },
          (error) => {
            console.log("Error; upload file data: ", error);
          }
        );
    }
  }
}
