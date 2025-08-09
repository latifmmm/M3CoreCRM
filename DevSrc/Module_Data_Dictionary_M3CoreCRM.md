# M3CoreCRM — Module Data Dictionary & Code Lists (v1)

> Purpose: Canonical codes and enumerations used across the platform to ensure consistent data capture and analytics.
> Scope: Leads, Contacts/Companies, Deals/Pipelines, Activities, Inventory (Projects/Units/Components), Notifications/Campaigns, Approvals/RBAC, Reports.

---

## 0) Conventions
- **Code format**: UPPER_SNAKE_CASE.
- **Stable IDs**: Codes are immutable once released (use `is_active` to deprecate).
- **Localization**: Display labels are localized by key `code.<GROUP>.<CODE>`.
- **Analytics**: All events reference **codes** not free text.

---

## 1) Leads

### 1.1 Lead Status Codes (`LEAD_STATUS`)
| Code | Label | Description |
| --- | --- | --- |
| NEW | New | Newly created lead |
| QUALIFIED | Qualified | Lead meets basic criteria |
| DISQUALIFIED | Disqualified | Not a fit / invalid |
| NURTURING | Nurturing | Scheduled follow-ups |
| CONVERTED | Converted | Converted to contact/company (and possibly deal) |

### 1.2 Lead Source Codes (`LEAD_SOURCE`)
| Code | Label | Description |
| --- | --- | --- |
| WEB_FORM | Website Form | Marketing website form submission |
| LANDING_PAGE | Landing Page | Campaign landing page |
| SOCIAL | Social | Social media (organic) |
| AD_PAID | Paid Ads | Paid acquisition (specify network in `source_detail`) |
| REFERRAL | Referral | Referred by contact/partner |
| CALL_IN | Inbound Call | Phone call created as lead |
| WALK_IN | Walk-in | In-person |
| IMPORT | Import | Bulk import / CSV |

---

## 2) Contacts & Companies

### 2.1 Contact Types (`CONTACT_TYPE`)
| Code | Label | Description |
| --- | --- | --- |
| INDIVIDUAL | Individual | Person contact |
| BROKER | Broker | Real estate broker/agent |
| PARTNER | Partner | Business partner |
| OWNER | Owner | Property owner |

### 2.2 Company Industries (`COMPANY_INDUSTRY`)
| Code | Label |
| --- | --- |
| REAL_ESTATE | Real Estate |
| CONSTRUCTION | Construction |
| FINANCE | Finance |
| HOSPITALITY | Hospitality |
| OTHER | Other |

---

## 3) Deals & Pipelines

### 3.1 Deal Stages (Generic) (`DEAL_STAGE`)
> Tenants may define pipelines; provide defaults below.
| Code | Label | Probability |
| --- | --- | ---: |
| NEW | New | 0 |
| QUALIFICATION | Qualification | 10 |
| PROPOSAL | Proposal | 40 |
| NEGOTIATION | Negotiation | 70 |
| WON | Won | 100 |
| LOST | Lost | 0 |

### 3.2 Deal Loss Reasons (`DEAL_LOSS_REASON`)
| Code | Label |
| --- | --- |
| PRICE | Price |
| TIMING | Timing |
| COMPETITOR | Competitor |
| NO_DECISION | No Decision |
| OTHER | Other |

---

## 4) Activities & Tasks

### 4.1 Activity Types (`ACTIVITY_TYPE`)
| Code | Label |
| --- | --- |
| CALL | Call |
| MEETING | Meeting |
| EMAIL | Email |
| SMS | SMS |
| WHATSAPP | WhatsApp |
| SITE_VISIT | Site Visit |
| TASK | Task |

### 4.2 Activity Status (`ACTIVITY_STATUS`)
| Code | Label |
| --- | --- |
| OPEN | Open |
| COMPLETED | Completed |
| CANCELED | Canceled |

---

## 5) Inventory (Projects, Units, Components)

### 5.1 Unit Types (`UNIT_TYPE`)
| Code | Label | Notes |
| --- | --- | --- |
| APT_STUDIO | Studio Apartment | |
| APT_1BR | 1 Bedroom Apartment | |
| APT_2BR | 2 Bedroom Apartment | |
| APT_3BR | 3 Bedroom Apartment | |
| VILLA_3BR | 3 Bedroom Villa | |
| VILLA_4BR | 4 Bedroom Villa | |
| TOWN_3BR | 3 Bedroom Townhouse | |
| RETAIL_S | Retail Small | < 50 m² |
| RETAIL_M | Retail Medium | 50–200 m² |
| RETAIL_L | Retail Large | > 200 m² |
| OFFICE_S | Office Small | < 80 m² |
| OFFICE_M | Office Medium | 80–200 m² |
| OFFICE_L | Office Large | > 200 m² |

