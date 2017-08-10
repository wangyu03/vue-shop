var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

// 连接数据库
mongoose.connect('mongodb://localhost:27019/shop');

// 当数据库连接成功的时候触发
mongoose.connection.on('connected', function() {
  console.log("Mongodb connected success");
})

// 当数据库连接失败的时候触发
mongoose.connection.on('error', function() {
  console.log("Mongodb connected fail");
})

// 当数据库关闭连接的时候触发
mongoose.connection.on('disonnected', function() {
  console.log("Mongodb connected disonnected");
})

router.get("/list", function(req, res, next) {
  let goodModel = Goods.find({}, function(err, docs) {
    console.log(docs);
    res.json({
      status: '0',
      result: docs
    })
  })
})

module.exports = router;
