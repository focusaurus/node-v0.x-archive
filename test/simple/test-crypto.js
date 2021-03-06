// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var common = require('../common');
var assert = require('assert');

try {
  var crypto = require('crypto');
} catch (e) {
  console.log('Not compiled with OPENSSL support.');
  process.exit();
}

var fs = require('fs');
var path = require('path');

// Test Certificates
var caPem = fs.readFileSync(common.fixturesDir + '/test_ca.pem', 'ascii');
var certPem = fs.readFileSync(common.fixturesDir + '/test_cert.pem', 'ascii');
var keyPem = fs.readFileSync(common.fixturesDir + '/test_key.pem', 'ascii');
var rsaPubPem = fs.readFileSync(common.fixturesDir + '/test_rsa_pubkey.pem', 'ascii');
var rsaKeyPem = fs.readFileSync(common.fixturesDir + '/test_rsa_privkey.pem', 'ascii');

try {
  var credentials = crypto.createCredentials(
                                             {key: keyPem,
                                               cert: certPem,
                                               ca: caPem});
} catch (e) {
  console.log('Not compiled with OPENSSL support.');
  process.exit();
}

// Test HMAC

var h1 = crypto.createHmac('sha1', 'Node')
               .update('some data')
               .update('to hmac')
               .digest('hex');
assert.equal(h1, '19fd6e1ba73d9ed2224dd5094a71babe85d9a892', 'test HMAC');

