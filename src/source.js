const BlockChain = require('./blockchain');
const Block = require('./block');
const Wallet = require('./wallet');

const blockChain = new BlockChain();

const walletA = new Wallet();
const walletB = new Wallet();

blockChain.createGenesis(10000, walletA);

for (let i = 0; i < 10; i++) {
    let block = new Block(blockChain.blocks[blockChain.length - 1].hash);
    block.addTransaction(walletA.sendFunds(walletB, 100));
    blockChain.addBlock(block);
    console.log(`\nWalletA: ${walletA.getBalance()}, WalletB: ${walletB.getBalance()}`);
}