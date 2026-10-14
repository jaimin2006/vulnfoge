import { BugBountyProgram, VulnerabilityReport, PostMortem, WstgChecklistItem, VulnerabilityKnowledgeItem } from '../types';

export const INITIAL_PROGRAMS: BugBountyProgram[] = [
  {
    id: 'prog-apex',
    name: 'Apex Global Logistics Cloud VDP',
    platform: 'Bugcrowd',
    tier: 'Lesser-Known / High Opportunity',
    category: 'Supply Chain & Freight Telemetry',
    policySummary: 'Coordinated Vulnerability Disclosure with Bugcrowd VRT alignment. Scope covers tenant dispatch APIs and freight routing endpoints. Minimum accepted threshold is P4. Automated scanning without rate limits is strictly forbidden.',
    safeHarbor: 'Gold',
    minSeverityAccepted: 'P4',
    bountyRange: '$300 – $4,500',
    averageTriageHours: 14,
    acknowledgementRatePercent: 94,
    inScopeAssets: [
      '*.dispatch.apex-logistics.io',
      'api.v3.apex-telemetry.com',
      'auth-sso.apex-logistics.io',
      'Android Driver App (com.apex.driverhub)'
    ],
    outOfScopeAssets: [
      'marketing.apex-logistics.com (Static WordPress)',
      'Third-party CDN endpoints (Cloudflare workers)',
      'Denial of Service (DoS/DDoS)',
      'Social engineering of employees'
    ],
    prohibitedTestingRules: [
      'No physical access attacks against warehouse terminals',
      'Do not exfiltrate or modify live shipment manifests outside test accounts',
      'Proof of concept must stop upon demonstrating read access'
    ],
    selectionRationale: 'Target has a sprawling multi-tenant REST API with extensive client-side parameter switching and fast response times. It has ~75% fewer competing researchers than consumer apps, making it a high-yield candidate for authorization vulnerabilities.',
    verifiedProgramUrl: 'https://bugcrowd.com/apex-logistics-vdp'
  },
  {
    id: 'prog-omniroute',
    name: 'OmniRoute Fleet & IoT Gateway',
    platform: 'HackerOne',
    tier: 'Lesser-Known / High Opportunity',
    category: 'IoT Fleet Telematics & Microservices',
    policySummary: 'HackerOne-managed private-turned-public program focusing on IoT fleet gateways, webhook receivers, and telemetry pipelines. Strictly respects Safe Harbor guidelines and requires actionable remediation instructions.',
    safeHarbor: 'Gold',
    minSeverityAccepted: 'P4',
    bountyRange: '$250 – $6,000',
    averageTriageHours: 18,
    acknowledgementRatePercent: 91,
    inScopeAssets: [
      'webhook.telematics.omniroute.net',
      'api.fleet-mesh.omniroute.net',
      'portal.omniroute.net/api/v2/*',
      'Firmware Over-The-Air (FOTA) Dispatcher'
    ],
    outOfScopeAssets: [
      'status.omniroute.net (Hosted on Instatus)',
      'Employee corporate Google Workspace',
      'Spam or SPF/DKIM missing record notices without exploit'
    ],
    prohibitedTestingRules: [
      'Do not disrupt live telemetry stream data for active vehicles',
      'No automated port scanning exceeding 10 requests per second',
      'Proof of Concept must use loopback or controlled collaborator servers'
    ],
    selectionRationale: 'The fleet gateway exposes webhook integration endpoints that take user-supplied URLs for event forwarding. Webhook parsers in microservice architectures frequently suffer from SSRF or internal DNS rebinding.',
    verifiedProgramUrl: 'https://hackerone.com/omniroute-fleet'
  },
  {
    id: 'prog-nordic',
    name: 'Nordic EduCore Learning Systems',
    platform: 'YesWeHack',
    tier: 'Lesser-Known / High Opportunity',
    category: 'Higher Ed LMS & Exam Verification',
    policySummary: 'European educational cloud provider subject to GDPR. Program awards recognition and Hall of Fame acknowledgment for architectural flaws and privilege escalations. Minimum accepted severity is P4.',
    safeHarbor: 'Standard',
    minSeverityAccepted: 'P4',
    bountyRange: '€200 – €3,500',
    averageTriageHours: 22,
    acknowledgementRatePercent: 88,
    inScopeAssets: [
      'learn.nordic-educore.eu',
      'grading-api.nordic-educore.eu',
      'auth.nordic-educore.eu/oauth/token',
      'mobile-api.nordic-educore.eu'
    ],
    outOfScopeAssets: [
      'blog.nordic-educore.eu',
      'Self-XSS without CSRF or session impact',
      'Clickjacking on pages with no sensitive state-change'
    ],
    prohibitedTestingRules: [
      'Do not access genuine student personal data or real exam answers',
      'Test exclusively between two dedicated researcher-owned test accounts',
      'Stop immediately if administrative credentials or root keys are obtained'
    ],
    selectionRationale: 'Hierarchical role structure (Student, TA, Instructor, Department Head, Institution Admin) makes role matrix testing extremely fruitful for privilege escalation and JWT claim tampering.',
    verifiedProgramUrl: 'https://yeswehack.com/programs/nordic-educore'
  },
  {
    id: 'prog-klaro',
    name: 'Klaro Financial Open-Banking Portal',
    platform: 'Intigriti',
    tier: 'Lesser-Known / High Opportunity',
    category: 'PSD2 Open Banking & FinTech',
    policySummary: 'Intigriti-verified financial services program covering regulatory sandbox and consumer consent portals. Follows European Safe Harbor with swift acknowledgement by in-house Security Operations.',
    safeHarbor: 'Gold',
    minSeverityAccepted: 'P4',
    bountyRange: '€500 – €8,000',
    averageTriageHours: 8,
    acknowledgementRatePercent: 96,
    inScopeAssets: [
      'sandbox-consent.klaro-openbank.com',
      'api.klaro-identity.com/v1/mfa/*',
      'developer.klaro-openbank.com/api/*',
      'webhook.sandbox.klaro.com'
    ],
    outOfScopeAssets: [
      'Production banking ledger (clear boundary separated from sandbox)',
      'Volumetric DDoS tests',
      'Unauthenticated SSL cipher suite degradation reports'
    ],
    prohibitedTestingRules: [
      'Do not attempt physical social engineering against customer service desks',
      'Respect test sandbox credentials provided in program guidelines',
      'No brute force without observing concurrency thresholds'
    ],
    selectionRationale: 'Financial API sandbox portals often duplicate production authentication routes but receive less stringent hardening. Testing the MFA step transitions exposed race conditions and rate-limit leakages.',
    verifiedProgramUrl: 'https://intigriti.com/programs/klaro-financial'
  },
  {
    id: 'prog-meditech',
    name: 'MediHealth Clinical Telemetry Service',
    platform: 'Responsible Disclosure (VDP)',
    tier: 'Lesser-Known / High Opportunity',
    category: 'Healthcare Cloud & HL7 Integration',
    policySummary: 'Direct Responsible Disclosure Program with formal legal safe harbor and CVE sponsorship upon remediation. All verified findings (minimum P4) receive signed acknowledgment and Hall of Fame placement.',
    safeHarbor: 'Gold',
    minSeverityAccepted: 'P4',
    bountyRange: 'Hall of Fame & $500 Bonus',
    averageTriageHours: 12,
    acknowledgementRatePercent: 95,
    inScopeAssets: [
      'gateway.medihealth-telemetry.org',
      'fhir-proxy.medihealth-telemetry.org',
      'portal.medihealth-telemetry.org/api/*'
    ],
    outOfScopeAssets: [
      'Hospital physical networks',
      'Third-party cloud storage buckets not tagged medihealth'
    ],
    prohibitedTestingRules: [
      'Zero tolerance for viewing or storing synthetic or real patient PHI/HIPAA data',
      'Immediately halt upon finding unauthenticated endpoints'
    ],
    selectionRationale: 'Healthcare telemetry platforms using modern FHIR / HL7 microservices frequently expose unvalidated JSON-schema deserialization or broken object-level authorization on patient identifier parameters.',
    verifiedProgramUrl: 'https://medihealth-telemetry.org/.well-known/security.txt'
  }
];

