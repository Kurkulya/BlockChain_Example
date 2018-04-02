const Block = require('./block');
const Wallet = require('./wallet');
const Transaction = require('./transaction');
const isChainValid = require('./utils').isChainValid;
const TransactionOutput = require('./transactionOutput');
const UnspentTransactions = require('./UTXOs');

class BlockChain {
    constructor () {
        this.difficulty = 3;
        this.blocks = [];
    }
    get length() {
        return this.blocks.length;
    }
    addBlock (newBlock) {
        console.log('Starting mining block...');
        newBlock.mineBlock(this.difficulty);
        console.log(`Perform inputs (wallet balance): ` +
        `from ${newBlock.transactions[0].inputs.length === 0 ? '0' : newBlock.transactions[0].inputs[0].UTXO.value} ` +
        `to ${newBlock.transactions[0].outputs[0].value} ` + (newBlock.transactions[0].outputs[1] !== undefined
            ? `and ${newBlock.transactions[0].outputs[1].value}` : ''));
        const backupChain = this.blocks;
        this.blocks.push(newBlock);
        if (!isChainValid(this.blocks, this.difficulty, this.genesisTransaction)) {
            this.blocks = backupChain;
        }
    }
    createGenesis (amount, walletTo) { // creating first fake transactions to get coins
        this.genesisTransaction = new Transaction(new Wallet(), walletTo, amount, null);
        this.genesisTransaction.transactionId = "0";
        this.genesisTransaction.outputs.push(new TransactionOutput(walletTo, amount, "0"));
        UnspentTransactions.addUTXO(this.genesisTransaction.outputs[0]);

        console.log('Creating genesis block... ');
        this.genesis = new Block("0");
        this.genesis.addTransaction(this.genesisTransaction);
        this.addBlock(this.genesis);
    }
}

module.exports = BlockChain;