import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Parser } from 'xml2js';

import { DiagnosticDataSoap } from '../models/diagnostic-data-soap.model';
import { RegistrationPlateStatus } from '../models/registration-plate-status.model';
import { environment } from '../../environments/environment';
import { httpHeaders, soapRequestBody } from './diagnostic-endpoint.config';

@Injectable({
  providedIn: 'root',
})
export class DiagnosticEndpointService {
  endpointUrl: string = environment.diagnosticEndpointUrl;

  xmlParser = new Parser(/* options */);

  constructor(private http: HttpClient) {}

  get$(): Observable<RegistrationPlateStatus[]> {
    // return of(this.getMockResponse())
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

  private getMockResponse(): string {
    return `
      <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
        <s:Body>
          <GetValidationStatsResponse xmlns="http://tempuri.org/">
            <GetValidationStatsResult xmlns:a="http://schemas.datacontract.org/2004/07/Hackaton.ALRP.WCF.Models" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
                <a:Records>
                  [
                    ${this.getMockStatus()},
                    ${this.getMockStatus()}
                  ]
                </a:Records>
              </GetValidationStatsResult>
          </GetValidationStatsResponse>
        </s:Body>
      </s:Envelope>
    `;
  }

  private getMockStatus(): string {
    return `{
      "timeStamp": "2020-01-24T16:33Z",
      "tollStatus": "${ Math.random() > 0.5 ? 'Valid' : Math.random() > 0.5 ? 'Invalid' : 'Excluded' }",
      "registrationPlate": "${Math.round(Math.random() * 1000000)}"
    }`;
  }
}