export const INITIAL_REPORTS: VulnerabilityReport[] = [
  {
    id: 'rep-001',
    programId: 'prog-apex',
    programName: 'Apex Global Logistics Cloud VDP',
    platform: 'Bugcrowd',
    title: 'Insecure Direct Object Reference (IDOR) in Multi-Tenant Organization Settings API Exposes Dispatch Routes',
    cweId: 'CWE-639',
    cweName: 'Authorization Bypass Through User-Controlled Key',
    owaspCategory: 'A01:2021 - Broken Access Control',
    targetAsset: 'api.v3.apex-telemetry.com',
    vulnerableEndpoint: '/api/v3/organizations/{org_id}/telemetry-dispatch-keys',
    severityRating: 'P3',
    cvssScore: 6.5,
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N',
    cvssMetrics: {
      attackVector: 'NETWORK',
      attackComplexity: 'LOW',
      privilegesRequired: 'LOW',
      userInteraction: 'NONE',
      scope: 'UNCHANGED',
      confidentiality: 'HIGH',
      integrity: 'NONE',
      availability: 'NONE'
    },
    attackSurfaceSummary: 'The organization dispatch configuration endpoint fails to validate whether the authenticated user belongs to the requested `org_id` UUID path parameter. By substituting the victim organization UUID, an authenticated low-privileged driver or dispatcher can extract high-entropy telemetry keys, vehicle GPS streams, and driver routing logs across competing organizations.',
    reproductionSteps: [
      'Register two distinct test organization accounts on the staging environment: Test Tenant A (UUID: a1b2c3d4-0001-4000-8000-000000000001) and Test Tenant B (UUID: e5f6a7b8-0002-4000-8000-000000000002).',
      'Authenticate as a standard driver user within Tenant A, capturing the Bearer session token in an interception proxy (e.g. Caido/Burp Suite).',
      'Observe the valid request to fetch Tenant A keys: GET /api/v3/organizations/a1b2c3d4-0001-4000-8000-000000000001/telemetry-dispatch-keys with Header: Authorization: Bearer <TOKEN_A>. The server responds 200 OK with Tenant A keys.',
      'Modify the path parameter to Tenant B UUID: GET /api/v3/organizations/e5f6a7b8-0002-4000-8000-000000000002/telemetry-dispatch-keys while retaining the Bearer token for Tenant A.',
      'Submit the modified HTTP request. The server returns HTTP 200 OK with the sensitive dispatch API keys, active webhook URLs, and fleet identifiers belonging to Tenant B, proving cross-tenant authorization bypass.'
    ],
    proofOfConceptRaw: `GET /api/v3/organizations/e5f6a7b8-0002-4000-8000-000000000002/telemetry-dispatch-keys HTTP/1.1
Host: api.v3.apex-telemetry.com
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3ItMDFhIiwib3JnIjoiYTFiMmMzZDQtMDAwMS00MDAwLTgwMDAtMDAwMDAwMDAwMDAxIn0...
Accept: application/json
User-Agent: SecurityResearch-Bugcrowd-Verified/1.0

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
X-Tenant-Resolved: e5f6a7b8-0002-4000-8000-000000000002

{
  "status": "success",
  "organization_id": "e5f6a7b8-0002-4000-8000-000000000002",
  "organization_name": "Tenant B Freight Logistics",
  "active_dispatch_tokens": [
    {
      "key_id": "dsp_live_89f023e11",
      "permissions": ["dispatch:read", "routes:write", "gps:stream"],
      "secret_preview": "ak_live_77b3...[REDACTED_BY_RESEARCHER]"
    }
  ]
}`,
    impactAnalysis: 'Severe breach of tenant isolation. An attacker with any registered driver account can systematically iterate through organization UUIDs (which are exposed in public shipping notifications and QR bills of lading) to obtain full read access to real-time freight tracking, driver assignments, and confidential shipment cargo manifests.',
    recommendedMitigation: 'Enforce server-side context validation prior to querying the database. The API route middleware must extract the authenticated user organization ID directly from the validated session/JWT claims (e.g. `req.user.organizationId`) rather than trusting user-supplied route parameters.',
    defensiveCodeSnippet: `// BEFORE (Vulnerable):
app.get('/api/v3/organizations/:orgId/telemetry-dispatch-keys', async (req, res) => {
  const { orgId } = req.params;
  const keys = await db.dispatchKeys.findAll({ where: { organizationId: orgId } });
  return res.json({ status: 'success', keys });
});

// AFTER (Secure - Contextual RBAC Verification):
app.get('/api/v3/organizations/:orgId/telemetry-dispatch-keys', authenticateSession, async (req, res) => {
  const { orgId } = req.params;
  
  // Verify tenant ownership from cryptographically verified session
  if (req.user.organizationId !== orgId && !req.user.isSystemSuperAdmin) {
    logger.warn('Unauthorized cross-tenant access attempt', { user: req.user.id, targetOrg: orgId });
    return res.status(403).json({ error: 'FORBIDDEN', message: 'Access to foreign tenant resources is denied.' });
  }

  const keys = await db.dispatchKeys.findAll({ 
    where: { organizationId: req.user.organizationId } 
  });
  return res.json({ status: 'success', keys });
});`,
    status: 'Acknowledged & Validated',
    acknowledgement: {
      verifiedBy: 'Bugcrowd Application Security Team & Apex CISO',
      triageRole: 'Senior Application Security Engineer (Apex Cloud)',
      acknowledgedDate: '2026-09-18',
      confirmedSeverity: 'P3',
      bountyAwarded: '$1,250',
      officialNote: 'Valid report confirmed. The engineering team validated the reproduction steps on staging and deployed a hotfix to enforce strict tenant boundary middleware. Bounty awarded in line with VRT P3 guidelines.',
      referenceTicketId: 'APEX-SEC-2026-0842'
    },
    postMortemId: 'pm-001',
    createdAt: '2026-09-15T09:30:00Z',
    updatedAt: '2026-09-19T14:20:00Z'
  },
  {
    id: 'rep-002',
    programId: 'prog-omniroute',
    programName: 'OmniRoute Fleet & IoT Gateway',
    platform: 'HackerOne',
    title: 'Blind Server-Side Request Forgery (SSRF) via Webhook Endpoint Ping Validation',
    cweId: 'CWE-918',
    cweName: 'Server-Side Request Forgery (SSRF)',
    owaspCategory: 'A10:2021 - Server-Side Request Forgery',
    targetAsset: 'webhook.telematics.omniroute.net',
    vulnerableEndpoint: '/api/v2/webhooks/test-delivery',
    severityRating: 'P2',
    cvssScore: 8.6,
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:N/A:N',
    cvssMetrics: {
      attackVector: 'NETWORK',
      attackComplexity: 'LOW',
      privilegesRequired: 'NONE',
      userInteraction: 'NONE',
      scope: 'CHANGED',
      confidentiality: 'HIGH',
      integrity: 'NONE',
      availability: 'NONE'
    },
    attackSurfaceSummary: 'The fleet webhook testing facility accepts arbitrary destination URLs to deliver test payloads. The backend node resolver blindly initiates an HTTP POST request without validating private IP blocks (RFC 1918) or blocking link-local cloud metadata addresses (169.254.169.254). Furthermore, by following HTTP 302 redirects, the service can be coerced into reading internal metadata endpoints.',
    reproductionSteps: [
      'Locate the unauthenticated webhook validation endpoint at POST /api/v2/webhooks/test-delivery.',
      'Deploy a controlled external test endpoint (e.g., researcher collaborator domain at webhook-research.org/redirect).',
      'Configure the collaborator server to return an HTTP 302 redirect with Location: http://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/token with custom header Metadata-Flavor: Google.',
      'Send a POST request with payload {"target_url": "https://webhook-research.org/redirect", "test_id": "probe-01"}.',
      'Observe backend timing and response payload indicating successful token retrieval, proving internal network pivoting without safe egress filtration.'
    ],
    proofOfConceptRaw: `POST /api/v2/webhooks/test-delivery HTTP/1.1
Host: webhook.telematics.omniroute.net
Content-Type: application/json
Accept: application/json
User-Agent: Mozilla/5.0 (SecurityResearch-HackerOne-OmniRoute)

{
  "target_url": "https://test-observer.cloud-security-audit.com/probe",
  "event_type": "vehicle.engine_alert",
  "sample_payload": { "vehicle_id": "V-100", "speed_kmh": 0 }
}

HTTP/1.1 200 OK
Content-Type: application/json

{
  "delivery_status": "dispatched",
  "remote_ip_contacted": "169.254.169.254",
  "response_code": 200,
  "elapsed_ms": 142
}`,
    impactAnalysis: 'Critical blast radius expansion. Attackers can leverage the webhook relay agent to query internal cloud metadata services, extract IAM role credentials or Kubernetes service account tokens, and scan internal Redis and PostgreSQL instances hidden behind private VPC subnets.',
    recommendedMitigation: 'Implement strict IP blocklist validation prior to establishing any outbound socket connection. Disallow loopback (127.0.0.0/8), RFC 1918 private subnets (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), and cloud link-local metadata (169.254.169.254). Crucially, disable automatic HTTP redirect following or re-validate redirect destinations against the allowlist before connecting.',
    defensiveCodeSnippet: `import ipaddress
import urllib.parse
import socket

BLOCKED_NETWORKS = [
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("169.254.0.0/16"),
    ipaddress.ip_network("::1/128"),
]

def validate_safe_webhook_url(url: str) -> bool:
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme not in ("http", "https"):
        return False
    
    # Resolve hostname to all candidate IP addresses
    try:
        resolved_ips = socket.getaddrinfo(parsed.hostname, None)
    except socket.gaierror:
        return False

    for item in resolved_ips:
        ip = ipaddress.ip_address(item[4][0])
        for blocked in BLOCKED_NETWORKS:
            if ip in blocked or ip.is_private or ip.is_loopback:
                return False
    return True`,
    status: 'Acknowledged & Validated',
    acknowledgement: {
      verifiedBy: 'HackerOne Triage Staff & OmniRoute Head of SecOps',
      triageRole: 'HackerOne Technical Lead Reviewer',
      acknowledgedDate: '2026-08-04',
      confirmedSeverity: 'P2',
      bountyAwarded: '$2,800',
      officialNote: 'Report triaged within 6 hours. High technical clarity and non-destructive reproduction. Engineering confirmed SSRF susceptibility and deployed an egress proxy gateway with IP pinning.',
      referenceTicketId: 'H1-OMNI-98311'
    },
    postMortemId: 'pm-002',
    createdAt: '2026-08-02T16:15:00Z',
    updatedAt: '2026-08-05T10:00:00Z'
  },
  {
    id: 'rep-003',
    programId: 'prog-nordic',
    programName: 'Nordic EduCore Learning Systems',
    platform: 'YesWeHack',
    title: 'Vertical Privilege Escalation via Unsigned JWT Role Attribute Injection on SSO Callback',
    cweId: 'CWE-269',
    cweName: 'Improper Privilege Management',
    owaspCategory: 'A01:2021 - Broken Access Control',
    targetAsset: 'auth.nordic-educore.eu',
    vulnerableEndpoint: '/oauth/token/callback',
    severityRating: 'P1',
    cvssScore: 9.1,
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N',
    cvssMetrics: {
      attackVector: 'NETWORK',
      attackComplexity: 'LOW',
      privilegesRequired: 'NONE',
      userInteraction: 'NONE',
      scope: 'UNCHANGED',
      confidentiality: 'HIGH',
      integrity: 'HIGH',
      availability: 'NONE'
    },
    attackSurfaceSummary: 'During the Single Sign-On callback handshake, the client application exchanges an authorization code. If the callback payload includes an untrusted `requested_role` parameter in the JSON body, the backend OAuth consumer service sets the user role claim in the issued session token without checking against the authoritative identity provider assertion.',
    reproductionSteps: [
      'Initiate an unprivileged Student login flow via the public login portal.',
      'Intercept the final token exchange request POST /oauth/token/callback.',
      'Append `"requested_role": "SYSTEM_SUPER_ADMIN"` and `"department_id": "ROOT"` into the JSON body.',
      'Forward the request. Inspect the issued response access token: the decoded JWT payload reflects `"role": "SYSTEM_SUPER_ADMIN"`.',
      'Using the issued token, access the restricted administrative endpoint GET /api/v1/institution/audit-logs and verify full administrative response.'
    ],
    proofOfConceptRaw: `POST /oauth/token/callback HTTP/1.1
Host: auth.nordic-educore.eu
Content-Type: application/json
Accept: application/json

{
  "grant_type": "authorization_code",
  "code": "auth_cd_981a2f64",
  "client_id": "nordic-web-portal",
  "redirect_uri": "https://learn.nordic-educore.eu/auth/callback",
  "requested_role": "SYSTEM_SUPER_ADMIN"
}

HTTP/1.1 200 OK
Content-Type: application/json

{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3ItOTAxOSIsInJvbGUiOiJTWVNURU1fU1VQRVJfQURNSU4iLCJpYXQiOjE3NTQzMjAwMDB9...",
  "token_type": "Bearer",
  "expires_in": 3600
}`,
    impactAnalysis: 'Complete compromise of system integrity and confidentiality. Any newly registered student can promote themselves to System Super Admin, view all institutional exam grading rubrics, modify exam scores, and delete academic course registries across entire university faculties.',
    recommendedMitigation: 'Strip all client-provided role requests in token exchange endpoints. Roles must be derived exclusively from the authenticated IdP directory database or internal user database records after verifying the signed SAML/OIDC identity token.',
    defensiveCodeSnippet: `// BEFORE (Vulnerable):
app.post('/oauth/token/callback', async (req, res) => {
  const { code, requested_role } = req.body;
  const user = await exchangeAuthCode(code);
  const role = requested_role || user.defaultRole; // DANGEROUS TRUST IN CLIENT!
  const token = jwt.sign({ sub: user.id, role }, PRIVATE_KEY, { algorithm: 'RS256' });
  return res.json({ access_token: token });
});

// AFTER (Secure):
app.post('/oauth/token/callback', async (req, res) => {
  const { code } = req.body;
  const user = await exchangeAuthCode(code);
  
  // Authoritative role lookup from hardened internal database
  const authoritativeRecord = await db.users.findById(user.id);
  const verifiedRole = authoritativeRecord.role; // Always trust internal store only
  
  const token = jwt.sign(
    { sub: user.id, role: verifiedRole }, 
    PRIVATE_KEY, 
    { algorithm: 'RS256', expiresIn: '1h' }
  );
  return res.json({ access_token: token });
});`,
    status: 'Resolved & Closed',
    acknowledgement: {
      verifiedBy: 'YesWeHack Security Engineering & Nordic EduCore Trust Center',
      triageRole: 'Security Operations Lead',
      acknowledgedDate: '2026-07-12',
      confirmedSeverity: 'P1',
      bountyAwarded: '€3,500',
      officialNote: 'Exceptional technical depth. Vulnerability was acknowledged immediately and resolved within 48 hours. Researcher added to Nordic EduCore Hall of Fame with maximum critical bounty.',
      referenceTicketId: 'YWH-NORDIC-2026-0118'
    },
    postMortemId: 'pm-003',
    createdAt: '2026-07-10T11:00:00Z',
    updatedAt: '2026-07-14T17:30:00Z'
  },
  {
    id: 'rep-004',
    programId: 'prog-klaro',
    programName: 'Klaro Financial Open-Banking Portal',
    platform: 'Intigriti',
    title: 'Missing Rate Limiting on 2FA Challenge Endpoint Allows Concurrent State Extraction (P4 Threshold)',
    cweId: 'CWE-307',
    cweName: 'Improper Restriction of Excessive Authentication Attempts',
    owaspCategory: 'A07:2021 - Identification and Authentication Failures',
    targetAsset: 'api.klaro-identity.com',
    vulnerableEndpoint: '/v1/mfa/verify-passcode',
    severityRating: 'P4',
    cvssScore: 3.7,
    cvssVector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:N/A:N',
    cvssMetrics: {
      attackVector: 'NETWORK',
      attackComplexity: 'HIGH',
      privilegesRequired: 'NONE',
      userInteraction: 'NONE',
      scope: 'UNCHANGED',
      confidentiality: 'LOW',
      integrity: 'NONE',
      availability: 'NONE'
    },
    attackSurfaceSummary: 'The multi-factor verification endpoint lacks distributed token-bucket rate limiting. When sending concurrent bursts of 50 requests per second against the verification challenge, the endpoint leaks timing variances and validation session state through inconsistent HTTP headers (`X-MFA-Attempts-Left`), enabling automated brute force without lockout triggers.',
    reproductionSteps: [
      'Initiate an MFA authentication flow for a test sandbox account, generating a 6-digit SMS challenge code.',
      'Intercept the verification request to POST /v1/mfa/verify-passcode.',
      'Configure a testing harness to send 40 parallel requests with incremental test codes across 2 distinct IP nodes.',
      'Inspect response headers: Notice that while sequential requests trigger an error after 5 tries, concurrent threads executed within a 150ms window are all processed without decrementing the lockout counter.',
      'Confirm the presence of response status code 400 with remaining attempts counter unchanged, proving a race condition in Redis state updates.'
    ],
    proofOfConceptRaw: `POST /v1/mfa/verify-passcode HTTP/1.1
Host: api.klaro-identity.com
Content-Type: application/json
X-Client-Id: sandbox_klaro_test_client

{
  "session_challenge_id": "chn_9011a8bc",
  "verification_code": "000123"
}

HTTP/1.1 400 Bad Request
X-MFA-Attempts-Left: 5
X-RateLimit-Window: null

{
  "error": "INVALID_CODE",
  "challenge_status": "PENDING"
}`,
    impactAnalysis: 'Allows attackers who possess compromised primary credentials to weaken the secondary MFA defense layer through distributed bursts, violating the financial platform requirement for strict brute-force deterrence.',
    recommendedMitigation: 'Implement atomic atomic counters in Redis using Lua scripts or transactions (`MULTI`/`EXEC`), ensuring race conditions cannot bypass attempt limits. Apply an immediate hard lockout for 15 minutes after 5 consecutive failed attempts regardless of concurrency.',
    defensiveCodeSnippet: `// Atomic Redis Lua Script for Lockout
const rateLimitScript = \`
  local key = KEYS[1]
  local current = redis.call('INCR', key)
  if current == 1 then
    redis.call('EXPIRE', key, 900)
  end
  return current
\`;

async function verifyMfaAttempt(sessionId: string) {
  const attempts = await redis.eval(rateLimitScript, 1, \`mfa_attempts:\${sessionId}\`);
  if (attempts > 5) {
    throw new Error('MFA_LOCKED_OUT: Too many attempts. Challenge invalidated.');
  }
}`,
    status: 'Acknowledged & Validated',
    acknowledgement: {
      verifiedBy: 'Intigriti Security Review Panel & Klaro AppSec',
      triageRole: 'Principal Security Architect',
      acknowledgedDate: '2026-06-21',
      confirmedSeverity: 'P4',
      bountyAwarded: '€600',
      officialNote: 'Valid P4 finding. The team reproduced the atomic state delay on the sandbox gateway and refactored the verification middleware to use distributed Redis locks.',
      referenceTicketId: 'INTI-KLARO-4419'
    },
    postMortemId: 'pm-004',
    createdAt: '2026-06-19T14:00:00Z',
    updatedAt: '2026-06-22T08:30:00Z'
  }
];

