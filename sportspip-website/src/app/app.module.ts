import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PipsComponent, FilterPipe, SortPipe } from './pips/pips.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CoachesComponent, FiltersportPipe, FilterlevelPipe, FilteryearPipe, FilterprogramPipe, SortCoachPipe } from './coaches/coaches.component';
import { CoachComponent } from './coach/coach.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PlayersComponent, FilterPlayerPipe, SortPlayerPipe } from './players/players.component';
import { PlayerComponent } from './player/player.component';
import { FiltersidebarComponent } from './filtersidebar/filtersidebar.component'; 
import { CoacheslistComponent, FilterCoachPipe } from './admin/coach/coacheslist/coacheslist.component';
import { UpdatecoachComponent } from './admin/coach/updatecoach/updatecoach.component';
import { PlayerslistComponent } from './admin/player/playerslist/playerslist.component';
import { AddeditplayerComponent } from './admin/player/addeditplayer/addeditplayer.component';
import { CategoriesComponent } from './admin/categories/categories.component';
import { OverlayComponent } from './overlay/overlay.component'
import { OverlayModule } from '@angular/cdk/overlay';
import { ScheduleComponent } from './schedule/schedule.component';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';

@NgModule({
  declarations: [
    AppComponent,
    PipsComponent,
    FilterPipe,
    SortPipe,
    CoachesComponent,
    FiltersportPipe,
    FilterlevelPipe,
    FilteryearPipe,
    FilterprogramPipe,
    SortCoachPipe,
    CoachComponent,
    HeaderComponent,
    FooterComponent,
    PlayersComponent,
    FilterPlayerPipe,
    SortPlayerPipe,
    PlayerComponent,
    FiltersidebarComponent, 
    CoacheslistComponent,
    FilterCoachPipe,
    UpdatecoachComponent,
    PlayerslistComponent,
    AddeditplayerComponent,
    CategoriesComponent,
    OverlayComponent,
    ScheduleComponent,
    ScheduleFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    OverlayModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [OverlayComponent]
})
export class AppModule { }
