import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import { NewProductRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";

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
  
  return res.status(200).json({
    success: true,
    message: 'Product updated successfully.'
  })
});

export const getlatestProducts = TryCatch(async (req, res, next) => {

  const products = await Product.find({})
                  .sort({createdAt: -1})
                  .limit(5);
  
  return res.status(201).json({
    success: true,
    products,
  })
});

export const getAdminProducts = TryCatch(async (req, res, next) => {

  const products = await Product.find({})
  
  return res.status(201).json({
    success: true,
    products,
  })
});

export const getAllCategories = TryCatch(async (req, res, next) => {

  const categories = await Product.distinct('category')
  
  return res.status(201).json({
    success: true,
    categories,
  })
});

export const getProduct = TryCatch(async (req, res, next) => {
  const id = req.params.id;

  const product = await Product.findById(id)

  if(!product) return next(new ErrorHandler('Invalid Id' , 400));
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
  return res.status(201).json({
    success: true,
    message: 'Product Deleted successfull!!',
    product,
  })
})

export const getAllProducts = TryCatch(async (req, res, next) => {

  const products = await Product.find({})
                  .sort({createdAt: -1})
                  .limit(5);
  
  return res.status(201).json({
    success: true,
    products,
  })
});