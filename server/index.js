const express = require("express");
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
  // Todo: get a signuature from the client-side application
  // recover the public address from the signature
  const { sender, recipient, amount } = req.body;

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

const pk1 = "f35922752b22ad1114a8b3b5d6ab9bd1bf072498ce2adeb5ceb9fb05b1b3a515";
const pk2 = "cd4812c89719666822777eddd2bde6e53c1b201d8a1b9ed42d7b46a658d63137";
const pk3 = "c77d6f5bdfceca173027f2400070f1531a99f630b5061e5536b52d3a89c2ae45";
