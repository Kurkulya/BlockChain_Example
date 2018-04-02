const sha256 = require('js-sha256').sha256;
const UncorfimedTransactions = require('./UTXOs');
const TransactionOutput = require('./transactionOutput');

let sequence = 0;

class Transaction {
    constructor (from, to, value, inputs) {
        this.sender = from;
        this.reciepient = to;
        this.value = value;
        this.inputs = inputs || [];
        this.outputs = [];
    }
    calculateHash () {
        sequence++;
        return sha256(this.sender.publicKey.toString()
            + this.reciepient.publicKey.toString()
            + this.value.toString()
            + sequence.toString());
    }
    generateSignature () {
        const data = this.sender.publicKey.toString()
            + this.reciepient.publicKey.toString()
            + this.value.toString();
        this.signature = this.sender.key.sign(data);
    }
    verifySignature () {
        const data = this.sender.publicKey.toString()
            + this.reciepient.publicKey.toString()
            + this.value.toString();
        return this.sender.key.verify(data, this.signature.toDER());
    }
    processTransaction () {
        if (!this.verifySignature()) {
            console.log('Transaction Signature failed to verify!');
            return false;
        }
        this.inputs = this.inputs.map(input => {return {...input, UTXO: UncorfimedTransactions.getUTXOs()[input.transactionOutputId]}});
        if (this.getInputsValue() < 0.1) {
            console.log('Transaction inputs too small: ' + this.getInputsValue());
            return false;
        }
        const leftOver = this.getInputsValue() - this.value;
        this.transactionId = this.calculateHash();
        this.outputs.push(new TransactionOutput(this.reciepient, this.value, this.transactionId));
        this.outputs.push(new TransactionOutput(this.sender, leftOver, this.transactionId));

        this.outputs.forEach(output => UncorfimedTransactions.addUTXO(output));
        this.inputs.forEach(input => UncorfimedTransactions.removeUTXO(input));

        return true;
    }
    getInputsValue () {
        let total = 0;
        this.inputs.forEach(input => {
            if (input.UTXO) total += input.UTXO.value
        });
        return total;
    }
    getOutputsValue () {
        let total = 0;
        this.outputs.forEach(output => {
            total += output.value
        });
        return total;
    }
}

module.exports = Transaction;