import { TestBed } from '@angular/core/testing';

import { DiagnosticEndpointService } from './diagnostic-endpoint.service';

describe('DiagnosticEndpointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiagnosticEndpointService = TestBed.get(DiagnosticEndpointService);
    expect(service).toBeTruthy();
  });
});
