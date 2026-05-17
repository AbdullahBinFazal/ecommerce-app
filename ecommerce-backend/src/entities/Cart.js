const { EntitySchema } = require("typeorm");

const Cart = new EntitySchema({
  name: "Cart",
  tableName: "carts",
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
    productId: {
      type: Number,
      nullable: false,
    },
    productName: {
      type: String,
      nullable: false,
    },
    price: {
      type: "float",  // Changed from decimal to float for easier handling
      nullable: false,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    imageUrl: {
      type: String,
      nullable: true,
    },
    createdAt: {
      type: Date,
      createDate: true,
    },
  },
});

module.exports = { Cart };