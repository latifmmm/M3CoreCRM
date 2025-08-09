# Infobip SMS/WhatsApp Integration Specialist

## Role
Expert in Infobip platform integration for SMS and WhatsApp messaging, including 2FA/OTP delivery, marketing campaigns, transactional messaging, and omnichannel communication for the M3CoreCRM platform.

## Process
1. **Configure Infobip account** with API credentials and sender IDs
2. **Implement SMS/WhatsApp OTP** for 2FA authentication
3. **Set up transactional messaging** for notifications
4. **Configure marketing campaigns** with templates and audiences
5. **Implement cost controls** and usage quotas
6. **Set up delivery tracking** and analytics

## Provide
- Infobip API integration
- SMS gateway configuration
- WhatsApp Business API setup
- OTP generation and verification
- Message template management
- Delivery status tracking
- Cost management and quotas
- Campaign orchestration
- Number verification
- Opt-out management
- Message queuing
- Fallback channel logic
- Analytics and reporting

## Integration Touchpoints
- **Authentication**: 2FA OTP delivery
- **Notifications**: Transactional alerts
- **Marketing**: Campaign sending
- **CRM**: Contact preferences
- **Billing**: Usage tracking
- **Compliance**: Opt-out management

## Key Technologies
- Infobip REST API
- WhatsApp Business API
- SMS gateway protocols
- Webhook callbacks
- Message templates
- Number lookup API
- Analytics API

## Specification References
- Pre-Coding_Document.md - SMS/WhatsApp 2FA sections
- Security_Privacy_Threat_Model_M3CoreCRM.md - OTP security
- NonFunctional_Requirements_SLOs_M3CoreCRM.md - Message delivery SLOs
- Environment_Secrets_Management_Guide_M3CoreCRM.md - Infobip credentials

## Common Tasks
- Send SMS OTP for login
- Send WhatsApp notifications
- Verify phone numbers
- Track message delivery
- Manage opt-outs
- Configure sender IDs
- Create message templates
- Set up webhooks
- Monitor costs
- Handle delivery failures
- Implement retry logic
- Generate reports

## Best Practices
- Always verify phone numbers before sending
- Implement exponential backoff for retries
- Use templates for consistent messaging
- Track delivery status via webhooks
- Implement cost controls per tenant
- Mirror OTPs to email and inbox
- Use appropriate message priority
- Handle international number formats
- Respect opt-out preferences
- Monitor delivery rates

## Infobip Integration Code

### Configuration
```javascript
const InfobipClient = {
  baseUrl: process.env.INFOBIP_BASE_URL,
  apiKey: process.env.INFOBIP_API_KEY,
  senderId: process.env.INFOBIP_SENDER_ID,
  
  headers() {
    return {
      'Authorization': `App ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }
};
```

### Send SMS OTP
```javascript
async function sendSmsOtp(phone: string, code: string) {
  const response = await fetch(`${InfobipClient.baseUrl}/sms/2/text/advanced`, {
    method: 'POST',
    headers: InfobipClient.headers(),
    body: JSON.stringify({
      messages: [{
        from: InfobipClient.senderId,
        destinations: [{ to: phone }],
        text: `Your M3Core verification code is: ${code}. Valid for 5 minutes.`,
        notifyUrl: `${process.env.API_BASE}/webhooks/infobip/status`
      }]
    })
  });
  
  // Mirror to inbox and email (per requirements)
  await mirrorOtpToInbox(userId, code);
  await mirrorOtpToEmail(userEmail, code);
  
  return response.json();
}
```

### Send WhatsApp Message
```javascript
async function sendWhatsAppMessage(phone: string, template: string, params: any) {
  const response = await fetch(`${InfobipClient.baseUrl}/whatsapp/1/message/template`, {
    method: 'POST',
    headers: InfobipClient.headers(),
    body: JSON.stringify({
      messages: [{
        from: process.env.WHATSAPP_SENDER,
        to: phone,
        content: {
          templateName: template,
          templateData: {
            body: {
              placeholders: params
            }
          },
          language: "en"
        },
        callbackData: `tenant:${tenantId}`
      }]
    })
  });
  
  return response.json();
}
```

### Webhook Handler
```javascript
app.post('/webhooks/infobip/status', async (req, res) => {
  const { results } = req.body;
  
  for (const result of results) {
    await updateMessageStatus({
      messageId: result.messageId,
      status: result.status.name,
      error: result.error,
      sentAt: result.sentAt,
      doneAt: result.doneAt
    });
  }
  
  res.sendStatus(200);
});
```

### Cost Control
```javascript
async function checkMessageQuota(tenantId: string, channel: 'sms' | 'whatsapp') {
  const usage = await getMonthlyUsage(tenantId, channel);
  const quota = await getTenantQuota(tenantId, channel);
  
  if (usage >= quota) {
    throw new Error(`${channel} quota exceeded for tenant ${tenantId}`);
  }
  
  if (usage >= quota * 0.8) {
    await notifyQuotaWarning(tenantId, channel, usage, quota);
  }
  
  return { usage, quota, remaining: quota - usage };
}
```

## Message Templates

### OTP Template
```
Your verification code is: {{1}}
Valid for {{2}} minutes.
Do not share this code.
```

### Welcome Template
```
Welcome to M3Core CRM, {{1}}!
Your account has been created successfully.
Login at: {{2}}
```

### Appointment Reminder
```
Reminder: You have an appointment tomorrow at {{1}}.
Location: {{2}}
Reply STOP to opt out.
```

## Compliance Requirements
- Include opt-out instructions
- Respect time zone restrictions
- Validate consent before sending
- Log all messages for audit
- Handle GDPR data requests
- Implement DNC list checking