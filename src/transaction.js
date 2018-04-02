const sha256 = require('js-sha256').sha256;
const UnspentTransactions = require('./UTXOs');
const TransactionOutput = require('./transactionOutput');

let sequence = 0;

class Transaction {
    constructor (from, to, value, inputs) {
        this.sender = from;
        this.reciepient = to;
        this.value = value;
        this.inputs = inputs || [];
        this.outputs = [];
        this.signature = this.sender.key.sign(this.sender.publicKey
            + this.reciepient.publicKey
            + this.value);
    }
    calculateHash () {
        sequence++;
        return sha256(this.sender.publicKey
            + this.reciepient.publicKey
            + this.value
            + sequence);
    }
    verifySignature () {
        const data = this.sender.publicKey
            + this.reciepient.publicKey
            + this.value;
        return this.sender.key.verify(data, this.signature.toDER());
    }
    processTransaction () {
        if (!this.verifySignature()) {
            console.log('Transaction signature failed to verify!');
            return false;
        }

        this.inputs = this.inputs.map(input => {return {...input, UTXO: UnspentTransactions.getUTXOs()[input.transactionOutputId]}});
        if (this.getInputsValue() < 0.1) {
            console.log('Transaction inputs too small: ' + this.getInputsValue());
            return false;
        }
        const leftOver = this.getInputsValue() - this.value; // get difference between all received coins and now sending
        this.transactionId = this.calculateHash();
        this.outputs.push(new TransactionOutput(this.reciepient, this.value, this.transactionId), // save transaction as proof of sending coins
                          new TransactionOutput(this.sender, leftOver, this.transactionId)); // save transaction as proof of sending coin (save the difference)

        this.outputs.forEach(output => UnspentTransactions.addUTXO(output)); // all output transaction save as unspent
        this.inputs.forEach(input => UnspentTransactions.removeUTXO(input)); // remove spent transactions from unspent

        return true;
    }
    getInputsValue () { // get total value of all proofs of coins received
        let total = 0;
        this.inputs.forEach(input => {
            if (input.UTXO) total += input.UTXO.value
        });
        return total;
    }
    getOutputsValue () { // get total value of all proofs of coins sended
        let total = 0;
        this.outputs.forEach(output => {
            total += output.value
        });
        return total;
    }
}

module.exports = Transaction;