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
  let sort = req.param('sort');
  let priceLevel = req.param('priceLevel');
  let priceGt = '', priceLte = '';
  let param = {};
  if (priceLevel != 'all') {
  	switch (priceLevel) {
	    case '0': priceGt = 0; priceLe = 100; break;
	    case '1': priceGt = 101; priceLe = 500; break;
	    case '2': priceGt = 501; priceLe = 1000; break;
	    case '3': priceGt = 1001; priceLe = 5000; break;
	  }
  }
  
  let param = {
    salePrice: {
    	$gt: priceGt,
    	$lte: priceLte
    }
  }
  let goodModel = Goods.find(param);
  
  goodModel.sort({'salePrice': sort})
    
  let goodModel = Goods.exec({}, function(err, docs) {
  //  console.log(docs);
    res.json({
      status: '0',
      result: docs
    })
  })
})

module.exports = router;
