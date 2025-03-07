// src/utils/priceCache.js
let latestStandardPrice = null; // Lưu giá trị mới nhất của StandardPrice
let latestDiffPrice = null;     // Lưu giá trị mới nhất của DiffPrice
let latestRecommend = null;     // Lưu giá trị mới nhất của Reccomend

module.exports = {
  // Hàm lưu StandardPrice vào cache
  setLatestStandardPrice: (price) => {
    latestStandardPrice = price;
  },
  // Hàm lấy StandardPrice từ cache
  getLatestStandardPrice: () => latestStandardPrice,
  // Hàm lưu DiffPrice vào cache
  setLatestDiffPrice: (price) => {
    latestDiffPrice = price;
  },
  // Hàm lấy DiffPrice từ cache
  getLatestDiffPrice: () => latestDiffPrice,

  setLatestRecommend: (recommend) => {
    latestRecommend = recommend;
  },
  // Hàm lấy Recommend từ cache
  getLatestRecommend: () => latestRecommend,
};