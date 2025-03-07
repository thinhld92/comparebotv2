// services/diffPriceService.js
const { Op } = require('sequelize');
const priceCache = require('../utils/priceCache');
const DiffPrice = require('../models/DiffPrice');
const { debouncedComparePrices } = require('../utils/priceComparator');

module.exports = {
  create: async (data) => {
    try {
      data.createdAt = new Date();
      priceCache.setLatestDiffPrice(data);

      const newPrice = await DiffPrice.create(data, { logging: false });
      
      setImmediate(() => {
        debouncedComparePrices();
      });

      return { status: 'success', message: "Created Diff Price", id: newPrice.id };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  },
  get: async () => {
    try {
      const price = await DiffPrice.findOne(); // Ví dụ: lấy giá đầu tiên
      return { status: 'success', data: price };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  },
  cleanupRecords: async () => {
    try {
      const thresholdMinutes = parseInt(process.env.CLEANUP_THRESHOLD) || 3; // Lấy từ .env, mặc định 3 phút
      const thresholdTime = new Date(Date.now() - thresholdMinutes * 60 * 1000); // Chuyển thành thời gian
      const deletedCount = await DiffPrice.destroy({
        where: {
          createdAt: {
            [Op.lt]: thresholdTime,
          },
        },
      });
      console.log(`Cleanup hoàn tất: Đã xóa ${deletedCount} bản ghi DiffPrice cũ hơn ${thresholdMinutes} phút`);
      return deletedCount;
    } catch (error) {
      console.error('Lỗi khi cleanup DiffPrice:', error);
      throw error;
    }
  },
};