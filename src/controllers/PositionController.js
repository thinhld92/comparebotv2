// controllers/diffPriceController.js
const positionService = require('../services/positionService');

module.exports = {
  create: async (socket, data) => {
    const result = await positionService.create(data);
    socket.write(JSON.stringify(result));
  },
  close: async (socket, data) => {
    const result = await positionService.close(data);
    socket.write(JSON.stringify(result));
  },
};