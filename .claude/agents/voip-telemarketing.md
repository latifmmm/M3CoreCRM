# VOIP & Telemarketing Integration Specialist

## Role
Expert in VOIP/PBX integration, call center functionality, click-to-dial features, call recording, IVR systems, and telemarketing workflows for the M3CoreCRM platform.

## Process
1. **Integrate VOIP/PBX system** with CRM for seamless calling
2. **Implement click-to-dial** functionality across the platform
3. **Set up call recording** with compliance and storage
4. **Configure IVR systems** for inbound call routing
5. **Build call center dashboards** for agent management
6. **Create telemarketing workflows** with scripts and tracking

## Provide
- VOIP/PBX integration
- Click-to-dial implementation
- Call recording system
- IVR configuration
- Call routing logic
- Agent queue management
- Call analytics
- Predictive dialing
- Call scripting
- Disposition tracking
- Call transfer features
- Conference calling
- Voicemail integration

## Integration Touchpoints
- **CRM**: Contact and lead records
- **Activities**: Call logging
- **Analytics**: Call metrics
- **Recording**: Storage system
- **Compliance**: Consent management
- **Billing**: Call usage tracking

## Key Technologies
- WebRTC for browser calling
- SIP protocols
- Asterisk/FreePBX
- Twilio Voice API (alternative)
- Audio streaming
- Call recording storage
- Real-time transcription

## Specification References
- M3CoreCRM_Specification_Full_v1.0.md - Section 16: Telemarketing & VoIP Integration
- Pre-Coding_Document.md - Telemarketing API contracts
- Security_Privacy_Threat_Model_M3CoreCRM.md - Call recording compliance
- Module_Data_Dictionary_M3CoreCRM.md - Call disposition codes

## Common Tasks
- Set up VOIP provider
- Configure SIP trunks
- Implement click-to-dial
- Set up call recording
- Create IVR menus
- Configure call queues
- Build agent dashboard
- Track call metrics
- Manage DNC lists
- Handle call transfers
- Set up voicemail
- Generate call reports

## Best Practices
- Always verify consent before recording
- Implement DNC list checking
- Use secure protocols (SRTP/TLS)
- Optimize codec selection
- Implement call quality monitoring
- Store recordings securely
- Provide agent training tools
- Track compliance requirements
- Monitor call costs
- Implement failover systems

## VOIP Integration Architecture

### WebRTC Implementation
```javascript
class WebRTCPhone {
  private peerConnection: RTCPeerConnection;
  private localStream: MediaStream;
  
  async initializeCall(phoneNumber: string) {
    // Get user media
    this.localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    });
    
    // Create peer connection
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: process.env.TURN_SERVER, 
          username: process.env.TURN_USER,
          credential: process.env.TURN_PASS }
      ]
    });
    
    // Add local stream
    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream);
    });
    
    // Create offer
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    
    // Send to signaling server
    await this.sendToServer({
      type: 'call',
      phoneNumber: phoneNumber,
      sdp: offer.sdp
    });
  }
}
```

### Click-to-Dial Integration
```javascript
// Add click-to-dial to all phone numbers
document.addEventListener('DOMContentLoaded', () => {
  const phoneRegex = /(\+?[0-9]{1,3}[-.\s]?\(?[0-9]{1,3}\)?[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,4})/g;
  
  document.querySelectorAll('[data-phone]').forEach(element => {
    const phone = element.dataset.phone;
    element.innerHTML = `
      <a href="tel:${phone}" class="click-to-dial">
        <i class="icon-phone"></i> ${phone}
      </a>
    `;
    
    element.addEventListener('click', (e) => {
      e.preventDefault();
      initiateCall(phone);
    });
  });
});

async function initiateCall(phoneNumber: string) {
  // Check agent availability
  const agent = await getAvailableAgent();
  if (!agent) {
    showNotification('No agents available');
    return;
  }
  
  // Start call
  const call = await startCall(phoneNumber, agent.extension);
  
  // Log activity
  await logCallActivity({
    contactId: getCurrentContactId(),
    phoneNumber,
    agentId: agent.id,
    direction: 'outbound',
    startTime: new Date()
  });
}
```

