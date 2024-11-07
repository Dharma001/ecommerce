import mongoose from "mongoose"
import { InvalidateCacheType } from "../types/types.js"
import { myCache } from "../app.js"
import { Product } from "../models/product.js"

export const connectDB = (uri: string) => {
  mongoose.connect(uri, {
    dbName: 'Ecommerce_24',
  }).then(c => console.log(`DB Connected to ${c.connection.host}`))
    .catch(e => console.log(e))
}

export const invalidateCache =async ({product,order,admin}: InvalidateCacheType) => {
  if(product) {
    const productKeys: string[] = ['categories','all-products','latest-products'];
    const products = await Product.find({}).select('_id');

    products.forEach(i => {
      productKeys.push(`product-${i._id}`);
    });
    myCache.del(productKeys)
  }

  if(order) {
    
  }

  if(admin) {
    
  }
}