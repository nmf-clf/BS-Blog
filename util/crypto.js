const crypto = require('crypto');

//const hash = crypto.createHash('md5');
//const hash = crypto.createHash('sha256');

//hash.update('test');
//console.log(hash.digest('hex'));

const hmac = crypto.createHmac('sha256','sadasdafasdasdasd');
hmac.update('test');
console.log(hmac.digest('hex'));
