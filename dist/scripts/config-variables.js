// config-variables.js
export const LABELS = {
  ORDER: 'Order:',
  RULE_NAME: 'Rule Name:',
  DESCRIPTION: 'Description:',
  REQUEST_LIMIT: 'Request Limit:',
  TIME_PERIOD: 'Time Period (seconds):',
  HOSTNAME: 'Hostname:',
  PATH: 'Path (leave empty to match all paths):',
  FINGERPRINT_PARAMS: 'Fingerprint Parameters',
  REQUEST_MATCH: 'Request Matching:',
  CONDITION_FIELD: 'Field:',
  CONDITION_OPERATOR: 'Operator:',
  CONDITION_VALUE: 'Value:',
};
export const LOGICAL_OPERATORS = [
  { value: 'and', label: 'AND' },
  { value: 'or', label: 'OR' },
];

export const CONDITION_TYPES = [
  { value: 'single', label: 'Single Condition' },
  { value: 'group', label: 'Nested Group' },
];
export const MESSAGES = {
  CLIENT_IP_INCLUDED: 'Client IP is always included by default.',
  CONFIG_SAVED: 'Configuration saved successfully!',
  SAVE_ERROR: 'Error: ',
  LOAD_ERROR: 'Error loading configuration',
};

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
};

export const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
};

export const CONTENT_TYPES = {
  JSON: 'application/json',
  HTML: 'text/html',
};

export const STORAGE_KEYS = {
  CONFIG: 'config',
};

export const DEFAULTS = {
  EMPTY_CONFIG: '{"rules":[]}',
};

export const API_ENDPOINTS = {
  CONFIG: '/api/config',
};

export const ADD_RULE_BUTTON_TEXT = 'Add New Rule';

const COMMON_FIELDS = [
  { value: 'headers.user-agent', label: 'User Agent' },
  { value: 'headers.accept-language', label: 'Accept Language' },
  { value: 'headers.accept-encoding', label: 'Accept Encoding' },
  { value: 'headers.sec-fetch-dest', label: 'Sec-Fetch-Dest' },
  { value: 'headers.sec-fetch-mode', label: 'Sec-Fetch-Mode' },
  { value: 'headers.sec-fetch-site', label: 'Sec-Fetch-Site' },
  { value: 'headers.sec-fetch-user', label: 'Sec-Fetch-User' },
  { value: 'headers.dnt', label: 'Do Not Track' },
  { value: 'headers.sec-gpc', label: 'Global Privacy Control' },
  { value: 'cf.asn', label: 'ASN' },
  { value: 'cf.httpProtocol', label: 'HTTP Protocol' },
  { value: 'cf.tlsVersion', label: 'TLS Version' },
  { value: 'cf.tlsCipher', label: 'TLS Cipher' },
  { value: 'cf.clientTrustScore', label: 'Client Trust Score' },
  { value: 'cf.botManagement.score', label: 'Bot Score' },
  { value: 'cf.botManagement.staticResource', label: 'Bot Management - Static Resource' },
  { value: 'cf.botManagement.verifiedBot', label: 'Verified Bot' },
  { value: 'cf.botManagement.ja4', label: 'Bot Management - JA4' },
  { value: 'cf.botManagement.ja3Hash', label: 'Bot Management - JA3' },
  { value: 'cf.botManagement.detectionIds', label: 'Bot Management - Detection IDs' },
  { value: 'cf.clientAcceptEncoding', label: 'Client Accept Encoding' },
  { value: 'cf.country', label: 'Country' },
  { value: 'cf.city', label: 'City' },
  { value: 'cf.continent', label: 'Continent' },
  { value: 'cf.postalCode', label: 'Postal Code' },
  { value: 'cf.region', label: 'Region' },
  { value: 'cf.regionCode', label: 'Region Code' },
  { value: 'cf.timezone', label: 'Timezone' },
  { value: 'cf.asOrganization', label: 'AS Organization' },
  { value: 'cf.colo', label: 'Colo' },
  { value: 'cf.clientTcpRtt', label: 'Client TCP RTT' },
  { value: 'cf.edgeRequestKeepAliveStatus', label: 'Edge Request Keep Alive Status' },
  { value: 'cf.httpProtocol', label: 'HTTP Protocol' },
  { value: 'cf.tlsClientAuth.certPresented', label: 'TLS Client Cert Presented' },
  { value: 'cf.tlsClientAuth.certVerified', label: 'TLS Client Cert Verified' },
  { value: 'cf.tlsClientAuth.certRevoked', label: 'TLS Client Cert Revoked' },
  { value: 'cf.tlsClientAuth.certIssuerDNLegacy', label: 'TLS Client Cert Issuer DN Legacy' },
  { value: 'cf.tlsClientAuth.certSubjectDNRFC2253', label: 'TLS Client Cert Subject DN RFC2253' },
  { value: 'cf.tlsClientAuth.certNotBefore', label: 'TLS Client Cert Not Before' },
  { value: 'cf.tlsClientAuth.certNotAfter', label: 'TLS Client Cert Not After' },
  { value: 'cf.tlsClientAuth.certSerial', label: 'TLS Client Cert Serial' },
  { value: 'cf.tlsClientAuth.certPresented', label: 'TLS Client Cert Presented' },
  { value: 'cf.tlsClientAuth.certRevoked', label: 'TLS Client Cert Revoked' },
];

