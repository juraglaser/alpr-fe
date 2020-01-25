import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AppComponent } from './app.component';
import { ResultListComponent } from './components/result-list/result-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ResultListComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxDatatableModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
