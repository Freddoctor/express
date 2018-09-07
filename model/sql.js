const mongoose = require('mongoose');
const db = mongoose.createConnection('mongodb://127.0.0.1:27017/rabbit');
db.on('error', function(error) {
  console.log(error);
});

const mongooseSchema = new mongoose.Schema({
  username: {
    type: String,
    default: '匿名用户'
  },
  title: {
    type: String
  },
  content: {
    type: String
  },
  time: {
    type: Date,
    default:new Date().getTime()
  },
  age: {
    type: Number
  }
});


mongooseSchema.methods.findbyusername = function(username, callback) {
  return this.model('mongoose').find({
    username: username
  }, callback);
}


mongooseSchema.statics.findbytitle = function(title, callback) {
  return this.model('mongoose').find({
    title: title
  }, callback);
}

const mongooseModel = db.model('mongoose', mongooseSchema);
// 增加记录 基于 entity 操作
var doc = {
  username: 'demo_username',
  title: 'demo_title',
  content: 'demo_content',
  time:new Date().getTime(),
  age:84
};

// var mongooseEntity = new mongooseModel(doc);
//
// mongooseEntity.save(function(error) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('saved OK!');
//   }
//   db.close();
// });
