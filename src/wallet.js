const EC = require('elliptic').ec;
const UncorfimedTransactions = require('./UTXOs');
const Transaction = require('./transaction');
const TransactionInput = require('./transactionInput');

class Wallet {
    constructor () {
        this.generateKeyPair();
        this.UTXOs = {};
    }
    generateKeyPair () {
        const ec = new EC('secp256k1');
        this.key = ec.genKeyPair();
        this.publicKey = this.key.getPublic().encode('hex');
    }
    getBalance () {
        let total = 0;
        const UTXOs = UncorfimedTransactions.getUTXOs();
        Object.values(UTXOs).forEach(item => {
           if (item.isMine(this.publicKey)) {
               this.UTXOs[item.id] = item;
               total += item.value;
           }
        });
        return total;
    }
    sendFunds (reciepient, value) {
        if (this.getBalance() < value) {
            console.log('Not enough money! Balance: ' + this.getBalance());
            return null;
        }
        let inputs = [];
        let total = 0;
        Object.values(this.UTXOs).forEach(item => {
            total += item.value;
            inputs.push(new TransactionInput(item.id));
            if (total > value) return false;
        });
        const newTransaction = new Transaction(this, reciepient, value, inputs);
        newTransaction.generateSignature();
        inputs.forEach(input => delete this.UTXOs[input.transactionOutputId]);
        return newTransaction;
    }
}

module.exports = Wallet;