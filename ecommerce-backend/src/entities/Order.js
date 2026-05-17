// src/entities/Order.js
const { EntitySchema } = require("typeorm");

const Order = new EntitySchema({
  name: "Order",
  tableName: "orders",
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: "increment",
    },
    sessionId: {
      type: String,
      nullable: false,
    },
    customerName: {
      type: String,
      nullable: false,
    },
    customerEmail: {
      type: String,
      nullable: false,
    },
    customerAddress: {
      type: String,
      nullable: false,
    },
    totalAmount: {
      type: "float",
      nullable: false,
    },
    items: {
      type: "text",
      nullable: false,
    },
    status: {
      type: String,
      default: "pending",
    },
    createdAt: {
      type: Date,
      createDate: true,
    },
  },
});

module.exports = { Order };