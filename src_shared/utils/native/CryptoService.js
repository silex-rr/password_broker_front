export class CryptoService {
    forge = null;

    constructor() {
        this.forge = require('node-forge');
    }

    decryptRsa(encryptedMessageBase64, rsaPrivateKey, password = null) {
        let decryptedPrivateKey = null;
        let decryptedMessageBytes = null;
        try {
            decryptedPrivateKey = this.forge.pki.decryptRsaPrivateKey(rsaPrivateKey, password);
        } catch (error) {
            console.error('Error decrypting private key:', error);
            return;
        }

        const decryptedPrivateKeyPem = this.forge.pki.privateKeyToPem(decryptedPrivateKey);

        // console.log('Decrypted private key:', decryptedPrivateKeyPem);
        // const encryptedMessage = forge.util.decode64(encryptedMessageBase64);

        // console.log('encryptedMessageBase64 s');
        // console.log(encryptedMessageBase64);
        // console.log('encryptedMessageBase64 e');
        // let decryptedMessage = '';
        try {
            // console.log('rsa loading');
            const rsa = this.forge.pki.privateKeyFromPem(decryptedPrivateKeyPem);
            // console.log('rsa loaded', rsa);
            const ctBytes = this.forge.util.decode64(encryptedMessageBase64);
            // const s = this.forge.util.createBuffer(ctBytes).getBytes();
            // console.log('ctBytes', ctBytes);
            // const encrypted_value = Buffer.from(ctBytes, 'base64').toString('binary');

            // console.log('ctBytes', ctBytes, encryptedMessageBase64, encrypted_value);
            decryptedMessageBytes = rsa.decrypt(ctBytes, 'RSA-OAEP', {
                md: this.forge.md.sha256.create(),
            }); //'RSAES-PKCS1-V1_5' 'RSA-OAEP' 'NONE' 'RAW'

            // console.log('decryptedMessageBytes', decryptedMessageBytes);
            // Convert the decrypted bytes to a string
            // decryptedMessage = this.forge.util.bytesToHex(decryptedMessageBytes);
            //
            // console.log(
            //     'Decrypted aes pass Message base64:',
            //     Buffer.from(decryptedMessageBytes, 'binary').toString('base64'),
            // );
        } catch (error) {
            console.error('Error decrypting message:', error);
        }
        return decryptedMessageBytes;
    }

    decryptAes(ciphertextBinary, passwordBinary, ivBinary, cbcSalt) {
        // console.log('passwordBinary', passwordBinary);
        const key = this.forge.pkcs5.pbkdf2(passwordBinary, cbcSalt, 1000, 16);
        // console.log('key', key);
        const decipher = this.forge.cipher.createDecipher('AES-CBC', key);
        // console.log('decipher created');
        decipher.start({iv: ivBinary});
        // console.log('decipher iv');
        try {
            decipher.update(this.forge.util.createBuffer(ciphertextBinary));
        } catch (e) {
            console.log('error', e);
        }
        // console.log('decipher.update');
        decipher.finish();
        // console.log('decipher.finish');
        let output = '';
        try {
            output = decipher.output;
            // console.log(output.data);
            // console.log(Buffer.from(output.data, 'binary').toString('utf8'));
        } catch (e) {
            console.log('decipher output error', e);
        }
        try {
            output = decipher.output.toString();
        } catch (e) {
            console.log('decipher output error', e);
        }
        return output;
    }

    /**
     * Decrypting field values
     * @param fieldValueEncrypted - encrypted value from field
     * @param iv - initializing vector from field
     * @param encryptedAesGroupPasswordBase64 - encrypted AES password from Group Users
     * @param rsaPrivateKey - private User key from File Storage
     * @param masterPassword - user master password
     * @param salt
     * @return {string} - decrypted field Value
     */
    decryptFieldValue(fieldValueEncrypted, iv, encryptedAesGroupPasswordBase64, rsaPrivateKey, masterPassword, salt) {
        const aesGroupPassword = this.decryptRsa(encryptedAesGroupPasswordBase64, rsaPrivateKey, masterPassword);
        // console.log('aesGroupPassword', aesGroupPassword);
        return this.decryptAes(fieldValueEncrypted, aesGroupPassword, iv, salt);
    }
}