### 5.2 Unit Component Types (`UNIT_COMPONENT_TYPE`)
| Code | Label |
| --- | --- |
| ROOM_BED | Bedroom |
| ROOM_LIVING | Living Room |
| ROOM_DINING | Dining Room |
| ROOM_KITCHEN | Kitchen |
| ROOM_BATH | Bathroom |
| BALCONY | Balcony |
| GARDEN | Garden |
| PARKING | Parking |

### 5.3 Unit Status (`UNIT_STATUS`)
| Code | Label |
| --- | --- |
| AVAILABLE | Available |
| RESERVED | Reserved |
| SOLD | Sold |
| OFF_PLAN | Off-plan |

### 5.4 Dimension Fields
- Unit: `dimensions.areaM2`, `dimensions.widthM`, `dimensions.lengthM`
- Component: `dimensions.areaM2`
- Validation: numbers ≥ 0; area derived checks optional.

---

## 6) Notifications & Campaigns

### 6.1 Channels (`CHANNEL`)
| Code | Label |
| --- | --- |
| INBOX | In‑App Inbox |
| EMAIL | Email |
| SMS | SMS |
| WHATSAPP | WhatsApp |

### 6.2 System Templates (`TEMPLATE_CODE`)
| Code | Channel(s) | Purpose |
| --- | --- | --- |
| WELCOME_AGENT | EMAIL, INBOX | New user welcome |
| OTP_LOGIN | SMS, WHATSAPP, EMAIL, INBOX | OTP for login/verification |
| DEAL_APPROVAL_REQUEST | INBOX, EMAIL | Approval requested |
| DEAL_APPROVED | INBOX, EMAIL | Decision notice |
| CAMPAIGN_SEND_SUMMARY | EMAIL | Campaign performance summary |

### 6.3 Consent Status (`CONSENT_STATUS`)
| Code | Label |
| --- | --- |
| OPT_IN | Opt‑in |
| OPT_OUT | Opt‑out |
| UNKNOWN | Unknown |

---

## 7) Approvals & RBAC

### 7.1 Approval Domains (`APPROVAL_DOMAIN`)
| Code | Label |
| --- | --- |
| DEAL_STAGE_MOVE | Deal Stage Move |
| DISCOUNT_APPLY | Apply Discount |
| BULK_SEND | Bulk Send (Campaign) |

### 7.2 Approval Decision (`APPROVAL_DECISION`)
| Code | Label |
| --- | --- |
| APPROVE | Approve |
| REJECT | Reject |

### 7.3 Permission Namespace Pattern
- `module.action` (examples):
  - `leads.read`, `leads.write`, `deals.read`, `deals.move_stage`
  - `inventory.read`, `inventory.write`
  - `notifications.send`, `notifications.template.manage`
  - `rbac.role.manage`, `approvals.policy.manage`

---

## 8) Reporting Codes

### 8.1 Report Codes (`REPORT_CODE`)
| Code | Label |
| --- | --- |
| DEALS_PIPELINE_SUMMARY | Deals: Pipeline Summary |
| LEADS_FUNNEL | Leads: Funnel |
| CAMPAIGN_PERFORMANCE | Campaign Performance |
| INVENTORY_AVAILABILITY | Inventory Availability |

---

## 9) Error Codes (API)
| Code | HTTP | Message |
| --- | ---: | --- |
| UNAUTHORIZED | 401 | Invalid or expired token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| RATE_LIMITED | 429 | Too many requests |
| VALIDATION_FAILED | 422 | Validation failed |
| CONFLICT | 409 | Conflict / duplicate |
| INTEGRATION_DOWN | 503 | Upstream provider unavailable |

---

## 10) Deprecation Policy
- Set `is_active=false`, keep code for ≥ 90 days.
- Provide mapping to replacement code when possible.
- Track usage; remove once no active references.

---

### Appendix A — Seed JSON Snippets

#### A.1 Unit Types
```json
[
  { "code": "APT_STUDIO", "label": "Studio Apartment", "is_active": true },
  { "code": "APT_1BR", "label": "1 Bedroom Apartment", "is_active": true },
  { "code": "APT_2BR", "label": "2 Bedroom Apartment", "is_active": true },
  { "code": "APT_3BR", "label": "3 Bedroom Apartment", "is_active": true },
  { "code": "VILLA_3BR", "label": "3 Bedroom Villa", "is_active": true },
  { "code": "VILLA_4BR", "label": "4 Bedroom Villa", "is_active": true }
]
```

#### A.2 Component Types
```json
[
  { "code": "ROOM_BED", "label": "Bedroom", "is_active": true },
  { "code": "ROOM_LIVING", "label": "Living Room", "is_active": true },
  { "code": "ROOM_BATH", "label": "Bathroom", "is_active": true },
  { "code": "BALCONY", "label": "Balcony", "is_active": true }
]
```
