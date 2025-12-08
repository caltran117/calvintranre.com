import axios from 'axios';
import config from '../config/config.js';

/**
 * Salesforce Service
 * Handles OAuth authentication and API calls to Salesforce
 */

// Cache for access token
let cachedToken = null;
let tokenExpiry = null;

/**
 * Get OAuth access token from Salesforce
 * Uses client credentials flow
 */
const getAccessToken = async () => {
  try {
    // Return cached token if still valid
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
      return cachedToken;
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', config.salesforce.clientId);
    params.append('client_secret', config.salesforce.clientSecret);

    const response = await axios.post(
      config.salesforce.tokenUrl,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    cachedToken = {
      accessToken: response.data.access_token,
      instanceUrl: response.data.instance_url,
      tokenType: response.data.token_type
    };

    // Cache token for 1 hour (Salesforce tokens typically last 2 hours)
    tokenExpiry = Date.now() + (60 * 60 * 1000);

    return cachedToken;
  } catch (error) {
    console.error('Salesforce OAuth Error:', error.response?.data || error.message);
    throw new Error(`Failed to authenticate with Salesforce: ${error.response?.data?.error_description || error.message}`);
  }
};

/**
 * Map interest type to Salesforce Opportunity_Type__c values
 */
const mapInterestToOpportunityType = (interest) => {
  const mapping = {
    'buying': 'Buyer',
    'selling': 'Seller',
    'renting': 'Renter',
    'investing': 'Landlord',
    'other': 'Buyer' // Default to Buyer for 'other'
  };
  return mapping[interest] || 'Buyer';
};

/**
 * Create a Lead in Salesforce
 */
const createLead = async (contactData) => {
  try {
    const { accessToken, instanceUrl } = await getAccessToken();

    const payload = {
      FirstName: contactData.firstName,
      LastName: contactData.lastName,
      Email: contactData.email,
      Phone: contactData.phone || '',
      Company: 'Website',
      LeadSource: 'Web - Website Contact Form',
      Description: contactData.message,
      Opportunity_Type__c: mapInterestToOpportunityType(contactData.interest),
      Has_Opted_In_Newsletter__c: contactData.subscribeNewsletter || false
    };

    const response = await axios.post(
      `${instanceUrl}/services/data/${config.salesforce.apiVersion}/sobjects/Lead`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Salesforce Lead created:', response.data);
    return {
      success: true,
      leadId: response.data.id,
      data: response.data
    };
  } catch (error) {
    console.error('Salesforce Create Lead Error:', error.response?.data || error.message);

    // Don't throw error - just log it and return failure
    // This ensures the contact form still works even if Salesforce is down
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

/**
 * Upsert Contact in Salesforce (for newsletter subscribers)
 * Uses Subscriber_Key__c as external ID
 */
const upsertContact = async (contactData) => {
  try {
    const { accessToken, instanceUrl } = await getAccessToken();

    const lowercaseEmail = contactData.email.toLowerCase();

    const payload = {
      FirstName: contactData.firstName || '',
      Email: contactData.email,
      Newsletter_Subscriber__c: true,
      LeadSource: 'Newsletter',
      Subscriber_Key__c: lowercaseEmail
    };

    // PATCH request for upsert using external ID
    const response = await axios.patch(
      `${instanceUrl}/services/data/${config.salesforce.apiVersion}/sobjects/Contact/Subscriber_Key__c/${encodeURIComponent(lowercaseEmail)}`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Salesforce Contact upserted:', response.data);

    // Get the Contact ID from response or query
    let contactId = response.data.id;

    // If the response doesn't include the ID, query for it
    if (!contactId) {
      const queryResponse = await queryContactByEmail(lowercaseEmail);
      contactId = queryResponse?.contactId;
    }

    return {
      success: true,
      contactId: contactId,
      data: response.data
    };
  } catch (error) {
    console.error('Salesforce Upsert Contact Error:', error.response?.data || error.message);

    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

/**
 * Query Contact by Subscriber_Key__c (email)
 */
const queryContactByEmail = async (email) => {
  try {
    const { accessToken, instanceUrl } = await getAccessToken();

    const lowercaseEmail = email.toLowerCase();
    const query = `SELECT Id FROM Contact WHERE Subscriber_Key__c='${lowercaseEmail}' LIMIT 1`;

    const response = await axios.get(
      `${instanceUrl}/services/data/${config.salesforce.apiVersion}/query`,
      {
        params: { q: query },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.records && response.data.records.length > 0) {
      return {
        success: true,
        contactId: response.data.records[0].Id
      };
    }

    return {
      success: false,
      error: 'Contact not found'
    };
  } catch (error) {
    console.error('Salesforce Query Contact Error:', error.response?.data || error.message);

    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

/**
 * Add Contact to Campaign
 */
const addContactToCampaign = async (contactId) => {
  try {
    const { accessToken, instanceUrl } = await getAccessToken();

    const payload = {
      CampaignId: config.salesforce.campaignId,
      ContactId: contactId
    };

    const response = await axios.post(
      `${instanceUrl}/services/data/${config.salesforce.apiVersion}/sobjects/CampaignMember`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Contact added to Campaign:', response.data);

    return {
      success: true,
      campaignMemberId: response.data.id,
      data: response.data
    };
  } catch (error) {
    // Handle duplicate error gracefully (contact already in campaign)
    if (error.response?.data?.[0]?.errorCode === 'DUPLICATE_VALUE') {
      console.log('Contact already exists in campaign');
      return {
        success: true,
        message: 'Contact already in campaign'
      };
    }

    console.error('Salesforce Add to Campaign Error:', error.response?.data || error.message);

    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

/**
 * Process Newsletter Subscription
 * Upserts contact and adds to campaign
 */
const processNewsletterSubscription = async (contactData) => {
  try {
    // Step 1: Upsert the contact
    const upsertResult = await upsertContact(contactData);

    if (!upsertResult.success) {
      return upsertResult;
    }

    // Step 2: Add to campaign if we have a contact ID
    if (upsertResult.contactId) {
      const campaignResult = await addContactToCampaign(upsertResult.contactId);

      return {
        success: true,
        contactId: upsertResult.contactId,
        campaignMemberId: campaignResult.campaignMemberId,
        message: 'Newsletter subscription processed successfully'
      };
    }

    return upsertResult;
  } catch (error) {
    console.error('Salesforce Newsletter Processing Error:', error.message);

    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  getAccessToken,
  createLead,
  upsertContact,
  queryContactByEmail,
  addContactToCampaign,
  processNewsletterSubscription
};
