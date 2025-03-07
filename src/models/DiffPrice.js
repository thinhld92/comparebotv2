const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DiffPrice = sequelize.define("DiffPrice", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    server: { type: DataTypes.STRING(128), allowNull: true },
    account: { type: DataTypes.STRING(32), allowNull: false },
    symbol: { type: DataTypes.STRING(16), allowNull: false },
    askPrice: { type: DataTypes.DECIMAL(11, 5), allowNull: false , field: "ask_price" },
    bidPrice: { type: DataTypes.DECIMAL(11, 5), allowNull: false , field: "bid_price" },
    lastTickTime: { type: DataTypes.BIGINT, allowNull: true , field: "last_tick_time" },
    createdAt: { 
        type: DataTypes.DATE(3), 
        allowNull: false, 
        field: "created_at", 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    }
}, {
    tableName: "diff_prices",
    timestamps: false,
    indexes: [
        { fields: ["account"] },
    ]
});

DiffPrice.getLastestRecordByAccount = async function(acountId) {
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

module.exports = DiffPrice;