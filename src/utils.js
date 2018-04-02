const sha256 = require('js-sha256').sha256;

function isChainValid (blocks, diff, genesisTransaction) {
    const hashTarget = Array(diff + 1).join("0");
    const tempUTXOs = {};
    tempUTXOs[genesisTransaction.outputs[0].id] = genesisTransaction.outputs[0];
    for (let i = 1; i < blocks.length; i++) {
        const curBlock = blocks[i];
        const prevBlock = blocks[i-1];
        if (!(curBlock.hash === curBlock.calculateHash())) {
            console.log("Current hashes are not equal!");
            return false;
        }
        if (!(prevBlock.hash === prevBlock.calculateHash())) {
            console.log("Previous hashes are not equal!");
            return false;
        }
        if (!(curBlock.hash.substr(0, diff) === hashTarget)) {
            console.log("This block hasn't been mined!");
            return false;
        }
        let tempOutput;
        for (let t = 0; t < curBlock.transactions.length; t++) {
            let currentTransaction = curBlock.transactions[t];

            if(!currentTransaction.verifySignature()) {
                console.log('Signature on Transaction(' + t + ') is Invalid');
                return false;
            }
            if(currentTransaction.getInputsValue() !== currentTransaction.getOutputsValue()) {
                console.log('Inputs are note equal to outputs on Transaction(' + t + ')');
                return false;
            }
            currentTransaction.inputs.forEach(input => {
                tempOutput = tempUTXOs[input.transactionOutputId];

                if(!tempOutput) {
                    console.log('Referenced input on Transaction(' + t + ') is Missing');
                    return false;
                }

                if(input.UTXO.value !== tempOutput.value) {
                    console.log('Referenced input Transaction(' + t + ') value is Invalid');
                    return false;
                }
                delete tempUTXOs[input.transactionOutputId];
            });
            currentTransaction.outputs.forEach(output => {
                tempUTXOs[output.id] = output;
            });
            if( currentTransaction.outputs[0].reciepient.publicKey !== currentTransaction.reciepient.publicKey) {
                console.log('Transaction(' + t + ') output reciepient is not who it should be');
                return false;
            }
            if( currentTransaction.outputs[1].reciepient.publicKey !== currentTransaction.sender.publicKey) {
                console.log('Transaction(' + t + ') output change is not sender.');
                return false;
            }

        }
    }
    console.log("Chain is valid!");
    return true;
}

function getMerkleRoot (transactions) {
    let length = transactions.length;
    let previousTreeLayer = [];
    transactions.forEach(transaction => previousTreeLayer.push(transaction.transactionId));
    let treeLayer = previousTreeLayer;
    while (length > 1) {
        treeLayer = [];
        for(let i = 1; i < previousTreeLayer.length; i++) {
            treeLayer.push(sha256(previousTreeLayer[i-1] + previousTreeLayer[i]));
        }
        length = treeLayer.length;
        previousTreeLayer = treeLayer;
    }
    return (treeLayer.length === 1) ? treeLayer[0] : "";
}


module.exports = {isChainValid, getMerkleRoot};