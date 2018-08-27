var mongoose   = require('mongoose');
var Schema     = mongoose.Schema;

var TriangleSchema = new Schema({
    name: String,
    coordinates: JSON
});

module.exports = mongoose.model('Triangle', TriangleSchema);