export const INITIAL_POST_MORTEMS: PostMortem[] = [
  {
    id: 'pm-001',
    reportId: 'rep-001',
    reportTitle: 'Insecure Direct Object Reference (IDOR) in Multi-Tenant Organization Settings API',
    programName: 'Apex Global Logistics Cloud VDP',
    severity: 'P3',
    targetSelectionRationale: 'Selected Apex Logistics because enterprise logistics applications rely on distributed driver and fleet dispatcher sub-accounts with shared API gateways. Unlike prominent tech giants with heavily saturated bug queues, mid-tier logistics SaaS platforms frequently build custom multi-tenant authorization logic with rapid release cycles.',
    reconnaissanceProcess: [
      'Discovered subdomains via Certificate Transparency logs (crt.sh) targeting apex-logistics.io.',
      'Analyzed Swagger/OpenAPI spec exposed at /api/v3/docs on the telemetry host.',
      'Registered two independent trial accounts to test tenant separation boundaries.',
      'Mapped all UUID parameters in API routes and cataloged endpoints lacking user-tenant validation.'
    ],
    testingTechniquesUsed: [
      'Differential parameter testing between Tenant A (low privilege driver) and Tenant B (victim company).',
      'Header tampering and Bearer token substitution using Caido HTTP interception.',
      'Non-destructive testing: Only read telemetry keys without invoking destructive route modifications.'
    ],
    challengesAndBottlenecks: [
      'Target had aggressive Cloudflare WAF rules that initially blocked automated fuzzing.',
      'Overcame WAF by slowing down request rates to 1 req/sec and exclusively relying on manual HTTP manipulation.',
      'UUIDs were high-entropy (v4), making random brute force impossible; required identifying where UUIDs were naturally leaked in public tracking links.'
    ],
    duplicatePreventionStrategy: 'Focused specifically on newly introduced v3 API routes identified through HTTP headers (X-API-Version: 3.2.0-rc2) rather than legacy v1 routes that were already exhaustively tested by other researchers.',
    whyAcknowledgedByCompany: 'Report included complete, non-destructive step-by-step reproduction with two verified test tenant UUIDs, proving cross-tenant authorization failure beyond doubt. No real user data was touched, honoring Safe Harbor.',
    lessonsLearned: [
      'Manual parameter replacement on business-logic endpoints yields higher severity valid findings than automated scanners.',
      'Always prepare two distinct tenant environments before beginning testing to make cross-tenant authorization proof undeniable.',
      'Providing exact defensive code patches (Node.js/Express) significantly accelerates triage acknowledgment.'
    ],
    futureHuntImprovements: [
      'Automate the extraction of UUIDs from public business workflows (invoices, receipts, booking confirms) during passive recon.',
      'Incorporate automated Burp Match & Replace rules to test authorization checks across all captured session tokens automatically.'
    ],
    completedDate: '2026-09-20'
  },
  {
    id: 'pm-002',
    reportId: 'rep-002',
    reportTitle: 'Blind Server-Side Request Forgery (SSRF) via Webhook Endpoint Ping Validation',
    programName: 'OmniRoute Fleet & IoT Gateway',
    severity: 'P2',
    targetSelectionRationale: 'OmniRoute was chosen due to its heavy reliance on IoT webhook notifications and microservices architecture. Webhook dispatchers are notorious for SSRF vulnerabilities when development teams implement synchronous URL health checks.',
    reconnaissanceProcess: [
      'Inspected IoT fleet documentation to identify webhook subscription capabilities.',
      'Monitored network traffic from the web portal during webhook creation.',
      'Identified an undocumented test delivery endpoint /api/v2/webhooks/test-delivery.'
    ],
    testingTechniquesUsed: [
      'Configured an authoritative DNS and HTTP collaborator server to detect outbound connections.',
      'Tested DNS rebinding and HTTP 302 redirect chaining to bypass client-side hostname filters.',
      'Validated cloud metadata access via link-local address without extracting sensitive cloud keys directly.'
    ],
    challengesAndBottlenecks: [
      'Direct requests to 169.254.169.254 were caught by an initial regex validator on the input field.',
      'Bypassed the regex by utilizing an external HTTP 302 redirect from a controlled public domain, demonstrating that the backend HTTP client followed redirects blindly.'
    ],
    duplicatePreventionStrategy: 'Tested the undocumented test-delivery endpoint which was separate from the main webhook registration flow, avoiding areas already covered by general scanners.',
    whyAcknowledgedByCompany: 'Clear evidence of outbound connection to metadata IP in response headers, demonstrated via controlled collaborator proof with zero denial of service or data exfiltration.',
    lessonsLearned: [
      'Whenever an application asks for a URL, test redirect behavior: many egress validators only check the initial URL and fail to validate redirect destinations.',
      'Keep PoC proofs strictly confined to network reachability verification to avoid violating Safe Harbor data access boundaries.'
    ],
    futureHuntImprovements: [
      'Build a custom redirect server with granular timing telemetry to quickly test cloud metadata access across diverse providers (AWS, GCP, Azure, DigitalOcean).'
    ],
    completedDate: '2026-08-06'
  },
  {
    id: 'pm-003',
    reportId: 'rep-003',
    reportTitle: 'Vertical Privilege Escalation via Unsigned JWT Role Attribute Injection on SSO Callback',
    programName: 'Nordic EduCore Learning Systems',
    severity: 'P1',
    targetSelectionRationale: 'European educational LMS platforms must handle diverse user hierarchies across institutions. The complexity of mapping local university LDAP/SAML roles to cloud platform roles often introduces translation gaps in OAuth callback handlers.',
    reconnaissanceProcess: [
      'Analyzed the OAuth 2.0 / OIDC handshake parameters across university integration portals.',
      'Decoded JWT tokens across various sample roles to map claim structures (`sub`, `role`, `tenant_id`, `scope`).'
    ],
    testingTechniquesUsed: [
      'Parameter pollution and mass assignment testing during the authorization code exchange.',
      'Token tampering and inspection of server response claims.',
      'Verified elevated permissions by querying read-only administrative audit endpoints.'
    ],
    challengesAndBottlenecks: [
      'Testing required careful restraint to avoid altering real student grading tables or triggering account locks.',
      'Strict GDPR policies required thorough documentation that all testing was confined to mock institutional accounts.'
    ],
    duplicatePreventionStrategy: 'Discovered the vulnerability by inspecting the JSON body structure of the callback API, which accepted extra fields not present in standard OAuth documentation.',
    whyAcknowledgedByCompany: 'The report was rated P1 because it allowed arbitrary elevation to the highest system privilege. The disclosure was ethical, with no data exfiltration and immediate actionable code fixes provided.',
    lessonsLearned: [
      'Never trust claims or parameters passed in token exchange bodies; all user authorizations must stem from backend stores.',
      'Documenting compliance with GDPR and ethical boundaries directly in the report title and header builds immediate trust with the triage team.'
    ],
    futureHuntImprovements: [
      'Develop automated schema comparison scripts to detect discrepancies between published API schemas and actual accepted JSON parameters.'
    ],
    completedDate: '2026-07-15'
  },
  {
    id: 'pm-004',
    reportId: 'rep-004',
    reportTitle: 'Missing Rate Limiting on 2FA Challenge Endpoint Allows Concurrent State Extraction',
    programName: 'Klaro Financial Open-Banking Portal',
    severity: 'P4',
    targetSelectionRationale: 'Klaro sandbox environment provided a rare look into open-banking authentication pipelines. Testing sandbox endpoints often reveals race conditions that survive into production microservices.',
    reconnaissanceProcess: [
      'Read PSD2 developer documentation to understand consent and MFA challenge flows.',
      'Analyzed HTTP header responses from failed verification attempts.'
    ],
    testingTechniquesUsed: [
      'Concurrency testing using HTTP/2 multiplexing to send bursts of requests within milliseconds.',
      'Timing analysis and differential header analysis (`X-MFA-Attempts-Left`).'
    ],
    challengesAndBottlenecks: [
      'Sequential attempts were properly rate-limited, making the endpoint appear secure at first glance.',
      'Only high-precision parallel packet delivery exposed the non-atomic state transition in Redis.'
    ],
    duplicatePreventionStrategy: 'Focused on the race condition aspect rather than standard sequential rate-limiting, which had already been resolved by previous researchers.',
    whyAcknowledgedByCompany: 'Acknowledged as a valid P4 security issue because it violated the bank strict requirement for tamper-proof multi-factor authentication thresholds.',
    lessonsLearned: [
      'Always test race conditions and concurrency on security-critical counters, even when basic rate limiting is active.',
      'Even P4 findings demonstrate high technical craftsmanship when backed by rigorous timing analysis and proof of state desynchronization.'
    ],
    futureHuntImprovements: [
      'Standardize concurrency testing scripts using Go or Node.js workers to systematically test race conditions on all token validation endpoints.'
    ],
    completedDate: '2026-06-23'
  }
];

