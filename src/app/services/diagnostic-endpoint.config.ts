export const httpHeaders = {
  'Content-Type': 'text/xml;charset=UTF-8',
  SOAPAction: 'http://tempuri.org/MereniQuestSoap/GetValidationStats',
};

export const soapRequestBody = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
    <soapenv:Header/>
    <soapenv:Body>
        <tem:GetValidationStats/>
    </soapenv:Body>
  </soapenv:Envelope>
`;
