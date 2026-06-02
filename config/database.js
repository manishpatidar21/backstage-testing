const { DataSource } = require('typeorm')
const path = require('path')
const UserSchema = require('../entities/User')
const ProductSchema = require('../entities/Product')

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.join(__dirname, '../db/users.db'),
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [UserSchema, ProductSchema]
})

module.exports = AppDataSource
