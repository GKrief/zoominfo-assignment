import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FooterComponent } from './core/footer/footer.component';
import { GameScreenComponent } from './game/game-screen/game-screen.component';
import { HeaderComponent } from './core/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AlphanumericDirective } from './core/directives/alphanumeric.directive';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { OptionCardComponent } from './game/option-card/option-card.component';
import { StepperComponent } from './game/stepper/stepper.component';
import { ReplaceCodesToQuotesPipe } from './core/pipes/replace-codes-to-quotes.pipe';
import * as fromGameData from './core/store/game-data/reducers/game-data.reducer';
import * as fromLeaderboard from './core/store/leaderboard/reducers/leaderboard.reducer';
import {environment} from '../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LeaderboardTableComponent } from './leaderboard/leaderboard-table/leaderboard-table.component';
import { AlertBarComponent } from './game/alert-bar/alert-bar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    MainScreenComponent,
    FooterComponent,
    GameScreenComponent,
    HeaderComponent,
    AlphanumericDirective,
    OptionCardComponent,
    ReplaceCodesToQuotesPipe,
    StepperComponent,
    LeaderboardTableComponent,
    AlertBarComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    MDBBootstrapModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forRoot({gameData: fromGameData.reducer, leaderboard: fromLeaderboard.reducer}),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
