import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Parser } from 'xml2js';

import { DiagnosticDataSoap } from '@app/models/diagnostic-data-soap.model';
import { RegistrationPlateStatus } from '@app/models/registration-plate-status.model';
import { environment } from '@env/environment';
import { httpHeaders, soapRequestBody } from './diagnostic-endpoint.config';

@Injectable({
  providedIn: 'root',
})
export class DiagnosticEndpointService {
  endpointUrl: string = environment.diagnosticEndpointUrl;

  xmlParser = new Parser(/* options */);

  constructor(private http: HttpClient) {}

  get$(): Observable<RegistrationPlateStatus[]> {
    return this.http.post(this.endpointUrl, soapRequestBody, {
      headers: new HttpHeaders(httpHeaders),
      responseType: 'text',
    })
      .pipe(
        switchMap((result: string) => from(
            this.xmlParser.parseStringPromise(result)
          ) as Observable<DiagnosticDataSoap>,
        ),
        // tap(result => console.log('Parsed SOAP response:', result)),
        map((parsedData: DiagnosticDataSoap) =>
          parsedData
          ['s:Envelope']
          ['s:Body'][0]
          .GetValidationStatsResponse[0]
          .GetValidationStatsResult[0]
          ['a:Records'][0]
        ),
        map(jsonString => JSON.parse(jsonString) as RegistrationPlateStatus[]),
      );
  }
}