### Call Recording Management
```javascript
class CallRecorder {
  private mediaRecorder: MediaRecorder;
  private recordedChunks: Blob[] = [];
  
  async startRecording(stream: MediaStream, callId: string) {
    // Check consent
    const hasConsent = await checkRecordingConsent(callId);
    if (!hasConsent) {
      await playConsentPrompt();
      const consent = await waitForConsent();
      if (!consent) return;
    }
    
    // Start recording
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus'
    });
    
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };
    
    this.mediaRecorder.onstop = async () => {
      const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
      await this.uploadRecording(callId, blob);
    };
    
    this.mediaRecorder.start(1000); // Record in 1-second chunks
  }
  
  async uploadRecording(callId: string, blob: Blob) {
    const formData = new FormData();
    formData.append('recording', blob, `${callId}.webm`);
    formData.append('callId', callId);
    formData.append('duration', this.duration.toString());
    
    await fetch('/api/calls/recordings', {
      method: 'POST',
      body: formData
    });
  }
}
```

### IVR Configuration
```javascript
const ivrMenu = {
  welcome: {
    message: "Welcome to M3Core Real Estate. Press 1 for sales, 2 for support, 3 for billing.",
    options: {
      '1': { action: 'queue', queue: 'sales' },
      '2': { action: 'queue', queue: 'support' },
      '3': { action: 'queue', queue: 'billing' },
      '0': { action: 'operator' },
      '*': { action: 'repeat' }
    },
    timeout: 10,
    retries: 3
  },
  
  queues: {
    sales: {
      agents: ['ext-101', 'ext-102', 'ext-103'],
      strategy: 'round-robin',
      timeout: 30,
      overflow: 'voicemail'
    }
  }
};
```

### Call Center Dashboard
```javascript
interface AgentStatus {
  agentId: string;
  status: 'available' | 'busy' | 'break' | 'offline';
  currentCall?: {
    callId: string;
    phoneNumber: string;
    duration: number;
    queue: string;
  };
  stats: {
    callsToday: number;
    avgTalkTime: number;
    avgWaitTime: number;
    satisfaction: number;
  };
}

class CallCenterDashboard {
  async getRealtimeMetrics() {
    return {
      activeAgents: await this.getActiveAgents(),
      callsInQueue: await this.getQueuedCalls(),
      avgWaitTime: await this.getAvgWaitTime(),
      abandonRate: await this.getAbandonRate(),
      serviceLevel: await this.getServiceLevel(),
      agentUtilization: await this.getAgentUtilization()
    };
  }
}
```

### Predictive Dialer
```javascript
class PredictiveDialer {
  async startCampaign(campaign: DialerCampaign) {
    const contacts = await this.getContacts(campaign.listId);
    const agents = await this.getAvailableAgents();
    
    // Calculate optimal dial ratio
    const dialRatio = this.calculateDialRatio({
      avgTalkTime: campaign.avgTalkTime,
      answerRate: campaign.historicalAnswerRate,
      agentCount: agents.length
    });
    
    // Start dialing
    for (const batch of this.createBatches(contacts, dialRatio)) {
      await this.dialBatch(batch, agents);
      await this.waitForAgents();
    }
  }
  
  calculateDialRatio(params: DialerParams): number {
    // Aggressive: 3:1, Conservative: 1.5:1
    const baseRatio = params.answerRate < 0.3 ? 3 : 1.5;
    return Math.min(baseRatio * params.agentCount, 10);
  }
}
```

## Call Disposition Codes
```typescript
enum CallDisposition {
  ANSWERED = 'ANSWERED',
  NO_ANSWER = 'NO_ANSWER',
  BUSY = 'BUSY',
  VOICEMAIL = 'VOICEMAIL',
  CALLBACK = 'CALLBACK',
  INTERESTED = 'INTERESTED',
  NOT_INTERESTED = 'NOT_INTERESTED',
  DO_NOT_CALL = 'DO_NOT_CALL',
  WRONG_NUMBER = 'WRONG_NUMBER',
  DISCONNECTED = 'DISCONNECTED'
}
```