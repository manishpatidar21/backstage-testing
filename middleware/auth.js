const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

const verifyToken = (req, res, next) => {
  try {
    console.log('verifyToken start')
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader

    const decoded = jwt.verify(token, JWT_SECRET)

    req.user = decoded
    console.log('verifyToken end')
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' })
    }
    res.status(401).json({ message: 'Authentication failed', error: error.message })
  }
}

module.exports = {
  verifyToken
}
