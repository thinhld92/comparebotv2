const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');

const Position = sequelize.define("Position", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    server: { type: DataTypes.STRING(50), allowNull: true, },
    account: { type: DataTypes.STRING(50), allowNull: true, },
    symbol: { type: DataTypes.STRING(16), allowNull: false },
    recommendIdPos: { type: DataTypes.INTEGER, allowNull: true, field: "recommend_id_pos" },
    askPrice: { type: DataTypes.DECIMAL(11, 5), allowNull: false , field: "ask_price" },
    bidPrice: { type: DataTypes.DECIMAL(11, 5), allowNull: false , field: "bid_price" },
    positionType: {type: DataTypes.STRING(10), allowNull: true, field: "position_type" },
    ticket: {type: DataTypes.BIGINT, allowNull: true },
    volume: {type: DataTypes.DOUBLE, allowNull: true },
    positionOpen: {type: DataTypes.DECIMAL(11, 5), allowNull: true, field: "position_open" },
    positionClose: {type: DataTypes.DECIMAL(11, 5), allowNull: true, field: "position_close" },
    recommendIdClose: { type: DataTypes.INTEGER, allowNull: true, field: "recommend_id_close" },
    createdAt: { 
        type: DataTypes.DATE(3),
        allowNull: false, 
        field: "created_at", 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    }
}, {
    tableName: "positions",
    timestamps: false,
    indexes: [
        { fields: ["server"] },
        { fields: ["ticket"] },
        { fields: ["account", "recommend_id_pos"] },
    ]
});

Position.getPositionsByTickets = async (ticketList) => {
    try {
        const positions = await Position.findAll({
            where: {
                ticket: {
                    [Op.in]: ticketList  // Điều kiện tìm kiếm tất cả các ticket trong danh sách
                }
            }
        });
        return positions;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

Position.getPositionsByAccountAndRecId = async (account, recId) => {
    try {
        const position = await Position.findOne({
            where: {
                account: account,
                recommendIdPos: recId,
            }
        });
        return position;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};


module.exports = Position;