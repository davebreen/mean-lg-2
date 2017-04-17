var path = require('path')
exports.mainIndex = function(req, res) {
    res.sendFile(path.resolve(__dirname+'/../index.html'));
};
