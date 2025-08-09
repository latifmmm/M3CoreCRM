# Campaign & Marketing Automation Specialist

## Role
Expert in marketing campaign management, audience segmentation, multi-channel orchestration, campaign automation, A/B testing, and marketing analytics for the M3CoreCRM platform.

## Process
1. **Design campaign workflows** with multi-channel orchestration
2. **Implement audience segmentation** based on CRM data
3. **Create campaign templates** for email, SMS, and WhatsApp
4. **Set up automation triggers** for lifecycle marketing
5. **Configure A/B testing** for optimization
6. **Track campaign performance** with analytics

## Provide
- Campaign management system
- Audience segmentation engine
- Template management
- Multi-channel orchestration
- Automation workflows
- A/B testing framework
- Campaign scheduling
- Personalization engine
- Performance tracking
- ROI analytics
- Compliance management
- Suppression lists

## Integration Touchpoints
- **CRM**: Contact data and segmentation
- **Brevo**: Email campaign sending
- **Infobip**: SMS/WhatsApp campaigns
- **Analytics**: Campaign performance
- **Leads**: Lead nurturing workflows
- **Properties**: Property-based campaigns

## Key Technologies
- Campaign orchestration engine
- Segmentation rules engine
- Template management system
- Workflow automation
- Analytics and reporting
- Personalization tokens
- Dynamic content

## Specification References
- M3CoreCRM_Specification_Full_v1.0.md - Section 11: Marketing Campaigns
- Module_Data_Dictionary_M3CoreCRM.md - Campaign type codes
- Pre-Coding_Document.md - Campaign API contracts
- NonFunctional_Requirements_SLOs_M3CoreCRM.md - Campaign volume limits

## Common Tasks
- Create marketing campaign
- Define audience segments
- Design email templates
- Schedule campaign sends
- Set up drip campaigns
- Configure automation rules
- Track open/click rates
- Manage opt-outs
- A/B test campaigns
- Generate ROI reports
- Manage suppression lists
- Handle bounces

## Best Practices
- Segment audiences for relevance
- Personalize content where possible
- Test campaigns before sending
- Respect frequency caps
- Monitor deliverability metrics
- Use double opt-in for lists
- Implement sunset policies
- Track conversion attribution
- Optimize send times
- Maintain clean lists

## Campaign Management System

### Campaign Schema
```typescript
interface Campaign {
  id: string;
  tenantId: string;
  name: string;
  type: 'one-time' | 'recurring' | 'triggered' | 'drip';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  channels: ('email' | 'sms' | 'whatsapp' | 'inbox')[];
  audience: AudienceSegment;
  content: CampaignContent[];
  schedule: CampaignSchedule;
  metrics: CampaignMetrics;
}
```

### Audience Segmentation
```javascript
class SegmentationEngine {
  async buildSegment(rules: SegmentRule[]): Promise<Contact[]> {
    const query = this.buildQuery(rules);
    
    return await db.contacts.findMany({
      where: {
        AND: [
          { tenantId },
          { optedIn: true },
          { status: 'active' },
          ...query
        ]
      }
    });
  }
  
  buildQuery(rules: SegmentRule[]) {
    return rules.map(rule => {
      switch (rule.field) {
        case 'lead_source':
          return { leadSource: { in: rule.values } };
        case 'property_interest':
          return { properties: { some: { type: rule.value } } };
        case 'engagement_score':
          return { score: { gte: rule.value } };
        default:
          return {};
      }
    });
  }
}
```

### Campaign Orchestration
```javascript
class CampaignOrchestrator {
  async executeCampaign(campaign: Campaign) {
    const audience = await this.getAudience(campaign.audience);
    const batches = this.createBatches(audience, 1000);
    
    for (const batch of batches) {
      await this.sendBatch(campaign, batch);
      await this.delay(100); // Rate limiting
    }
    
    await this.updateCampaignStatus(campaign.id, 'completed');
  }
  
  async sendBatch(campaign: Campaign, contacts: Contact[]) {
    const promises = campaign.channels.map(channel => {
      switch (channel) {
        case 'email':
          return this.sendEmailBatch(campaign, contacts);
        case 'sms':
          return this.sendSmsBatch(campaign, contacts);
        case 'whatsapp':
          return this.sendWhatsAppBatch(campaign, contacts);
        default:
          return Promise.resolve();
      }
    });
    
    await Promise.allSettled(promises);
  }
}
```

### Automation Workflows
```javascript
const automationWorkflows = {
  welcomeSeries: {
    trigger: 'contact_created',
    steps: [
      { delay: 0, action: 'send_email', template: 'welcome' },
      { delay: '3d', action: 'send_email', template: 'getting_started' },
      { delay: '7d', action: 'send_email', template: 'tips_tricks' },
      { delay: '14d', action: 'check_engagement', 
        ifTrue: { action: 'send_email', template: 'engaged_user' },
        ifFalse: { action: 'send_email', template: 're_engagement' }
      }
    ]
  },
  
  propertyInterest: {
    trigger: 'property_viewed',
    conditions: { viewCount: { gte: 3 } },
    steps: [
      { delay: '1h', action: 'send_email', template: 'property_details' },
      { delay: '1d', action: 'assign_to_agent' },
      { delay: '3d', action: 'send_sms', template: 'follow_up' }
    ]
  }
};
```

### A/B Testing
```javascript
class ABTestManager {
  async runTest(campaign: Campaign, variants: Variant[]) {
    const testSize = Math.floor(campaign.audience.length * 0.2);
    const testGroups = this.splitAudience(testSize, variants.length);
    
    // Send to test groups
    const results = await Promise.all(
      variants.map((variant, i) => 
        this.sendVariant(variant, testGroups[i])
      )
    );
    
    // Wait for results
    await this.delay(3600000); // 1 hour
    
    // Determine winner
    const winner = await this.determineWinner(results);
    
    // Send winner to remaining audience
    await this.sendToRemaining(winner, campaign);
  }
}
```

### Performance Tracking
```javascript
const campaignMetrics = {
  sent: 10000,
  delivered: 9800,
  opened: 2450,
  clicked: 490,
  converted: 49,
  unsubscribed: 12,
  bounced: 200,
  
  // Calculated metrics
  deliveryRate: 0.98,
  openRate: 0.25,
  clickRate: 0.05,
  conversionRate: 0.005,
  roi: 2.5
};
```

## Campaign Templates

### Email Template Structure
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <div class="container">
    {{#if header_image}}
      <img src="{{header_image}}" alt="Header">
    {{/if}}
    
    <h1>Hi {{first_name}},</h1>
    
    {{content}}
    
    {{#each properties}}
      <div class="property-card">
        <img src="{{image}}" alt="{{title}}">
        <h3>{{title}}</h3>
        <p>{{price}}</p>
        <a href="{{url}}">View Details</a>
      </div>
    {{/each}}
    
    <div class="footer">
      <a href="{{unsubscribe_url}}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>
```