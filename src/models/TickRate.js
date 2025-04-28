const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');

const TickRate = sequelize.define("TickRate", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    symbol: { type: DataTypes.STRING(16), allowNull: false },
    standardServer: { type: DataTypes.STRING(50), allowNull: true, field: "standard_server" },
    diffServer: { type: DataTypes.STRING(50), allowNull: true, field: "diff_server" },
    standardRate: {type: DataTypes.INTEGER, allowNull: true, field: "standard_rate" },
    diffRate: {type: DataTypes.INTEGER, allowNull: true, field: "diff_rate" },
    brokerTime: { type: DataTypes.STRING(50), allowNull: true , field: "broker_time" },
    createdAt: { 
        type: DataTypes.DATE(3), 
        allowNull: false, 
        field: "created_at", 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    }
}, {
    tableName: "tick_rates",
    timestamps: false,
    indexes: [
        { fields: ['symbol'] },
        { fields: ['created_at'] },
        { fields: ['symbol', 'created_at'] }
    ]
});

module.exports = TickRate;