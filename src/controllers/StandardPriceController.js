// controllers/standardPriceController.js
const standardPriceService = require('../services/standardPriceService');

module.exports = {
  create: async (socket, data) => {
    const result = await standardPriceService.create(data);
    socket.write(JSON.stringify(result));
  },
  get: async (socket) => {
    const result = await standardPriceService.get();
    socket.write(JSON.stringify(result));
  }
};