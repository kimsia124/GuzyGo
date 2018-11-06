const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
  time : { type : Date, default: Date.now },
  type: { type: String },
  amount: { type: Number }
})

const productSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    amount: {
      type: Number,
      required: true,
      defalut: 0,
      min: 0,
    },
    history: [HistorySchema]
});

module.exports = mongoose.model('product', productSchema);