export const FINGERPRINT_PARAMS = [
  { value: 'method', label: 'HTTP Method' },
  { value: 'url', label: 'Full URL' },
  { value: 'headers.name', label: 'Specific Header Value' },
  { value: 'headers.nameValue', label: 'Header Name and Value Pair' },
  { value: 'body', label: 'Request Body' },
  { value: 'url.protocol', label: 'URL Protocol' },
  { value: 'url.hostname', label: 'URL Hostname' },
  { value: 'url.port', label: 'URL Port' },
  { value: 'url.pathname', label: 'URL Path' },
  { value: 'url.search', label: 'URL Query String' },
  { value: 'url.hash', label: 'URL Fragment' },
  { value: 'headers.accept', label: 'Accept Header' },
  { value: 'headers.cookie', label: 'Cookie Header' },
  ...COMMON_FIELDS,
];

export const REQUEST_MATCH_FIELDS = [
  { value: 'method', label: 'HTTP Method' },
  { value: 'url', label: 'Full URL' },
  { value: 'headers.name', label: 'Header Name' },
  { value: 'headers.nameValue', label: 'Header Name and Value' },
  { value: 'body', label: 'Request Body' },
  { value: 'url.protocol', label: 'URL Protocol' },
  { value: 'url.hostname', label: 'URL Hostname' },
  { value: 'url.port', label: 'URL Port' },
  { value: 'url.pathname', label: 'URL Path' },
  { value: 'url.search', label: 'URL Query String' },
  { value: 'url.hash', label: 'URL Fragment' },
  { value: 'headers.accept', label: 'Accept Header' },
  { value: 'headers.cookie', label: 'Cookie Header' },
  ...COMMON_FIELDS,
];

export const FINGERPRINT_TOOLTIPS = {
  'cf.tlsVersion': 'The TLS version used for the connection',
  'cf.tlsCipher': 'The cipher suite used for the TLS connection',
  'cf.asn': 'Autonomous System Number of the client',
  'headers.user-agent': 'User agent string from the client',
  'cf.httpProtocol': 'HTTP protocol version used for the request',
  'cf.clientTrustScore': "Cloudflare's trust score for the client",
  'cf.botManagement.score': 'Bot score from Cloudflare Bot Management',
  'cf.botManagement.staticResource': 'Indicates if the request is for a static resource',
  'cf.botManagement.verifiedBot': 'Indicates if the request is from a verified bot',
  'cf.clientAcceptEncoding': 'Accept-Encoding header from the client',
  'headers.sec-fetch-dest': 'Sec-Fetch-Dest header from the client',
  'headers.sec-fetch-mode': 'Sec-Fetch-Mode header from the client',
  'headers.sec-fetch-site': 'Sec-Fetch-Site header from the client',
  'headers.sec-fetch-user': 'Sec-Fetch-User header from the client',
  'headers.dnt': 'Do Not Track header from the client',
  'headers.sec-gpc': 'Global Privacy Control header from the client',
  'cf.asOrganization': 'Organization associated with the ASN',
  'cf.colo': 'Cloudflare data center that handled the request',
  'cf.clientTcpRtt': 'Round-trip time for the TCP connection',
  'cf.edgeRequestKeepAliveStatus': 'Status of the keep-alive connection from the edge',
  'cf.tlsClientAuth.certPresented': 'Whether the client presented a TLS certificate',
  'cf.tlsClientAuth.certVerified': 'Whether the presented client certificate was verified',
  'cf.tlsClientAuth.certRevoked': 'Whether the presented client certificate was revoked',
};

export const REQUEST_MATCH_OPERATORS = [
  { value: 'eq', label: 'Equals' },
  { value: 'ne', label: 'Not Equals' },
  { value: 'gt', label: 'Greater Than' },
  { value: 'ge', label: 'Greater Than or Equal' },
  { value: 'lt', label: 'Less Than' },
  { value: 'le', label: 'Less Than or Equal' },
  { value: 'contains', label: 'Contains' },
  { value: 'not_contains', label: 'Does Not Contain' },
  { value: 'starts_with', label: 'Starts With' },
  { value: 'ends_with', label: 'Ends With' },
  { value: 'matches', label: 'Matches Regex' },
];
