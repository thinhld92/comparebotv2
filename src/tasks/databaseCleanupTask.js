// src/tasks/databaseCleanupTask.js
const cron = require('node-cron');
const standardPriceService = require('../services/standardPriceService');
const diffPriceService = require('../services/diffPriceService');

const cleanupDatabase = async () => {
  try {
    // Cleanup StandardPrice
    await standardPriceService.cleanupRecords();
    // Cleanup DiffPrice
    await diffPriceService.cleanupRecords();
    console.log('Cleanup database hoàn tất cho cả StandardPrice và DiffPrice');
  } catch (error) {
    console.error('Lỗi khi cleanup database:', error);
  }
};

// Lên lịch chạy theo CLEANUP_INTERVAL từ .env (mặc định 5 phút)
const intervalMinutes = parseInt(process.env.CLEANUP_INTERVAL) || 5; // Lấy từ .env, mặc định 5 phút
const cronExpression = `*/${intervalMinutes} * * * *`; // Tạo cron expression (chạy mỗi X phút)

cron.schedule(cronExpression, cleanupDatabase);

// Xuất hàm để gọi thủ công nếu cần
module.exports = {
  cleanupDatabase,
};