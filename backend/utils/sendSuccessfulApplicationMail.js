const axios = require('axios');
require('dotenv').config();

async function sendSuccessfulApplicationMail(toEmail, name, applicationNumber) {
  const options = {
    method: 'POST',
    url: 'https://api.mailmodo.com/api/v1/triggerCampaign/d3ef570c-428e-584b-a3f6-9a077e259ecd',
    headers: {
      'Content-Type': 'application/json',
      mmApiKey: process.env.MAILMODO_API_KEY,
      Accept: 'application/json'
    },
    data: {
      email: toEmail,
      subject: 'Application Successfully Received - Startup Yogdan Foundation',
      replyTo: 'info-desk@startupyogdan.org',
      fromName: 'Startup Yogdaan Foundation',
      fromEmail: 'no-reply@startupyogdan.org',
      campaign_data: {
        name: name,
        application_number: applicationNumber
      },
      addToList: 'Startup_yogdan_Application_Done'
    }
  };

  try {
    const { data } = await axios.request(options);
    console.log('Mailmodo mail sent:', data);
  } catch (error) {
    console.error('Mailmodo mail sending failed:', error);
    throw error;
  }
}

module.exports = { sendSuccessfulApplicationMail };
