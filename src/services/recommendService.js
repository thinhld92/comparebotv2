// services/diffPriceService.js
const Recommend = require('../models/Recommend');
const priceCache = require('../utils/priceCache'); // Import priceCache

module.exports = {
  create: async (data) => {
    try {
      const newRecommend = await Recommend.create(data, { logging: false });
      priceCache.setLatestRecommend(newRecommend);
      return { status: 201, message: "Created Recommend", id: newRecommend.id };
    } catch (error) {
      console.log(error.message);
      return { status: 406, message: error.message };
    }
  },
  getLast: async (data) => {
    try {
      let latestRecommend = priceCache.getLatestRecommend();
      if (!latestRecommend) {
        // Nếu không có trong cache, lấy từ database
        latestRecommend = await Recommend.findOne({
          order: [['id', 'DESC']],
        });
        if (latestRecommend) {
          priceCache.setLatestRecommend(latestRecommend); // Cập nhật cache
        }
      }
      
      if (!latestRecommend 
        || Date.now() - latestRecommend.createdAt.getTime() > process.env.MAX_REC_TIME) {
        return {
          status: 400,
          message: 'Khong ton tai de xuat', 
        };
      }

      if (latestRecommend.symbol.substring(0, 6) !== data.symbol.substring(0, 6)) {
        return {
          status: 400,
          message: 'Sai symbol lay gia!', 
        };
      }

      return {
        status: 200,
        message: 'recommend', 
        orderRecommend:latestRecommend.orderRecommend,
        closeRecommend:latestRecommend.closeRecommend,
        recommendId:latestRecommend.id,
      };
    } catch (error) {
      console.log(error.message);
      return { status: 500, message: error.message };
    }
  },
};