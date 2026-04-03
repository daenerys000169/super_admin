const axios = require('axios');
require('dotenv').config();

async function sendEventRegistrationMail(toEmail, name, attendees) {
    const options = {
        method: 'POST',
        url: 'https://api.mailmodo.com/api/v1/triggerCampaign/dfcaf458-9108-553e-92ad-514c9b755f25',
        headers: {
            'Content-Type': 'application/json',
            mmApiKey: process.env.MAILMODO_API_KEY,
            Accept: 'application/json'
        },
        data: {
            email: toEmail,
            subject: 'Event Registration Successful - Startup Yogdan Foundation',
            replyTo: 'info-desk@startupyogdan.com',
            fromName: 'Startup Yogdaan Foundation',
            fromEmail: 'no-reply@startupyogdan.com',
            campaign_data: {
                name: name,
                attendees: attendees
            },
            addToList: 'Event_Registration_Done'
        }
    };

    try {
        const { data } = await axios.request(options);
        console.log('Event registration mail sent:', data);
        return data;
    } catch (error) {
        console.error('Event registration mail sending failed:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = { sendEventRegistrationMail };
