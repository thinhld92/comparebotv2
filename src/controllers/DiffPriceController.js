// controllers/diffPriceController.js
const diffPriceService = require('../services/diffPriceService');

module.exports = {
  create: async (socket, data) => {
    const result = await diffPriceService.create(data);
    socket.write(JSON.stringify(result));
  },
  get: async (socket) => {
    const result = await diffPriceService.get();
    socket.write(JSON.stringify(result));
  }
};