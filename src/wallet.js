const EC = require('elliptic').ec;
const UnspentTransactions = require('./UTXOs');
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
        const UTXOs = UnspentTransactions.getUTXOs(); // get all unspent transactions
        Object.values(UTXOs).forEach(item => {
           if (item.isMine(this.publicKey)) { // if unspent transaction belong to your wallet, confirm your balance
               this.UTXOs[item.id] = item;  // add unspent transaction as proof of coin receive
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
        Object.values(this.UTXOs).forEach(item => { // for all wallet's unspent transactions
            total += item.value;
            inputs.push(new TransactionInput(item.id)); // push unspent transaction id as proof of balance to create new transaction
            if (total > value) return false;
        });
        const newTransaction = new Transaction(this, reciepient, value, inputs);
        inputs.forEach(input => delete this.UTXOs[input.transactionOutputId]); // remove spent transactions from wallets unspent proof
        return newTransaction;
    }
}

module.exports = Wallet;