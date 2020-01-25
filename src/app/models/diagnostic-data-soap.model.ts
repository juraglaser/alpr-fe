export interface DiagnosticDataSoap {
  's:Envelope': {
    's:Body': {
      'GetValidationStatsResponse': {
        'GetValidationStatsResult': {
          'a:Records': string;
        }[]
      }[]
    }[]
  };
}
