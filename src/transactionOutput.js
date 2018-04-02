const sha256 = require('js-sha256').sha256;

class TransactionOutput {
    constructor (reciepient, value, parentTransactionId) {
        this.reciepient = reciepient;
        this.value = value;
        this.parentTransactionId = parentTransactionId;
        this.id = sha256(reciepient.publicKey.toString() + value.toString() + this.parentTransactionId.toString());
    }
    isMine (publicKey) {
        return this.reciepient.publicKey === publicKey;
    }
}

module.exports = TransactionOutput;