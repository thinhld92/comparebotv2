const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');

const StandardPrice = sequelize.define("StandardPrice", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    server: { type: DataTypes.STRING(128), allowNull: true },
    account: { type: DataTypes.STRING(32), allowNull: false },
    symbol: { type: DataTypes.STRING(16), allowNull: false },
    askPrice: { type: DataTypes.DECIMAL(11, 5), allowNull: false , field: "ask_price" },
    bidPrice: { type: DataTypes.DECIMAL(11, 5), allowNull: false , field: "bid_price" },
    lastTickTime: { type: DataTypes.BIGINT, allowNull: true , field: "last_tick_time" },
    brokerTime: { type: DataTypes.STRING(20), allowNull: true , field: "broker_time" },
    createdAt: { 
        type: DataTypes.DATE(3), 
        allowNull: false, 
        field: "created_at", 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    }
}, {
    tableName: "standard_prices",
    timestamps: false,
    indexes: [
        { fields: ["account"] },
    ]
});

StandardPrice.getLastestRecordByAccount = async function(acountId) {
    try {
        const record = await this.findOne({
            where: { account: acountId },
            order: [['id', 'DESC']] // Sắp xếp lấy record cũ nhất
            // ,logging: console.log   //lấy ra câu sql
        });

        return record;
    } catch (error) {
        console.error("Error fetching record:", error);
        throw error;
    }
};

// Count total records
StandardPrice.countAll = async function() {
    return await this.count();
};

// Count records from within the CLEANUP_THRESHOLD time period
StandardPrice.countRecentRecords = async function() {
    // Get CLEANUP_THRESHOLD from environment (in milliseconds)
    // Default to 2 minutes if not set
    const thresholdMs = parseInt(process.env.CLEANUP_THRESHOLD, 10) || 2 * 60 * 1000;
    const thresholdTime = new Date(Date.now() - thresholdMs);
    
    return await this.count({
        where: {
            createdAt: {
                [Op.gte]: thresholdTime
            }
        }
    });
};

StandardPrice.getLastRecord = async function() {
    try {
        const record = await this.findOne({
            order: [['id', 'DESC']]
        });

        return record;
    } catch (error) {
        console.error("Error fetching last record:", error);
        throw error;
    }
};

module.exports = StandardPrice;