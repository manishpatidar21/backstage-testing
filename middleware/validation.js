const { z } = require('zod')

const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email format')
})

const updateUserSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  number: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits').optional()
})

const signupSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  number: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters')
})

const validateCreateUser = (req, res, next) => {
  try {
    const validated = createUserSchema.parse(req.body)
    req.body = validated
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      })
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

const validateUpdateUser = (req, res, next) => {
  try {
    const validated = updateUserSchema.parse(req.body)
    req.body = validated
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      })
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

const validateSignup = (req, res, next) => {
  try {
    const validated = signupSchema.parse(req.body)
    req.body = validated
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      })
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

const validateLogin = (req, res, next) => {
  try {
    const validated = loginSchema.parse(req.body)
    req.body = validated
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      })
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

const validateChangePassword = (req, res, next) => {
  try {
    const validated = changePasswordSchema.parse(req.body)
    req.body = validated
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      })
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
  validateCreateUser,
  validateUpdateUser,
  validateSignup,
  validateLogin,
  validateChangePassword
}
