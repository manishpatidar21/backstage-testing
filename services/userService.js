const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const AppDataSource = require('../config/database')

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key'

class UserService {
  constructor() {
    this.userRepository = null
  }

  async initialize() {
    this.userRepository = AppDataSource.getRepository('User')
  }

  async getAllUsers() {
    return await this.userRepository.find()
  }

  async getUserById(id) {
    return await this.userRepository.findOne({
      where: { id }
    })
  }

  async createUser(userData) {
    const user = this.userRepository.create(userData)
    return await this.userRepository.save(user)
  }

  async updateUser(id, userData) {
    await this.userRepository.update(id, userData)
    return await this.userRepository.findOne({
      where: { id }
    })
  }

  async deleteUser(id) {
    const user = await this.userRepository.findOne({
      where: { id }
    })
    if (user) {
      await this.userRepository.remove(user)
    }
    return user
  }

  async signup(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const user = this.userRepository.create({
      name: userData.name,
      email: userData.email,
      number: userData.number,
      password: hashedPassword
    })
    return await this.userRepository.save(user)
  }

  async login(email, password) {
    const user = await this.userRepository.findOne({
      where: { email }
    })

    if (!user) {
      throw new Error('User not found')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid password')
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    )

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      accessToken,
      refreshToken
    }
  }

  async changePassword(id, currentPassword, newPassword) {
    const user = await this.userRepository.findOne({
      where: { id }
    })

    if (!user) {
      throw new Error('User not found')
    }

    if (!user.password) {
      throw new Error('User has no password set')
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await this.userRepository.update(id, { password: hashedPassword })

    return {
      message: 'Password changed successfully'
    }
  }
}

module.exports = new UserService()
