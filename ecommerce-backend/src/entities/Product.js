const { EntitySchema } = require("typeorm");

const Product = new EntitySchema({
  name: "Product",
  tableName: "products",
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: "increment",
    },
    name: {
      type: String,
      nullable: false,
    },
    price: {
      type: "decimal",  // ← CHANGE from Number to "decimal"
      precision: 10,
      scale: 2,
      nullable: false,
    },
    description: {
      type: String,
      nullable: true,
    },
    category: {
      type: String,
      nullable: false,
    },
    imageUrl: {
      type: String,
      nullable: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      createDate: true,
    },
  },
});

module.exports = { Product };