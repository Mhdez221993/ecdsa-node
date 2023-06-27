const express = require("express");
const { hexToBytes, toHex } = require("ethereum-cryptography/utils.js");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");

const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "035feadf42c037f6bf0abc8290edecb76323e3dc7f7cdec4d274eabc6aca907f0c": 100,
  "0288e5cc5a93d06495b20cd21d508e085abfa8728ffa77734904e07d946bd41644": 50,
  "03ff27ef71ebe259c25555fdb87e071472c0370b9eaecc30d3c8e6f0937ea69c26": 20,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { recipient, amount, signature, messageHash, sender } = req.body;

  signature.r = BigInt(signature.r);
  signature.s = BigInt(signature.s);

  if (!secp256k1.verify(signature, messageHash, sender))
    return res.status(400).send({ message: "Invalid transaction" });

  // const sender = getEthAddress(hexToBytes(pubAddress));

  if (!balances[sender])
    return res.status(400).send({ message: "Invalid sender" });

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function getEthAddress(publicKey) {
  const hash = keccak256(publicKey.slice(1, publicKey.length));
  return toHex(hash.slice(-20));
}
