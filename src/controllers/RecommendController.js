// controllers/diffPriceController.js
const recommendService = require('../services/recommendService');

module.exports = {
  getLast: async (socket) => {
    const result = await recommendService.getLast();
    socket.write(JSON.stringify(result));
  }
};