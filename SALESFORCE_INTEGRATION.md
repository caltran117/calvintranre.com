# Salesforce Integration Guide

This guide explains how to set up and test the Salesforce integration for the Calvin Tran Real Estate website.

## Overview

The website now integrates with Salesforce to automatically:
- **Create Leads** when users submit the contact form
- **Upsert Contacts** when users subscribe to the newsletter
- **Add Contacts to Campaign** for newsletter subscribers

## Features

- **Dual API Calls**: Both your existing email API and Salesforce API are called
- **Non-blocking**: Form submissions work even if Salesforce is down
- **Token Caching**: OAuth tokens are cached for 1 hour to minimize API calls
- **Error Handling**: Graceful error handling with detailed logging

## Setup Instructions

### 1. Environment Variables

Add the following to your `.env` file in the `server` directory:

```bash
# Salesforce Configuration
SALESFORCE_TOKEN_URL=https://calvintranre.my.salesforce.com/services/oauth2/token
SALESFORCE_CLIENT_ID=<YOUR_CLIENT_ID_HERE>
SALESFORCE_CLIENT_SECRET=<YOUR_CLIENT_SECRET_HERE>
SALESFORCE_API_VERSION=v61.0
SALESFORCE_CAMPAIGN_ID=701Pg00001TaC81IAF
```

**Important**: Replace `<YOUR_CLIENT_ID_HERE>` and `<YOUR_CLIENT_SECRET_HERE>` with your actual Salesforce credentials.

### 2. Install Dependencies

The integration uses `axios` which should already be installed. If not:

```bash
cd server
npm install axios
```

### 3. Restart Server

After adding the environment variables, restart your server:

```bash
cd server
npm start
```

## Testing with Postman

### Step 1: Import the Postman Collection

1. Open Postman
2. Click **Import**
3. Select `Salesforce_Integration_Tests.postman_collection.json` from the project root

### Step 2: Set Up Environment Variables

In Postman, create a new environment with these variables:

| Variable | Value |
|----------|-------|
| `TOKEN_URL` | `https://calvintranre.my.salesforce.com/services/oauth2/token` |
| `CLIENT_ID` | Your Salesforce Client ID |
| `CLIENT_SECRET` | Your Salesforce Client Secret |
| `INSTANCE_URL` | (will be auto-filled after token request) |
| `ACCESS_TOKEN` | (will be auto-filled after token request) |
| `API_VERSION` | `v61.0` |
| `CAMPAIGN_ID` | `701Pg00001TaC81IAF` |
| `CONTACT_ID` | (will be auto-filled during testing) |

### Step 3: Run the Requests in Order

1. **Get Access Token** - Authenticates and saves token
2. **Create Lead** - Tests lead creation from contact form
3. **Upsert Contact** - Tests newsletter contact upsert
4. **Get Contact by Email** - Queries contact ID
5. **Add Contact to Campaign** - Adds contact to newsletter campaign

## How It Works

### Contact Form Flow

When a user submits the contact form:

```
User Form Submission
        ↓
Backend API (/v1/contact)
        ↓
    ┌───────────────┬────────────────┐
    ↓               ↓                ↓
Save to DB    Email API    Salesforce Lead API
    ↓               ↓                ↓
 Success        Success          Success/Log Error
```

**Code Location**: `server/src/controller/Contact/contact.controller.js`

### Newsletter Subscription Flow

When a user subscribes to newsletter:

```
Newsletter Subscription
        ↓
Backend API (/v1/newsletter/subscribe)
        ↓
    ┌───────────────┬────────────────────────────┐
    ↓               ↓                            ↓
Save to DB    Email Service    Salesforce (Upsert + Campaign)
    ↓               ↓                            ↓
 Success        Success          Success/Log Error
```

**Code Location**: `server/src/controller/Newsletter/newsletter.controller.js`

## Field Mapping

### Contact Form → Salesforce Lead

| Form Field | Salesforce Field | Notes |
|------------|-----------------|-------|
| `firstName` | `FirstName` | Required |
| `lastName` | `LastName` | Required |
| `email` | `Email` | Required |
| `phone` | `Phone` | Optional |
| `message` | `Description` | Required |
| `interest` | `Opportunity_Type__c` | Mapped: buying→Buyer, selling→Seller, etc. |
| `subscribeNewsletter` | `Has_Opted_In_Newsletter__c` | Boolean |
| - | `Company` | Hardcoded to "Website" |
| - | `LeadSource` | Hardcoded to "Web - Website Contact Form" |

### Newsletter → Salesforce Contact

| Form Field | Salesforce Field | Notes |
|------------|-----------------|-------|
| `firstName` | `FirstName` | Optional |
| `email` | `Email` | Required |
| `email` (lowercase) | `Subscriber_Key__c` | External ID for upsert |
| - | `Newsletter_Subscriber__c` | Set to `true` |
| - | `LeadSource` | Set to "Newsletter" |

## API Endpoints

### Salesforce OAuth

