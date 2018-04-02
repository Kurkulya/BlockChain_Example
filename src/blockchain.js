const Block = require('./block');
const Wallet = require('./wallet');
const Transaction = require('./transaction');
const isChainValid = require('./utils').isChainValid;
const TransactionOutput = require('./transactionOutput');
const UncorfimedTransactions = require('./UTXOs');

class BlockChain {
    constructor () {
        this.difficulty = 3;
        this.blocks = [];
        this.coinbase = new Wallet();
        this.walletA = new Wallet();
        this.walletB = new Wallet();
        this.genesisTransaction = new Transaction(this.coinbase, this.walletA, 100, null);
        this.genesisTransaction.generateSignature();
        this.genesisTransaction.transactionId = "0";
        this.genesisTransaction.outputs.push(new TransactionOutput(this.genesisTransaction.reciepient,
            this.genesisTransaction.value,
            this.genesisTransaction.transactionId));
        UncorfimedTransactions.addUTXO(this.genesisTransaction.outputs[0]);

        console.log('Creating and Mining Genesis block... ');
        const genesis = new Block("0");
        genesis.addTransaction(this.genesisTransaction);
        this.addBlock(genesis);

        const block1 = new Block(genesis.hash);
        console.log("\nWalletA's balance is: " + this.walletA.getBalance());
        console.log("\nWalletA is Attempting to send funds (40) to WalletB...");
        block1.addTransaction(this.walletA.sendFunds(this.walletB, 40));
        this.addBlock(block1);
        console.log("\nWalletA's balance is: " + this.walletA.getBalance());
        console.log("WalletB's balance is: " + this.walletB.getBalance());

        const block2 = new Block(block1.hash);
        console.log("\nWalletA Attempting to send more funds (1000) than it has...");
        block2.addTransaction(this.walletA.sendFunds(this.walletB, 1000));
        this.addBlock(block2);
        console.log("\nWalletA's balance is: " + this.walletA.getBalance());
        console.log("WalletB's balance is: " + this.walletB.getBalance());

        const block3 = new Block(block2.hash);
        console.log("\nWalletB is Attempting to send funds (20) to WalletA...");
        block3.addTransaction(this.walletB.sendFunds( this.walletA, 20));
        this.addBlock(block3);
        console.log("\nWalletA's balance is: " + this.walletA.getBalance());
        console.log("WalletB's balance is: " + this.walletB.getBalance());

        isChainValid(this.blocks, this.difficulty, this.genesisTransaction);
    }
    addBlock (newBlock) {
        newBlock.mineBlock(this.difficulty);
        this.blocks.push(newBlock);
    }
}

module.exports = BlockChain;