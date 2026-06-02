const { EntitySchema } = require('typeorm')

const UserSchema = new EntitySchema({
  name: 'User',
  tableName: 'users',
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
    email: {
      type: 'text',
      nullable: false,
      unique: true
    },
    number: {
      type: 'text',
      nullable: true
    },
    password: {
      type: 'text',
      nullable: true
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

module.exports = UserSchema
