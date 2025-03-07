// src/config/logger.js
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Định dạng log tùy chỉnh
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  level: 'info', // Mức log tối thiểu (info trở lên sẽ được ghi)
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Thêm thời gian
    colorize(), // Thêm màu sắc cho console
    logFormat // Áp dụng định dạng tùy chỉnh
  ),
  transports: [
    // Ghi log ra console
    new transports.Console(),
    // Ghi log ra file
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Chỉ ghi lỗi
    new transports.File({ filename: 'logs/combined.log' }) // Ghi tất cả log
  ],
});

// Xuất logger để sử dụng ở các file khác
module.exports = logger;