import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, EMPTY, timer } from 'rxjs';
import { catchError, map, scan, switchMap, tap } from 'rxjs/operators';

import { DiagnosticEndpointService } from '../../services/diagnostic-endpoint.service';
import { RegistrationPlateStatus } from '../../models/registration-plate-status.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'alpr-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss']
})
export class ResultListComponent {
  pollingInterval = environment.dataRefreshInterval || 1000;
  maxResults = environment.maxResultsDisplayed || 100;

  registrationPlatesStatusList$ = this.activatedRoute.queryParamMap
    .pipe(
      switchMap(paramMap => {
        const interval = Number.parseInt(paramMap.get('refresh'), 10);
        return timer(0, interval * 1000 || this.pollingInterval);
      }),
      tap(() => this.isLoadingData$.next(true)),
      switchMap(() => this.diagnosticEndpoint.get$()),
      map((results: RegistrationPlateStatus[]) => results.map(item => ({
        ...item,
        tollStatusLabel: this.getTollStatusLabel(item.tollStatus),
      }))),
      // tap(results => console.log('New results (parsed):', results)),
      scan((accumulator: RegistrationPlateStatus[], values: RegistrationPlateStatus[]) =>
          values.reverse().concat(accumulator), []),
      map((results: RegistrationPlateStatus[]) => results.slice(0, this.maxResults)),
      tap(() => this.isLoadingData$.next(false)),
      catchError(() => {
        this.isLoadingData$.next(false);
        return EMPTY;
      })
    );

  isLoadingData$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private activatedRoute: ActivatedRoute,
    private diagnosticEndpoint: DiagnosticEndpointService,
  ) {}

  getRowClass(rowData: RegistrationPlateStatus) {
    return {
      'status-valid': rowData.tollStatus === 'Valid',
      'status-invalid': rowData.tollStatus === 'Invalid',
      'status-excluded': rowData.tollStatus === 'Excluded',
    };
  }

  private getTollStatusLabel(status: string) {
    switch (status) {
      case 'Valid':
        return 'zaplaceno';
      case 'Invalid':
        return 'nezaplaceno';
      default:
        return 'neznámý';
    }
  }
}
