const Block = require('./block');
const isChainValid = require('./utils');

const difficulty = 4;
const blocks = [];

blocks.push(new Block("Hi, i'm first block", "0"));
console.log("Trying to mine block 1...");
blocks[0].mineBlock(difficulty);
blocks.push(new Block("Hi, i'm second block", blocks[blocks.length - 1].hash));
console.log("Trying to mine block 2...");
blocks[1].mineBlock(difficulty);
blocks.push(new Block("Hi, i'm third block", blocks[blocks.length - 1].hash));
console.log("Trying to mine block 3...");
blocks[2].mineBlock(difficulty);

isChainValid(blocks, difficulty);

console.log(blocks);