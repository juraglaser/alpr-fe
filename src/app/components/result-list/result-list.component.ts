import { Component } from '@angular/core';
import { timer } from 'rxjs';
import { map, scan, switchMap } from 'rxjs/operators';

import { DiagnosticEndpointService } from '@app/services/diagnostic-endpoint.service';
import { RegistrationPlateStatus } from '@app/models/registration-plate-status.model';
import { environment } from '@env/environment';

@Component({
  selector: 'alpr-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss']
})
export class ResultListComponent {
  pollingInterval = environment.dataRefreshInterval || 1000;
  maxResults = environment.maxResultsDisplayed || 100;

  registrationPlatesStatusList$ = timer(0, this.pollingInterval)
    .pipe(
      switchMap(() => this.diagnosticEndpoint.get$()),
      map((results: RegistrationPlateStatus[]) => results.map(item => ({
        ...item,
        tollStatusLabel: this.getTollStatusLabel(item.tollStatus),
      }))),
      scan((accumulator: RegistrationPlateStatus[], values: RegistrationPlateStatus[]) =>
          values.reverse().concat(accumulator), []),
      map((results: RegistrationPlateStatus[]) => results.slice(0, this.maxResults)),
    );

  constructor(
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