**Endpoint**: `POST https://calvintranre.my.salesforce.com/services/oauth2/token`

**Request**:
```
grant_type=client_credentials
client_id={YOUR_CLIENT_ID}
client_secret={YOUR_CLIENT_SECRET}
```

**Response**:
```json
{
  "access_token": "00Dxx...",
  "instance_url": "https://calvintranre.my.salesforce.com",
  "token_type": "Bearer"
}
```

### Create Lead

**Endpoint**: `POST {instance_url}/services/data/v61.0/sobjects/Lead`

**Headers**:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body**:
```json
{
  "FirstName": "John",
  "LastName": "Doe",
  "Email": "john@example.com",
  "Phone": "424-555-0123",
  "Company": "Website",
  "LeadSource": "Web - Website Contact Form",
  "Description": "Message from contact form",
  "Opportunity_Type__c": "Buyer",
  "Has_Opted_In_Newsletter__c": true
}
```

### Upsert Contact

**Endpoint**: `PATCH {instance_url}/services/data/v61.0/sobjects/Contact/Subscriber_Key__c/{lowercase_email}`

**Headers**:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body**:
```json
{
  "FirstName": "Jane",
  "Email": "jane@example.com",
  "Newsletter_Subscriber__c": true,
  "LeadSource": "Newsletter",
  "Subscriber_Key__c": "jane@example.com"
}
```

### Add to Campaign

**Endpoint**: `POST {instance_url}/services/data/v61.0/sobjects/CampaignMember`

**Headers**:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body**:
```json
{
  "CampaignId": "701Pg00001TaC81IAF",
  "ContactId": "003XXXXXXXXXXXX"
}
```

## Service Module

The Salesforce integration is handled by `server/src/service/salesforce.service.js`

**Key Functions**:

- `getAccessToken()` - Authenticates with Salesforce (cached for 1 hour)
- `createLead(contactData)` - Creates a Lead from contact form
- `upsertContact(contactData)` - Upserts a Contact for newsletter
- `queryContactByEmail(email)` - Queries Contact by email
- `addContactToCampaign(contactId)` - Adds Contact to campaign
- `processNewsletterSubscription(contactData)` - Complete newsletter flow

## Error Handling

- All Salesforce errors are logged but don't block form submissions
- If Salesforce is unavailable, the form still saves to your database
- Token refresh is automatic when expired
- Duplicate campaign members are handled gracefully

## Monitoring

Check server logs for Salesforce integration status:

**Success**:
```
Salesforce Lead created successfully: 00QXXXXXXXXXXXX
Salesforce newsletter subscription processed: { contactId: '003XX...', campaignMemberId: '00vXX...' }
```

**Errors**:
```
Failed to create Salesforce Lead: { error details }
Salesforce OAuth Error: { error details }
```

## Troubleshooting

### Issue: "Failed to authenticate with Salesforce"

**Solution**: Check that your `SALESFORCE_CLIENT_ID` and `SALESFORCE_CLIENT_SECRET` are correct in `.env`

### Issue: "DUPLICATE_VALUE" error

**Solution**: This is normal when a Contact is already in the campaign. It's handled gracefully.

### Issue: Missing custom fields error

**Solution**: Ensure your Salesforce org has the custom fields:
- `Opportunity_Type__c` on Lead
- `Has_Opted_In_Newsletter__c` on Lead
- `Newsletter_Subscriber__c` on Contact
- `Subscriber_Key__c` on Contact (must be External ID)

### Issue: Form works but no leads in Salesforce

**Solution**:
1. Check server logs for errors
2. Verify credentials in `.env`
3. Test with Postman collection to isolate the issue

## Security Notes

- Never commit `.env` file with real credentials
- Credentials are only used server-side
- Token is cached in memory (cleared on server restart)
- All API calls use HTTPS

## Production Deployment

Before going live:

1. ✅ Add production Salesforce credentials to `.env`
2. ✅ Test all flows with Postman
3. ✅ Submit test contact form and verify Lead created in Salesforce
4. ✅ Subscribe to newsletter and verify Contact + Campaign Member created
5. ✅ Monitor server logs for any errors

## Support

For Salesforce API documentation:
- [REST API Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/)
- [OAuth 2.0 Guide](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_flows.htm)

## Files Modified/Created

**Created**:
- `server/src/service/salesforce.service.js` - Salesforce integration service
- `Salesforce_Integration_Tests.postman_collection.json` - Postman test collection
- `SALESFORCE_INTEGRATION.md` - This documentation

**Modified**:
- `server/.env.example` - Added Salesforce configuration
- `server/src/config/config.js` - Added Salesforce config
- `server/src/controller/Contact/contact.controller.js` - Added Salesforce Lead creation
- `server/src/controller/Newsletter/newsletter.controller.js` - Added Salesforce Contact upsert

---

**Integration Status**: ✅ Ready for Testing

**Next Steps**: Add your Salesforce credentials to `.env` and test with Postman!
