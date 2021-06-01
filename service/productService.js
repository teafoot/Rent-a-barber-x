const Product = require('../database/models/productModel');
const { formatMongoData, checkObjectID } = require('../helper/dbHelper');
const constants = require('../constants/index');

module.exports.createProduct = async (serviceData) => {
    try {
        let product = new Product({...serviceData});
        let result = await product.save();
        
        return formatMongoData(result);
    } catch (e) {
        console.log('Something went wrong: Service: createProduct', e);
        throw new Error(e);
    }
};

module.exports.getAllProducts = async ({ skip = 0, limit = 10}) => {
    try {
        let products = await Product.find({}).skip(parseInt(skip)).limit(parseInt(limit));

        return formatMongoData(products);
    } catch (e) {
        console.log('Something went wrong: Service: getAllProducts', e);
        throw new Error(e);
    }
};

module.exports.getProductById = async ({ id }) => {
  try {
    checkObjectID(id);
    let product = await Product.findById(id);
    
    if (!product) {
        throw new Error(constants.productMessage.PRODUCT_NOT_FOUND);
    }
    
    return formatMongoData(product);
  } catch (e) {
    console.log('Something went wrong: Service: getProductById', e);
    throw new Error(e);
  }
};

module.exports.updateProduct = async ({ id, updateInfo }) => {
  try {
    checkObjectID(id);
    let product = await Product.findOneAndUpdate({ _id: id }, updateInfo, { new: true });
    
    if (!product) {
        throw new Error(constants.productMessage.PRODUCT_NOT_FOUND);
    }
    
    return formatMongoData(product);
  } catch (e) {
    console.log('Something went wrong: Service: updateProduct', e);
    throw new Error(e);
  }
};

module.exports.deleteProduct = async ({ id }) => {
  try {
    checkObjectID(id);
    let product = await Product.findByIdAndDelete(id);
    
    if (!product) {
        throw new Error(constants.productMessage.PRODUCT_NOT_FOUND);
    }
    
    return formatMongoData(product);
  } catch (e) {
    console.log('Something went wrong: Service: deleteProduct', e);
    throw new Error(e);
  }
};



