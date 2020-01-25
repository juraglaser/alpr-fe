import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Parser } from 'xml2js';

import { DiagnosticDataSoap } from '@app/models/diagnostic-data-soap.model';
import { RegistrationPlateStatus } from '@app/models/registration-plate-status.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class DiagnosticEndpointService {
  endpointUrl: string = environment.diagnosticEndpointUrl;
  xmlParser = new Parser(/* options */);

  constructor(private http: HttpClient) {}

  get$(): Observable<RegistrationPlateStatus[]> {
    // return this.http.get(this.endpointUrl, {responseType: 'text'})
    return of(this.getMockResponse())
      .pipe(
        switchMap((result: string) => from(
            this.xmlParser.parseStringPromise(result)
          ) as Observable<DiagnosticDataSoap>,
        ),
        tap(result => console.log('Parsed SOAP response:', result)),
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
      "tollStatus": "${ Math.random() > 0.5 ? 'Valid' : 'Invalid' }",
      "registrationPlate": "${Math.round(Math.random() * 1000000)}"
    }`;
  }
}
