const { EntitySchema } = require('typeorm')

const ProductSchema = new EntitySchema({
  name: 'Product',
  tableName: 'products',
  columns: {
    id: {
      primary: true,
      type: 'integer',
      generated: true
    },
    name: {
      type: 'text',
      nullable: false
    },
    description: {
      type: 'text',
      nullable: true
    },
    price: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: false
    },
    category: {
      type: 'text',
      nullable: true
    },
    stock: {
      type: 'integer',
      default: 0
    },
    sku: {
      type: 'text',
      nullable: true,
      unique: true
    },
    image_url: {
      type: 'text',
      nullable: true
    },
    is_active: {
      type: 'boolean',
      default: true
    },
    created_at: {
      type: 'datetime',
      createDate: true
    },
    updated_at: {
      type: 'datetime',
      updateDate: true
    }
  }
})

module.exports = ProductSchema
