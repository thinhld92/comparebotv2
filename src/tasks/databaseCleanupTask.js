// src/tasks/databaseCleanupTask.js
const cron = require('node-cron');
const TickRate = require('../models/TickRate');
const telegramService = require('../services/telegramService');
const StandardPrice = require('../models/StandardPrice');
const DiffPrice = require('../models/DiffPrice');
const standardPriceService = require('../services/standardPriceService');
const diffPriceService = require('../services/diffPriceService');

const cleanupDatabase = async () => {
  try {
    // Tính toán số lượng bản ghi trong khoảng thời gian CLEANUP_THRESHOLD
    let totalStandardRecords = await StandardPrice.countAll();
    let recentStandardRecords = await StandardPrice.countRecentRecords();
    let lastStandardRecord = await StandardPrice.getLastRecord();

    let totalDiffRecords = await DiffPrice.countAll();
    let recentDiffRecords = await DiffPrice.countRecentRecords();
    let lastDiffRecord = await DiffPrice.getLastRecord();
    if (lastStandardRecord && lastDiffRecord) {
      let brokerTime = lastDiffRecord.brokerTime || lastStandardRecord.brokerTime || new Date().toISOString();
      // Create and save a new TickRate record before sending message
      const tickRateRecord = await TickRate.create({
        symbol: lastStandardRecord.symbol,
        standardServer: lastStandardRecord.server,
        diffServer: lastDiffRecord.server,
        standardRate: totalStandardRecords,
        diffRate: totalDiffRecords,
        brokerTime: brokerTime
      });

      setImmediate(async () => {
        const teleMessage = `${brokerTime}||${lastDiffRecord.server}-${totalDiffRecords}||${lastStandardRecord.server}-${totalStandardRecords}`;
        telegramService.sendMessage(teleMessage);
      });
    }

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