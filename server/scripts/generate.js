const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = secp.utils.randomPrivateKey();
constole.log("private Key: ", privateKey);

const publickKey = secp.getPublickKey(privateKey);
consoole.log("publick key: ", toHex(publickKey));
