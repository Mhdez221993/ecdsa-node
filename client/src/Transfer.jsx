import { toHex, utf8ToBytes } from "ethereum-cryptography/utils.js";

import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const body = {
      sender: address,
      amount: parseInt(sendAmount),
    }

    const messageHash = hashMessage(body);
    const signature = secp256k1.sign(messageHash, privateKey);
    const pubAddress = signature.recoverPublicKey(messageHash).toHex();
    console.log(pubAddress);


    try {

      const {
        data: { balance },
      } = await server.post(`send`, {
        ...body,
        signature: JSON.parse(JSON.stringify(signature, (key, value) => typeof value === 'bigint' ? value.toString() : value)),
        messageHash,
        recipient,
        pubAddress
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

function hashMessage(msg) {
	const hash = keccak256(utf8ToBytes(JSON.stringify(msg)));
	return toHex(hash);
}

//   const pk1 = "f35922752b22ad1114a8b3b5d6ab9bd1bf072498ce2adeb5ceb9fb05b1b3a515";
// const pk2 = "cd4812c89719666822777eddd2bde6e53c1b201d8a1b9ed42d7b46a658d63137";
// const pk3 = "c77d6f5bdfceca173027f2400070f1531a99f630b5061e5536b52d3a89c2ae45";