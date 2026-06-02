const userService = require('../services/userService')

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers()
      res.json(users)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error: error.message })
    }
  }

  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(parseInt(req.params.id))
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.json(user)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error: error.message })
    }
  }

  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body)
      res.status(201).json(user)
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ message: 'Email already exists' })
      }
      res.status(500).json({ message: 'Error creating user', error: error.message })
    }
  }

  async updateUser(req, res) {
    try {
      const user = await userService.getUserById(parseInt(req.params.id))
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      const updatedUser = await userService.updateUser(parseInt(req.params.id), req.body)
      const { password, ...userWithoutPassword } = updatedUser
      res.json(userWithoutPassword)
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ message: 'Email already exists' })
      }
      res.status(500).json({ message: 'Error updating user', error: error.message })
    }
  }

  async deleteUser(req, res) {
    try {
      const user = await userService.deleteUser(parseInt(req.params.id))
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.json(user)
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error: error.message })
    }
  }

  async signup(req, res) {
    try {
      const user = await userService.signup(req.body)
      res.status(201).json({ message: 'User registered successfully', user })
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ message: 'Email already exists' })
      }
      res.status(500).json({ message: 'Error registering user', error: error.message })
    }
  }

  async login(req, res) {
    try {
      const result = await userService.login(req.body.email, req.body.password)
      res.status(200).json({
        message: 'Login successful',
        data: result
      })
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ message: 'User not found' })
      }
      if (error.message === 'Invalid password') {
        return res.status(401).json({ message: 'Invalid credentials' })
      }
      res.status(500).json({ message: 'Error logging in', error: error.message })
    }
  }

  async changePassword(req, res) {
    try {
      const result = await userService.changePassword(
        parseInt(req.params.id),
        req.body.currentPassword,
        req.body.newPassword
      )
      res.status(200).json(result)
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ message: 'User not found' })
      }
      if (error.message === 'Current password is incorrect') {
        return res.status(401).json({ message: 'Current password is incorrect' })
      }
      if (error.message === 'User has no password set') {
        return res.status(400).json({ message: 'User has no password set' })
      }
      res.status(500).json({ message: 'Error changing password', error: error.message })
    }
  }
}

module.exports = new UserController()
