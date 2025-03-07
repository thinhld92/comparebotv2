// services/telegramService.js
const axios = require('axios');
require('dotenv').config(); // Load các biến môi trường từ file .env

const sendMessage = async (message) => {
  if (process.env.SEND_TELEGRAM !== 'true') {
    console.log('Tính năng gửi Telegram bị tắt.');
    return;
  }

  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text: message
    });
    console.log('Tin nhắn đã được gửi lên Telegram');
  } catch (error) {
    console.error('Lỗi khi gửi tin nhắn Telegram:', error.message);
  }
};

module.exports = {
  sendMessage
};