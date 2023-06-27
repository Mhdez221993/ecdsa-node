import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { utf8ToBytes } from "ethereum-cryptography/utils.js";
import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const messageHash = keccak256(utf8ToBytes(address));
    const signature = secp256k1.sign(messageHash, privateKey);
    console.log("signature", signature);

    try {

      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;

// const messageHash = keccak256(utf8ToBytes(address));
// const signature = secp256k1.sign(messageHash, privateKey);
// console.log("signature", signature);

// const publicKey = toHex(signature.recoverPublicKey(messageHash).toRawBytes());
// console.log("PublicKey", publicKey === address)


  // const signatureComponents = {
  //   r: signature.slice(0, 32),
  //   s: signature.slice(32, 64),
  //   recovery: signature[64],
  // };

  // const messageHash = Buffer.from(keccak256(utf8ToBytes(from))).values();
  // const publicKey = toHex(
  //   signatureComponents.recoverPublicKey(messageHash).toRawBytes()
  // );
  // console.log(publicKey);

  // if (publicKey == from) {
      // } else {
  //   res.status(400).send({ message: "Invalid signature" });
  // }

//   const pk1 = "f35922752b22ad1114a8b3b5d6ab9bd1bf072498ce2adeb5ceb9fb05b1b3a515";
// const pk2 = "cd4812c89719666822777eddd2bde6e53c1b201d8a1b9ed42d7b46a658d63137";
// const pk3 = "c77d6f5bdfceca173027f2400070f1531a99f630b5061e5536b52d3a89c2ae45";