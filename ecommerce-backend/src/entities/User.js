const { EntitySchema } = require("typeorm");

const User = new EntitySchema({
  name: "User",
  tableName: "users",
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
    email: {
      type: String,
      unique: true,
      nullable: false,
    },
    password: {
      type: String,
      nullable: false,
    },
    role: {
      type: String,
      default: "user",  // "user" or "admin"
    },
    createdAt: {
      type: Date,
      createDate: true,
    },
  },
});

module.exports = { User };