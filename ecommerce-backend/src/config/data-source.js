require("reflect-metadata");
const { DataSource } = require("typeorm");
require("dotenv").config();

const { User } = require("../entities/User");
const { Product } = require("../entities/Product");
const { Cart } = require("../entities/Cart");
const { Order } = require("../entities/Order");

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,  // This will CREATE tables automatically!
  logging: true,
  entities: [User, Product, Cart, Order],
});

module.exports = { AppDataSource };