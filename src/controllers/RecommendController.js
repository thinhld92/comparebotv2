// controllers/diffPriceController.js
const recommendService = require('../services/recommendService');

module.exports = {
  getLast: async (socket, data) => {
    const result = await recommendService.getLast(data);
    socket.write(JSON.stringify(result));
  }
};