import axios from 'axios';
const mailmodoApiKey = import.meta.env.VITE_MAILMODO_API_KEY;


const sendScheduleInterviewMail = async (email, fullName, date, time) => {
  try {
    const options = {
      method: 'POST',
      url: 'https://api.mailmodo.com/api/v1/triggerCampaign/c996acb2-8516-5b5e-99cd-273e280b40dc',
      headers: {
        'Content-Type': 'application/json',
        mmApiKey: mailmodoApiKey,
        Accept: 'application/json'
      },
      data: {
        email: email,
        subject: 'Startup Yogdan Foundation – Invitation for Evaluation Meeting',
        replyTo: 'info@startupyogdan.org',
        fromName: 'Startup Yogdaan Foundation',
        fromEmail: 'no-reply@startupyogdan.org',
        campaign_data: {
          name: fullName,
          Custom1: date,   // scheduled date
          Custom2: time    // scheduled time
        },
        data: {},
        addToList: '595e6df8-6dd6-4729-8876-c63edff7349f'
      }
    };
    const { data } = await axios.request(options);
    console.log('Schedule mail sent:', data);
    return data;
  } catch (error) {
    if (error.response) {
      console.error('Mailmodo API error:', error.response.status, error.response.data);
    } else {
      console.error('Mailmodo request error:', error.message);
    }
    throw error;
  }

};

export default sendScheduleInterviewMail;
