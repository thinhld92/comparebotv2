const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');

const Recommend = sequelize.define("Recommend", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    symbol: { type: DataTypes.STRING(16), allowNull: false },
    standardServer: { type: DataTypes.STRING(50), allowNull: true, field: "standard_server" },
    diffServer: { type: DataTypes.STRING(50), allowNull: true, field: "diff_server" },
    askStandardPrice: { type: DataTypes.DECIMAL(11, 5), allowNull: false , field: "ask_standard_price" },
    bidStandardPrice: { type: DataTypes.DECIMAL(11, 5), allowNull: false , field: "bid_standard_price" },
    askDiffPrice: { type: DataTypes.DECIMAL(11, 5), allowNull: false , field: "ask_diff_price" },
    bidDiffPrice: { type: DataTypes.DECIMAL(11, 5), allowNull: false , field: "bid_diff_price" },
    diff: {type: DataTypes.DECIMAL(11, 5), allowNull: false , field: "diff"},
    orderRecommend: {type: DataTypes.INTEGER, allowNull: true, field: "order_recommend" },
    closeRecommend: {type: DataTypes.INTEGER, allowNull: true, field: "close_recommend" },
    createdAt: { 
        type: DataTypes.DATE(3), 
        allowNull: false, 
        field: "created_at", 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    }
}, {
    tableName: "recommends",
    timestamps: false,
});

module.exports = Recommend;