const productService = require('../services/productService')

class ProductController {
  async getAllProducts(req, res) {
    try {
      const filters = {
        category: req.query.category,
        is_active: req.query.is_active === 'false' ? false : req.query.is_active === 'true' ? true : undefined,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        search: req.query.search
      }
      
      const products = await productService.getAllProducts(filters)
      res.json(products)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error: error.message })
    }
  }

  async getProductById(req, res) {
    try {
      const product = await productService.getProductById(parseInt(req.params.id))
      if (!product) {
        return res.status(404).json({ message: 'Product not found' })
      }
      res.json(product)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching product', error: error.message })
    }
  }

  async createProduct(req, res) {
    try {
      const product = await productService.createProduct(req.body)
      res.status(201).json(product)
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ message: 'SKU already exists' })
      }
      res.status(500).json({ message: 'Error creating product', error: error.message })
    }
  }

  async updateProduct(req, res) {
    try {
      const product = await productService.getProductById(parseInt(req.params.id))
      if (!product) {
        return res.status(404).json({ message: 'Product not found' })
      }
      
      const updatedProduct = await productService.updateProduct(parseInt(req.params.id), req.body)
      res.json(updatedProduct)
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ message: 'SKU already exists' })
      }
      res.status(500).json({ message: 'Error updating product', error: error.message })
    }
  }

  async deleteProduct(req, res) {
    try {
      const product = await productService.getProductById(parseInt(req.params.id))
      if (!product) {
        return res.status(404).json({ message: 'Product not found' })
      }
      
      await productService.deleteProduct(parseInt(req.params.id))
      res.json({ message: 'Product deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Error deleting product', error: error.message })
    }
  }

  async updateStock(req, res) {
    try {
      const { quantity } = req.body
      
      if (typeof quantity !== 'number') {
        return res.status(400).json({ message: 'Quantity must be a number' })
      }
      
      const product = await productService.updateStock(parseInt(req.params.id), quantity)
      res.json(product)
    } catch (error) {
      if (error.message === 'Product not found') {
        return res.status(404).json({ message: 'Product not found' })
      }
      if (error.message === 'Insufficient stock') {
        return res.status(400).json({ message: 'Insufficient stock' })
      }
      res.status(500).json({ message: 'Error updating stock', error: error.message })
    }
  }
}

module.exports = new ProductController()