// Test HMAC-SHA-* (rfc 4231 Test Cases)
var rfc4231 = [
  {
    key: new Buffer('0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b', 'hex'),
    data: new Buffer('4869205468657265', 'hex'), // 'Hi There'
    hmac: {
      sha224: '896fb1128abbdf196832107cd49df33f47b4b1169912ba4f53684b22',
      sha256: 'b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7',
      sha384: 'afd03944d84895626b0825f4ab46907f15f9dadbe4101ec682aa034c7cebc59cfaea9ea9076ede7f4af152e8b2fa9cb6',
      sha512: '87aa7cdea5ef619d4ff0b4241a1d6cb02379f4e2ce4ec2787ad0b30545e17cdedaa833b7d6b8a702038b274eaea3f4e4be9d914eeb61f1702e696c203a126854',
    },
  },
  {
    key: new Buffer('4a656665', 'hex'), // 'Jefe'
    data: new Buffer('7768617420646f2079612077616e7420666f72206e6f7468696e673f', 'hex'), // 'what do ya want for nothing?'
    hmac: {
      sha224: 'a30e01098bc6dbbf45690f3a7e9e6d0f8bbea2a39e6148008fd05e44',
      sha256: '5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843',
      sha384: 'af45d2e376484031617f78d2b58a6b1b9c7ef464f5a01b47e42ec3736322445e8e2240ca5e69e2c78b3239ecfab21649',
      sha512: '164b7a7bfcf819e2e395fbe73b56e0a387bd64222e831fd610270cd7ea2505549758bf75c05a994a6d034f65f8f0e6fdcaeab1a34d4a6b4b636e070a38bce737',
    },
  },
  {
    key: new Buffer('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'hex'),
    data: new Buffer('dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd', 'hex'),
    hmac: {
      sha224: '7fb3cb3588c6c1f6ffa9694d7d6ad2649365b0c1f65d69d1ec8333ea',
      sha256: '773ea91e36800e46854db8ebd09181a72959098b3ef8c122d9635514ced565fe',
      sha384: '88062608d3e6ad8a0aa2ace014c8a86f0aa635d947ac9febe83ef4e55966144b2a5ab39dc13814b94e3ab6e101a34f27',
      sha512: 'fa73b0089d56a284efb0f0756c890be9b1b5dbdd8ee81a3655f83e33b2279d39bf3e848279a722c806b485a47e67c807b946a337bee8942674278859e13292fb',
    },
  },
  {
    key: new Buffer('0102030405060708090a0b0c0d0e0f10111213141516171819', 'hex'),
    data: new Buffer('cdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcd', 'hex'),
    hmac: {
      sha224: '6c11506874013cac6a2abc1bb382627cec6a90d86efc012de7afec5a',
      sha256: '82558a389a443c0ea4cc819899f2083a85f0faa3e578f8077a2e3ff46729665b',
      sha384: '3e8a69b7783c25851933ab6290af6ca77a9981480850009cc5577c6e1f573b4e6801dd23c4a7d679ccf8a386c674cffb',
      sha512: 'b0ba465637458c6990e5a8c5f61d4af7e576d97ff94b872de76f8050361ee3dba91ca5c11aa25eb4d679275cc5788063a5f19741120c4f2de2adebeb10a298dd',
    },
  },
  {
    key: new Buffer('0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c', 'hex'),
    data: new Buffer('546573742057697468205472756e636174696f6e', 'hex'), // 'Test With Truncation'
    hmac: {
      sha224: '0e2aea68a90c8d37c988bcdb9fca6fa8',
      sha256: 'a3b6167473100ee06e0c796c2955552b',
      sha384: '3abf34c3503b2a23a46efc619baef897',
      sha512: '415fad6271580a531d4179bc891d87a6',
    },
    truncate: true,
  },
  {
    key: new Buffer('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'hex'),
    data: new Buffer('54657374205573696e67204c6172676572205468616e20426c6f636b2d53697a65204b6579202d2048617368204b6579204669727374', 'hex'), // 'Test Using Larger Than Block-Size Key - Hash Key First'
    hmac: {
      sha224: '95e9a0db962095adaebe9b2d6f0dbce2d499f112f2d2b7273fa6870e',
      sha256: '60e431591ee0b67f0d8a26aacbf5b77f8e0bc6213728c5140546040f0ee37f54',
      sha384: '4ece084485813e9088d2c63a041bc5b44f9ef1012a2b588f3cd11f05033ac4c60c2ef6ab4030fe8296248df163f44952',
      sha512: '80b24263c7c1a3ebb71493c1dd7be8b49b46d1f41b4aeec1121b013783f8f3526b56d037e05f2598bd0fd2215d6a1e5295e64f73f63f0aec8b915a985d786598',
    },
  },
  {
    key: new Buffer('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'hex'),
    data: new Buffer('5468697320697320612074657374207573696e672061206c6172676572207468616e20626c6f636b2d73697a65206b657920616e642061206c6172676572207468616e20626c6f636b2d73697a6520646174612e20546865206b6579206e6565647320746f20626520686173686564206265666f7265206265696e6720757365642062792074686520484d414320616c676f726974686d2e', 'hex'), // 'This is a test using a larger than block-size key and a larger than block-size data. The key needs to be hashed before being used by the HMAC algorithm.'
    hmac: {
      sha224: '3a854166ac5d9f023f54d517d0b39dbd946770db9c2b95c9f6f565d1',
      sha256: '9b09ffa71b942fcb27635fbcd5b0e944bfdc63644f0713938a7f51535c3a35e2',
      sha384: '6617178e941f020d351e2f254e8fd32c602420feb0b8fb9adccebb82461e99c5a678cc31e799176d3860e6110c46523e',
      sha512: 'e37b6a775dc87dbaa4dfa9f96e5e3ffddebd71f8867289865df5a32d20cdc944b6022cac3c4982b10d5eeb55c3e4de15134676fb6de0446065c97440fa8c6a58',
    },
  },
];

for (var i = 0, l = rfc4231.length; i < l; i++) {
  for (var hash in rfc4231[i]['hmac']) {
    var result = crypto.createHmac(hash, rfc4231[i]['key'])
                     .update(rfc4231[i]['data'])
                     .digest('hex');
    if (rfc4231[i]['truncate']) {
      result = result.substr(0, 32); // first 128 bits == 32 hex chars
    }
    assert.equal(rfc4231[i]['hmac'][hash],
                 result,
                 "Test HMAC-" + hash + ": Test case " + (i+1) + " rfc 4231");
  }
}

// Test HMAC-MD5/SHA1 (rfc 2202 Test Cases)
var rfc2202_md5 = [
  {
    key: new Buffer('0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b', 'hex'),
    data: 'Hi There',
    hmac: '9294727a3638bb1c13f48ef8158bfc9d',
  },
  {
    key: 'Jefe',
    data: 'what do ya want for nothing?',
    hmac: '750c783e6ab0b503eaa86e310a5db738',
  },
  {
    key: new Buffer('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'hex'),
    data: new Buffer('dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd', 'hex'),
    hmac: '56be34521d144c88dbb8c733f0e8b3f6',
  },
  {
    key: new Buffer('0102030405060708090a0b0c0d0e0f10111213141516171819', 'hex'),
    data: new Buffer('cdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcd', 'hex'),
    hmac: '697eaf0aca3a3aea3a75164746ffaa79',
  },
  {
    key: new Buffer('0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c', 'hex'),
    data: 'Test With Truncation',
    hmac: '56461ef2342edc00f9bab995690efd4c',
  },
  {
    key: new Buffer('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'hex'),
    data: 'Test Using Larger Than Block-Size Key - Hash Key First',
    hmac: '6b1ab7fe4bd7bf8f0b62e6ce61b9d0cd',
  },
  {
    key: new Buffer('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'hex'),
    data: 'Test Using Larger Than Block-Size Key and Larger Than One Block-Size Data',
    hmac: '6f630fad67cda0ee1fb1f562db3aa53e',
  },
];
var rfc2202_sha1 = [
  {
    key: new Buffer('0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b', 'hex'),
    data: 'Hi There',
    hmac: 'b617318655057264e28bc0b6fb378c8ef146be00',
  },
  {
    key: 'Jefe',
    data: 'what do ya want for nothing?',
    hmac: 'effcdf6ae5eb2fa2d27416d5f184df9c259a7c79',
  },
  {
    key: new Buffer('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'hex'),
    data: new Buffer('dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd', 'hex'),
    hmac: '125d7342b9ac11cd91a39af48aa17b4f63f175d3',
  },
  {
    key: new Buffer('0102030405060708090a0b0c0d0e0f10111213141516171819', 'hex'),
    data: new Buffer('cdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcd', 'hex'),
    hmac: '4c9007f4026250c6bc8414f9bf50c86c2d7235da',
  },
  {
    key: new Buffer('0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c', 'hex'),
    data: 'Test With Truncation',
    hmac: '4c1a03424b55e07fe7f27be1d58bb9324a9a5a04',
  },
  {
    key: new Buffer('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'hex'),
    data: 'Test Using Larger Than Block-Size Key - Hash Key First',
    hmac: 'aa4ae5e15272d00e95705637ce8a3b55ed402112',
  },
  {
    key: new Buffer('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'hex'),
    data: 'Test Using Larger Than Block-Size Key and Larger Than One Block-Size Data',
    hmac: 'e8e99d0f45237d786d6bbaa7965c7808bbff1a91',
  },
];

for (var i = 0, l = rfc2202_md5.length; i < l; i++) {
  assert.equal(rfc2202_md5[i]['hmac'],
               crypto.createHmac('md5', rfc2202_md5[i]['key'])
                   .update(rfc2202_md5[i]['data'])
                   .digest('hex'),
               "Test HMAC-MD5 : Test case " + (i+1) + " rfc 2202");
}
for (var i = 0, l = rfc2202_sha1.length; i < l; i++) {
  assert.equal(rfc2202_sha1[i]['hmac'],
               crypto.createHmac('sha1', rfc2202_sha1[i]['key'])
                   .update(rfc2202_sha1[i]['data'])
                   .digest('hex'),
               "Test HMAC-SHA1 : Test case " + (i+1) + " rfc 2202");
}

// Test hashing
var a0 = crypto.createHash('sha1').update('Test123').digest('hex');
var a1 = crypto.createHash('md5').update('Test123').digest('binary');
var a2 = crypto.createHash('sha256').update('Test123').digest('base64');
var a3 = crypto.createHash('sha512').update('Test123').digest(); // binary

assert.equal(a0, '8308651804facb7b9af8ffc53a33a22d6a1c8ac2', 'Test SHA1');
assert.equal(a1, 'h\u00ea\u00cb\u0097\u00d8o\fF!\u00fa+\u000e\u0017\u00ca' +
             '\u00bd\u008c', 'Test MD5 as binary');
assert.equal(a2, '2bX1jws4GYKTlxhloUB09Z66PoJZW+y+hq5R8dnx9l4=',
             'Test SHA256 as base64');
assert.equal(a3, '\u00c1(4\u00f1\u0003\u001fd\u0097!O\'\u00d4C/&Qz\u00d4' +
                 '\u0094\u0015l\u00b8\u008dQ+\u00db\u001d\u00c4\u00b5}\u00b2' +
                 '\u00d6\u0092\u00a3\u00df\u00a2i\u00a1\u009b\n\n*\u000f' +
                 '\u00d7\u00d6\u00a2\u00a8\u0085\u00e3<\u0083\u009c\u0093' +
                 '\u00c2\u0006\u00da0\u00a1\u00879(G\u00ed\'',
             'Test SHA512 as assumed binary');

// Test multiple updates to same hash
var h1 = crypto.createHash('sha1').update('Test123').digest('hex');
var h2 = crypto.createHash('sha1').update('Test').update('123').digest('hex');
assert.equal(h1, h2, 'multipled updates');

// Test hashing for binary files
var fn = path.join(common.fixturesDir, 'sample.png');
var sha1Hash = crypto.createHash('sha1');
var fileStream = fs.createReadStream(fn);
fileStream.addListener('data', function(data) {
  sha1Hash.update(data);
});
fileStream.addListener('close', function() {
  assert.equal(sha1Hash.digest('hex'),
               '22723e553129a336ad96e10f6aecdf0f45e4149e',
               'Test SHA1 of sample.png');
});

// Test signing and verifying
var s1 = crypto.createSign('RSA-SHA1')
               .update('Test123')
               .sign(keyPem, 'base64');
var verified = crypto.createVerify('RSA-SHA1')
                     .update('Test')
                     .update('123')
                     .verify(certPem, s1, 'base64');
assert.ok(verified, 'sign and verify (base 64)');

var s2 = crypto.createSign('RSA-SHA256')
               .update('Test123')
               .sign(keyPem); // binary
var verified = crypto.createVerify('RSA-SHA256')
                     .update('Test')
                     .update('123')
                     .verify(certPem, s2); // binary
assert.ok(verified, 'sign and verify (binary)');

// Test encryption and decryption
var plaintext = 'Keep this a secret? No! Tell everyone about node.js!';
var cipher = crypto.createCipher('aes192', 'MySecretKey123');

// encrypt plaintext which is in utf8 format
// to a ciphertext which will be in hex
var ciph = cipher.update(plaintext, 'utf8', 'hex');
// Only use binary or hex, not base64.
ciph += cipher.final('hex');

var decipher = crypto.createDecipher('aes192', 'MySecretKey123');
var txt = decipher.update(ciph, 'hex', 'utf8');
txt += decipher.final('utf8');

assert.equal(txt, plaintext, 'encryption and decryption');

// encryption and decryption with Base64
// reported in https://github.com/joyent/node/issues/738
var plaintext =
  '32|RmVZZkFUVmpRRkp0TmJaUm56ZU9qcnJkaXNNWVNpTTU*|iXmckfRWZBGWWELw' +
  'eCBsThSsfUHLeRe0KCsK8ooHgxie0zOINpXxfZi/oNG7uq9JWFVCk70gfzQH8ZUJjAfaFg**';
var cipher = crypto.createCipher('aes256', '0123456789abcdef');

// encrypt plaintext which is in utf8 format
// to a ciphertext which will be in Base64
var ciph = cipher.update(plaintext, 'utf8', 'base64');
ciph += cipher.final('base64');

var decipher = crypto.createDecipher('aes256', '0123456789abcdef');
var txt = decipher.update(ciph, 'base64', 'utf8');
txt += decipher.final('utf8');

assert.equal(txt, plaintext, 'encryption and decryption with Base64');


// Test encyrption and decryption with explicit key and iv
var encryption_key = '0123456789abcd0123456789';
var iv = '12345678';

var cipher = crypto.createCipheriv('des-ede3-cbc', encryption_key, iv);
var ciph = cipher.update(plaintext, 'utf8', 'hex');
ciph += cipher.final('hex');

var decipher = crypto.createDecipheriv('des-ede3-cbc', encryption_key, iv);
var txt = decipher.update(ciph, 'hex', 'utf8');
txt += decipher.final('utf8');

assert.equal(txt, plaintext, 'encryption and decryption with key and iv');

// update() should only take buffers / strings
assert.throws(function() {
  crypto.createHash('sha1').update({foo: 'bar'});
}, /string or buffer/);


// Test Diffie-Hellman with two parties sharing a secret,
// using various encodings as we go along
var dh1 = crypto.createDiffieHellman(256);
var p1 = dh1.getPrime('base64');
var dh2 = crypto.createDiffieHellman(p1, 'base64');
var key1 = dh1.generateKeys();
var key2 = dh2.generateKeys('hex');
var secret1 = dh1.computeSecret(key2, 'hex', 'base64');
var secret2 = dh2.computeSecret(key1, 'binary', 'base64');

assert.equal(secret1, secret2);

// Create "another dh1" using generated keys from dh1,
// and compute secret again
var dh3 = crypto.createDiffieHellman(p1, 'base64');
var privkey1 = dh1.getPrivateKey();
dh3.setPublicKey(key1);
dh3.setPrivateKey(privkey1);

assert.equal(dh1.getPrime(), dh3.getPrime());
assert.equal(dh1.getGenerator(), dh3.getGenerator());
assert.equal(dh1.getPublicKey(), dh3.getPublicKey());
assert.equal(dh1.getPrivateKey(), dh3.getPrivateKey());

var secret3 = dh3.computeSecret(key2, 'hex', 'base64');

assert.equal(secret1, secret3);


// Test RSA key signing/verification
var rsaSign = crypto.createSign('RSA-SHA1');
var rsaVerify = crypto.createVerify('RSA-SHA1');
assert.ok(rsaSign);
assert.ok(rsaVerify);

rsaSign.update(rsaPubPem);
var rsaSignature = rsaSign.sign(rsaKeyPem, 'hex');
assert.equal(rsaSignature, '5c50e3145c4e2497aadb0eabc83b342d0b0021ece0d4c4a064b7c8f020d7e2688b122bfb54c724ac9ee169f83f66d2fe90abeb95e8e1290e7e177152a4de3d944cf7d4883114a20ed0f78e70e25ef0f60f06b858e6af42a2f276ede95bbc6bc9a9bbdda15bd663186a6f40819a7af19e577bb2efa5e579a1f5ce8a0d4ca8b8f6');

rsaVerify.update(rsaPubPem);
assert.equal(rsaVerify.verify(rsaPubPem, rsaSignature, 'hex'), 1);
