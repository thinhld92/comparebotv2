// src/server.js
require('dotenv').config(); // Load biến môi trường từ file .env

const net = require('net');
const routes = require('./routes');
const sequelize = require('./config/database'); // Import Sequelize từ database.js
const logger = require('./config/logger'); // Import Winston logger
require('./tasks/databaseCleanupTask');

// Hàm đồng bộ cơ sở dữ liệu
async function syncDatabase() {
  try {
    await sequelize.sync({ force: process.env.FORCE_DB_SYNC === 'true' });
    console.log('Cơ sở dữ liệu đã được đồng bộ hóa');
  } catch (error) {
    console.log(error);
    
    logger.error('Lỗi khi đồng bộ hóa cơ sở dữ liệu:', error.message);
    process.exit(1); // Thoát nếu đồng bộ thất bại
  }
}

// Hàm khởi động server TCP
function startServer() {
  const server = net.createServer((socket) => {
    logger.info('Client đã kết nối');

    socket.on('data', (data) => {
      try {
        const request = JSON.parse(data.toString().trim());
        const handler = routes[request.path];

        if (handler) {
          handler(socket, request.data);
        } else {
          logger.warn(`Không tìm thấy handler cho path: ${request.path}`);
          socket.write(
            JSON.stringify({ status: 'error', message: 'Path không hợp lệ' })
          );
        }
      } catch (error) {
        logger.error(`Lỗi khi parse dữ liệu từ client: ${error.message}`);
        socket.write(
          JSON.stringify({ status: 'error', message: 'Dữ liệu không hợp lệ' })
        );
      }
    });

    socket.on('error', (err) => {
      logger.error(`Lỗi socket: ${err.message}`);
    });

    socket.on('end', () => {
      logger.info('Client đã ngắt kết nối');
    });
  });

  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => {
    logger.info(`Server running on port 127.0.0.1:${PORT}`);
  });

  server.on('error', (err) => {
    logger.error(`Lỗi server: ${err.message}`);
  });
}

// Hàm khởi động ứng dụng
async function init() {
  await syncDatabase();
  startServer();
}

// Chạy ứng dụng
init();