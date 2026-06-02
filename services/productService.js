const AppDataSource = require('../config/database')

class ProductService {
  constructor() {
    this.productRepository = null
  }

  async initialize() {
    this.productRepository = AppDataSource.getRepository('Product')
  }

  async getAllProducts(filters = {}) {
    const query = this.productRepository.createQueryBuilder('product')
    
    if (filters.category) {
      query.andWhere('product.category = :category', { category: filters.category })
    }
    
    if (filters.is_active !== undefined) {
      query.andWhere('product.is_active = :is_active', { is_active: filters.is_active })
    }
    
    if (filters.minPrice) {
      query.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice })
    }
    
    if (filters.maxPrice) {
      query.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice })
    }
    
    if (filters.search) {
      query.andWhere(
        '(product.name LIKE :search OR product.description LIKE :search)',
        { search: `%${filters.search}%` }
      )
    }
    
    return await query.getMany()
  }

  async getProductById(id) {
    return await this.productRepository.findOne({
      where: { id }
    })
  }

  async getProductBySku(sku) {
    return await this.productRepository.findOne({
      where: { sku }
    })
  }

  async createProduct(productData) {
    const product = this.productRepository.create(productData)
    return await this.productRepository.save(product)
  }

  async updateProduct(id, productData) {
    await this.productRepository.update(id, productData)
    return await this.productRepository.findOne({
      where: { id }
    })
  }

  async deleteProduct(id) {
    const product = await this.productRepository.findOne({
      where: { id }
    })
    if (product) {
      await this.productRepository.remove(product)
    }
    return product
  }

  async updateStock(id, quantity) {
    const product = await this.getProductById(id)
    if (!product) {
      throw new Error('Product not found')
    }
    
    const newStock = product.stock + quantity
    if (newStock < 0) {
      throw new Error('Insufficient stock')
    }
    
    return await this.updateProduct(id, { stock: newStock })
  }
}

module.exports = new ProductService()
