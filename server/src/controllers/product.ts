import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";
// import { faker } from '@faker-js/faker'

export const getlatestProducts = TryCatch(async (req, res, next) => {

  let products;
  
  if(myCache.has('latest-products')) 
      products = JSON.parse(myCache.get('latest-products') as string)
  else {
    products = await Product.find({})
                  .sort({createdAt: -1})
                  .limit(5);
    myCache.set('latest-products', JSON.stringify(products));
  }
  return res.status(201).json({
    success: true,
    products,
  })
});

export const getAdminProducts = TryCatch(async (req, res, next) => {

  let products;

  if(myCache.has('all-products'))
    products = JSON.parse(myCache.get('all-products') as string);
  else {
    const products = await Product.find({});
    myCache.set('all-products' , JSON.stringify(products));
  }
  
  return res.status(201).json({
    success: true,
    products,
  })
});

export const getAllCategories = TryCatch(async (req, res, next) => {

  let categories;
  
  if(myCache.has('categories')) 
    categories = JSON.parse(myCache.get('categories') as string);
  else {
    const categories = await Product.distinct('category');
    myCache.set('categories', JSON.stringify(categories));
  }
  
  return res.status(201).json({
    success: true,
    categories,
  })
});

export const getProduct = TryCatch(async (req, res, next) => {

  let product;
  const id = req.params.id;
  if(myCache.has(`product-${id}`))
    product = JSON.parse(myCache.get(`product-${id}`) as string)
  else {
    const product = await Product.findById(id);
    if(!product) return next(new ErrorHandler('Product not found.' , 400));

    myCache.set(`product-${id}`, JSON.stringify(product))
  }

  return res.status(201).json({
    success: true,
    product,
  })
})

export const deleteProduct = TryCatch(async (req, res, next) => {
  const id = req.params.id;

  const product = await Product.findById(id)
  if(!product) return next(new ErrorHandler('Product not found' , 404));

  rm(product.photo!, () => {
    console.log('Product photo Deleted.')
  })

  await product?.deleteOne();

  await invalidateCache({ product: true });

  return res.status(201).json({
    success: true,
    message: 'Product Deleted successfull!!',
    product,
  })
})

export const getAllProducts = TryCatch(async (req: Request<{}, {}, SearchRequestQuery>, res, next) => {

  const {search, sort, category, price} = req.query;
  const page = Number(req.query.page) || 1;

  const limit = Number(process.env.PRODUCT_PER_PAGE || 8);
  const skip = limit * (page - 1);

  // $regex -> searches a pattern rather than specific word
  // options makes it small letters

  const baseQuery: BaseQuery = {}

  if(search) baseQuery.name = {
    $regex: String(search),
    $options: 'i',
  };

  if(price) baseQuery.price = {
    $lte: Number(price),
  };

  if(category) baseQuery.category = String(category);

  const productsPromise = Product.find(baseQuery)
    .sort(sort && { price:sort === 'asc' ? 1 : -1})
    .limit(limit)
    .skip(skip);

  const [products, filteredOnlyProduct] = await Promise.all([
    productsPromise,
    Product.find(baseQuery)
  ])

  const totalPage = Math.ceil(filteredOnlyProduct.length / limit);

  return res.status(201).json({
    success: true,
    products,
    totalPage
  });
});

export const newProduct = TryCatch(async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
  const {name, category, price, stock} = req.body;
  const photo = req.file;

  if(!photo) return next(new ErrorHandler('Please Add photo', 400))
  
  if (!name || !price || !stock || !category) {
    rm(photo.path,() => {
      console.log('File Deleted.')
    })
    return next(new ErrorHandler('Please enter all fields', 400))
  }

  await Product.create({
    name,
    category: category.toLowerCase(),
    stock,
    price,
    photo: photo?.path,
  });
  
  await invalidateCache({ product: true });

  return res.status(201).json({
    success: true,
    message: 'Product created successfully.'
  })
});

export const updateProduct = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const {name, category, price, stock} = req.body;
  const photo = req.file;
  const product = await Product.findById(id);

  if(!product) return next(new ErrorHandler('Invalid product Id', 400))
  
  if (photo) {
    rm(product.photo!,() => {
      console.log('Old Photo Deleted.');
    });
    product.photo = photo.path;
    return next(new ErrorHandler('Please enter all fields', 400))
  }

  if(name) product.name  = name;
  if(price) product.price = price;
  if(stock) product.stock = stock;
  if(category) product.category = category;
  
  await product.save();
  
  await invalidateCache({ product: true });

  return res.status(200).json({
    success: true,
    message: 'Product updated successfully.'
  })
});

// const generateRandomProducts = async ( count: number = 0) => {
//   const products = [];

//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: 'uploads\\9badab0d-d593-456f-913a-2abb0aaf417c.jpeg',
//       price: faker.commerce.price({ min:1500, max: 80000, dec: 0}),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0}),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     }

//     products.push(product);
//   }

//   console.log({status: true})
//   await Product.create(products);
// }

// generateRandomProducts(40);

// const deleteRandomProducts = async (count: number = 0) => {
//   const products = await Product.find({}).skip(2);

//   for( let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }

//   console.log({status: true})
// }
// deleteRandomProducts();