// services/diffPriceService.js
const Position = require('../models/Position');
const Recommend = require('../models/Recommend');
const telegramService = require('../services/telegramService');

module.exports = {
  create: async (data) => {
    try {
      data.createdAt = new Date();
      data.positionType = +data.positionType === 0 ? "Buy" : "Sell"; 
      data.recommendIdPos = data.recommendId;
   
      const newPosition = await Position.create(data, { logging: false });
      
      setImmediate(async () => {
        const recommend = await Recommend.findByPk(data.recommendId);
        if (recommend && newPosition) {
          const teleMessage = `${newPosition.symbol}||${newPosition.positionType}||${newPosition.bidPrice}||${newPosition.askPrice}||${parseFloat(recommend.diff).toFixed(3)}||${newPosition.positionOpen}`;
          // telegramService.sendMessage(teleMessage);
        }
      });

      return { status: 200, message: "new position", id: newPosition.id };
    } catch (error) {
      console.log(error.message);
      
      return { status: 401, message: error.message };
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
  close: async (data) => {
    try {
      if (!data.length) {
        return { status: 300, message: "data not founded"};
      }

      const updatePromises = data.map(async (item) => {
        const { ticket, positionClose, recommendId } = item;
    
        // Cập nhật order với ticket và positionClose
        const [affectedCount] = await Position.update(
            { positionClose, recommendIdClose:recommendId }, // Dữ liệu muốn cập nhật
            {
            where: { ticket }, // Điều kiện tìm kiếm theo ticket
            }
        );
    
        // Kiểm tra xem có cập nhật được record nào không
        if (affectedCount === 0) {
          console.log(`No record found for ticket: ${ticket}`);
          return false; // Trả về false nếu không cập nhật được
        } else {
          console.log(`Successfully updated ticket: ${ticket}`);
          return true; // Trả về true nếu cập nhật thành công
        }
      });
      const results = await Promise.all(updatePromises);

      setImmediate(async () => {
        const tickets = data.map(item => item.ticket);
        const positions = await Position.getPositionsByTickets(tickets);
        if (positions.length > 0) {
          let teleMessage = '';
          for (const position of positions) {
            const recommend = await Recommend.findByPk(position.recommendIdClose);
            if (position && recommend) {
              teleMessage += `${position.symbol}||Close ${position.positionType}||${parseFloat(recommend.diff).toFixed(3)}||${position.ticket}\n`;
            }
          }
          // telegramService.sendMessage(teleMessage);
        }
      });

      const successCount = results.filter(result => result === true).length;
      if (successCount === 0) {
        return { status: 404, message: "No records updated" };
      } else if (successCount < data.length) {
        return { status: 200, message: `Partially updated (${successCount}/${data.length} records)` };
      } else {
        return { status: 200, message: "Update successful" };
      }

    } catch (error) {
      return { status: 401, message: error.message };
    }
  }
};