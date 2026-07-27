import { ProductEntity } from './../entities';

export interface IProductRepository {
  getProductById(id: string): Promise<ProductEntity>;
  getProductsByCategoryId(categoryId: string): Promise<ProductEntity[]>;
  getProductByManufactorId(manufactorId: string): Promise<ProductEntity[]>;
  createProduct(product: ProductEntity): Promise<ProductEntity>;
  updateProduct(updatedProduct: ProductEntity): Promise<ProductEntity>;
  deleteProductById(id: string): Promise<ProductEntity>;
}

export const PRODUCT_REPO = Symbol('PRODUCT_REPO');