export const INITIAL_CHECKLIST: WstgChecklistItem[] = [
  {
    id: 'wstg-01',
    category: 'Target Selection & Recon',
    wstgId: 'WSTG-INFO-01',
    title: 'Analyze Target Scope & Program Rules of Engagement',
    description: 'Review program policy on HackerOne/Bugcrowd/YesWeHack. Verify Safe Harbor status, minimum accepted severity (P4), and list of prohibited techniques.',
    testingGuide: 'Ensure target asset is strictly inside the in-scope wildcard list. Mark any out-of-scope assets (e.g. third-party CDNs, status pages, third-party auth) in testing tools.',
    completed: true,
    notes: 'Verified policy allows API testing. Confirmed P5 reports are excluded.'
  },
  {
    id: 'wstg-02',
    category: 'Target Selection & Recon',
    wstgId: 'WSTG-INFO-02',
    title: 'Passive Asset & Endpoint Discovery (Lesser-Known Surface)',
    description: 'Use Certificate Transparency logs (crt.sh), DNS enumeration, and GitHub repo commits to find obscure subdomains and staging endpoints.',
    testingGuide: 'Look for internal API gateways, telemetry nodes, or partner integration endpoints that are rarely visited by mainstream hunters.',
    completed: true,
    notes: 'Found api.v3 and telemetry dispatch endpoints.'
  },
  {
    id: 'wstg-03',
    category: 'Authentication & Session',
    wstgId: 'WSTG-ATHN-01',
    title: 'Multi-Factor Authentication & Rate Limiting Verification',
    description: 'Test MFA challenge endpoints for concurrent bypasses, race conditions, and lack of atomic rate limits.',
    testingGuide: 'Send parallel burst requests (20-50 reqs) within 100ms window to observe whether attempt counter fails to decrement atomically.',
    completed: true,
    notes: 'Identified race condition in Klaro sandbox.'
  },
  {
    id: 'wstg-04',
    category: 'Authorization & IDOR',
    wstgId: 'WSTG-ATHZ-02',
    title: 'Horizontal & Vertical Access Control (IDOR Matrix)',
    description: 'Test all endpoints accepting tenant IDs, user UUIDs, or document IDs with tokens belonging to a different test account.',
    testingGuide: 'Create Account A (low priv) and Account B (victim). Replace UUID of B in request made by A. Check for 200 OK with cross-tenant data.',
    completed: true,
    notes: 'Found P3 IDOR on Apex telemetry keys.'
  },
  {
    id: 'wstg-05',
    category: 'Server-Side & Cloud Logic',
    wstgId: 'WSTG-INPV-19',
    title: 'Server-Side Request Forgery (SSRF) on Webhook Relays',
    description: 'Identify endpoints accepting URLs (webhooks, avatar imports, PDF generators, link previews).',
    testingGuide: 'Supply collaborator URL with 302 redirect to 169.254.169.254 or internal IP ranges. Verify outbound request and metadata response.',
    completed: true,
    notes: 'P2 SSRF confirmed on OmniRoute webhook service.'
  },
  {
    id: 'wstg-06',
    category: 'Server-Side & Cloud Logic',
    wstgId: 'WSTG-BUSL-01',
    title: 'Business Logic & State Manipulation Testing',
    description: 'Test multi-step workflows (checkout, invoice generation, discount application, role switching) for skipped steps or parameter tampering.',
    testingGuide: 'Manipulate step ordering, negative quantities, or inject unlisted JSON fields into callback requests.',
    completed: false,
    notes: 'Pending testing on billing cycle endpoints.'
  }
];

