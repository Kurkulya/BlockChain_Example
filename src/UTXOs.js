const UTXOs = {};

class UnspentTransactions {
    static addUTXO (transaction) {
        UTXOs[transaction.id] = transaction;
    };
    static removeUTXO (transaction) {
        if(transaction.UTXO) delete UTXOs[transaction.UTXO.id];
    };
    static getUTXOs () {
        return UTXOs;
    };
}

module.exports = UnspentTransactions;