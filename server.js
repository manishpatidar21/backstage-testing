require('dotenv').config()
require('reflect-metadata')
const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerSpecs = require('./docs/swagger')
const userRoutes = require('./routes/user')
const productRoutes = require('./routes/product')
const AppDataSource = require('./config/database')
const userService = require('./services/userService')
const productService = require('./services/productService')

const app = express()
const PORT = process.env.PORT || 3000

console.log('Starting server initialization...')
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
console.log(`Port: ${PORT}`)

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

app.use('/users', userRoutes)
app.use('/products', productRoutes)

const startServer = async () => {
  try {
    console.log('Initializing database...')
    await AppDataSource.initialize()
    console.log('✓ Database initialized successfully')
    
    console.log('Initializing user service...')
    await userService.initialize()
    console.log('✓ User service initialized')
    
    console.log('Initializing product service...')
    await productService.initialize()
    console.log('✓ Product service initialized')
    
    const server = app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`)
      console.log(`✓ Swagger docs available at http://localhost:${PORT}/api-docs`)
    })

    server.on('error', (err) => {
      console.error('Server error:', err)
    })
  } catch (error) {
    console.error('✗ Error starting server:', error.message)
    console.error(error)
    process.exit(1)
  }
}

startServer()

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})
