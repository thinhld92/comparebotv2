// src/utils/priceComparator.js
const _ = require('lodash');
const StandardPrice = require('../models/StandardPrice');
const DiffPrice = require('../models/DiffPrice');
const priceCache = require('./priceCache'); // Import priceCache
const Action = require('../constants/Action');
const recommendService = require('../services/recommendService');
const logger = require('../config/logger');


const comparePrices = async () => {
  try {
    // Lấy StandardPrice từ cache
    let latestStandard = priceCache.getLatestStandardPrice();
    if (!latestStandard) {
      // Nếu không có trong cache, lấy từ database
      latestStandard = await StandardPrice.findOne({
        order: [['id', 'DESC']],
      });
      if (latestStandard) {
        priceCache.setLatestStandardPrice(latestStandard); // Cập nhật cache
      }
    }

    // Lấy DiffPrice từ cache
    let latestDiff = priceCache.getLatestDiffPrice();
    if (!latestDiff) {
      // Nếu không có trong cache, lấy từ database
      latestDiff = await DiffPrice.findOne({
        order: [['id', 'DESC']],
      });
      if (latestDiff) {
        priceCache.setLatestDiffPrice(latestDiff); // Cập nhật cache
      }
    }

    const currentTime = Date.now()
    if (!latestStandard || !latestDiff 
      || currentTime - latestStandard.createdAt.getTime() > process.env.MAX_LAST_TIME 
      || currentTime - latestDiff.createdAt.getTime() > process.env.MAX_LAST_TIME) {
        logger.info('Không đủ dữ liệu để so sánh giá');
        return;
    }

    let diff = -1;
    let closeRecommend = Action.NONE;
    // cắt lệnh sell
    if ((latestStandard.bidPrice - latestDiff.askPrice) >= process.env.CLOSE_POINT) {
        closeRecommend = Action.CLOSE_SELL;
        diff = latestStandard.bidPrice - latestDiff.askPrice;
    }

    // cắt lệnh buy
    if ((latestDiff.bidPrice - latestStandard.askPrice) >= process.env.CLOSE_POINT) {
        closeRecommend = Action.CLOSE_BUY;
        diff = latestDiff.bidPrice - latestStandard.askPrice;
    }

    // sell
    let orderRecommend = Action.NONE
    
    if ((latestDiff.bidPrice - latestStandard.askPrice) >= process.env.ENTRY_POINT) {
        orderRecommend = Action.SELL;
        diff = latestDiff.bidPrice - latestStandard.askPrice;
    }
    // buy
    if ((latestStandard.bidPrice - latestDiff.askPrice) >= process.env.ENTRY_POINT) {
        orderRecommend = Action.BUY;
        diff = latestStandard.bidPrice - latestDiff.askPrice;
    }
    
    if (orderRecommend === Action.NONE && closeRecommend === Action.NONE) {
      return
    }
    const data = {};
    data.createdAt = new Date();
    data.symbol = latestStandard.symbol;
    data.standardServer = latestStandard.server;
    data.diffServer = latestDiff.server;
    data.askStandardPrice = latestStandard.askPrice;
    data.bidStandardPrice = latestStandard.bidPrice;
    data.askDiffPrice = latestDiff.askPrice;
    data.bidDiffPrice = latestDiff.bidPrice;
    data.diff = diff;
    data.orderRecommend = orderRecommend;
    data.closeRecommend = closeRecommend;
    data.brokerTime = latestStandard.brokerTime;
    await recommendService.create(data);
  } catch (error) {
    logger.error('Lỗi khi so sánh giá:', error);
  }
};

// Áp dụng debounce với thời gian từ .env (mặc định 400ms)
const debouncedComparePrices = _.debounce(comparePrices, parseInt(process.env.TIME_STABLE) || 400);

module.exports = {
  comparePrices,         // Xuất hàm gốc nếu cần dùng trực tiếp
  debouncedComparePrices // Xuất hàm đã debounce để dùng trong services
};