export const VULNERABILITY_KNOWLEDGE: VulnerabilityKnowledgeItem[] = [
  {
    cweId: 'CWE-639',
    title: 'Insecure Direct Object Reference (IDOR)',
    category: 'Broken Access Control',
    defaultVrtPriority: 'P3',
    summary: 'Occurs when an application exposes a reference to an internal implementation object, such as a database key, file, or record, without performing an access control check.',
    exploitMechanics: 'An authenticated user modifies a parameter (e.g. /api/user/100 to /api/user/101) and views or modifies unauthorized records belonging to another tenant.',
    safeTestingTip: 'Never test against real third-party users. Always register two distinct researcher-owned test accounts (Tenant A and Tenant B) and verify access only across your own accounts.',
    defensiveMitigation: 'Never trust user-supplied IDs from request parameters. Enforce authorization checks in the database layer or extract tenant identity directly from the cryptographically validated session JWT.'
  },
  {
    cweId: 'CWE-918',
    title: 'Server-Side Request Forgery (SSRF)',
    category: 'Server-Side Security',
    defaultVrtPriority: 'P2',
    summary: 'Occurs when a web application fetches a remote resource without validating the user-supplied URL, allowing an attacker to coerce the server into connecting to internal services.',
    exploitMechanics: 'Attacker supplies internal IP addresses (e.g., 169.254.169.254 for cloud metadata, 127.0.0.1 for local Redis) or uses DNS rebinding / HTTP redirects to reach restricted internal VPC resources.',
    safeTestingTip: 'Stop immediately upon proving network reachability via collaborator DNS/HTTP ping. Do not dump database tables or read private cloud keys.',
    defensiveMitigation: 'Deploy a dedicated egress proxy. Parse and resolve the hostname, verify all resolved IP addresses against a strict blocklist (RFC 1918, link-local, loopback), and disable HTTP redirect following.'
  },
  {
    cweId: 'CWE-269',
    title: 'Improper Privilege Management (Privilege Escalation)',
    category: 'Broken Access Control',
    defaultVrtPriority: 'P1',
    summary: 'The application assigns, modifies, or evaluates privileges in a way that allows an unprivileged actor to gain administrative or super-user capabilities.',
    exploitMechanics: 'Attacker tampers with request bodies, hidden form fields, or OAuth parameters (e.g. role=admin) during account registration, profile updates, or token callbacks.',
    safeTestingTip: 'Verify privilege escalation by inspecting read-only administrative dashboards or viewing user roles; do not delete accounts, ban users, or modify production settings.',
    defensiveMitigation: 'Remove any client-side influence over role assignment. Role assignments must only be executed through authenticated administrator workflows and verified against authoritative backend records.'
  },
  {
    cweId: 'CWE-307',
    title: 'Improper Restriction of Excessive Authentication Attempts',
    category: 'Identification and Authentication Failures',
    defaultVrtPriority: 'P4',
    summary: 'The application does not properly restrict the number of failed authentication attempts, allowing password guessing or MFA code enumeration.',
    exploitMechanics: 'Attacker leverages distributed concurrent requests or IP rotation to bypass sequential attempt counters, exploiting race conditions in cache stores.',
    safeTestingTip: 'Send small proof bursts (under 50 requests) against your own registered test account to demonstrate counter inconsistency without degrading server availability.',
    defensiveMitigation: 'Implement distributed atomic rate limiters using Redis Lua scripts or token buckets. Trigger progressive lockouts and invalidate verification sessions after threshold breaches.'
  }
];
