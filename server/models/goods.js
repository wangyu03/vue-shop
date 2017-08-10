var mongoose = require('mongoose')
var Schema = mongoose.Schema
var productSchema = new Schema({
  "productId" : String,
  "productName" : String,
  "salePrice" : Number,
  "productimage" : String
})

module.exports = mongoose.model("Goods", productSchema)
