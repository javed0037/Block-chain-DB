
const mongoose = require('mongoose');
global.Promise = mongoose.Promise;
const Schema = mongoose.Schema;

let transactionSchema = new Schema({    
transactionId:{type:String},
steps:{type:String}
});
module.exports = mongoose.model('transaction', transactionSchema);

