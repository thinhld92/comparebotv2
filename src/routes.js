const standardPriceController = require('./controllers/StandardPriceController');
const diffPriceController = require('./controllers/DiffPriceController');
const recommendController = require('./controllers/RecommendController');
const positionController = require('./controllers/PositionController');

const handlers = {
  '/standard-price/create': standardPriceController.create,
  '/standard-price/get': standardPriceController.get,
  '/diff-price/create': diffPriceController.create,
  '/diff-price/get': diffPriceController.get,
  '/recommend/get': recommendController.getLast,
  '/position/create': positionController.create,
  '/position/close': positionController.close,
};

module.exports = handlers;