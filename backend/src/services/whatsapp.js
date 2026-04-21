const sendMessage = async (to, message) => {
  const WA_TOKEN = process.env.WA_TOKEN;
  const WA_PHONE_ID = process.env.WA_PHONE_ID;
  if (!WA_TOKEN || !WA_PHONE_ID) {
    console.log('WA simule:', to, message.slice(0,50));
    return { simulated: true };
  }
  const axios = require('axios');
  const phone = to.replace(/[^0-9]/g, '');
  const res = await axios.post('https://graph.facebook.com/v18.0/' + WA_PHONE_ID + '/messages', {
    messaging_product: 'whatsapp', to: phone,
    type: 'text', text: { body: message }
  }, { headers: { Authorization: 'Bearer ' + WA_TOKEN } });
  return res.data;
};

const sendPaymentReminder = async (phone, name, student, amount, month, days) => {
  return sendMessage(phone, 'Bonjour ' + name + ', les frais de ' + student + ' pour ' + month + ' (' + amount + ' MAD) sont en attente. Merci de regulariser.');
};

const sendAbsenceAlert = async (phone, name, student, date) => {
  return sendMessage(phone, 'Bonjour ' + name + ', votre enfant ' + student + ' etait absent(e) le ' + date + '. Merci de nous contacter.');
};

module.exports = { sendMessage, sendPaymentReminder, sendAbsenceAlert };
