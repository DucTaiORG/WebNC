const express = require('express');
const morgan = require('morgan');
const moment = require('moment');
const openpgp = require('openpgp');
require('express-async-error');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.get('/', function(req, res){

    (async () => {
        const publicKeyArmored = 'xo0EXsI/PAEEAL9MC7T/ANgT9BX0Jz9FTUeQdldehAi5cIst3ak3X+MDNYK0pgfS' +
                                'cp3Z7BDOW1mnRr/WForr+RqBabDvLL+KPy9Mx5PCeaZnOVkr6cIgPKpdT+IC8aRF' +
                                'mNmegBv0n1ECGqk3u9OUVdZXxGbf0ivSOtRNiSx8AuWoLXjKo9OyGaCjABEBAAHN' +
                                'HkR1YyBUYWkgPHJvbmluMzIwMTRAZ21haWwuY29tPsKtBBMBCgAXBQJewj88Ahsv' +
                                'AwsJBwMVCggCHgECF4AACgkQo8TVIT7crfdbPgP8C4IGCFto3b6VjHnyWDH/CBBt' +
                                '7FJ9+ZWjovL8lL58E0jaaqwiUzTbeJ3DXuPKUv3VOMDYihXkNFsOGYkqgGAOCre4' + 
                                'u6t9poTCd0EmlkzOeWqGVy4wsxqWaXDRtqABViKu++84QF8wJkenrKzOO4Vol9Dg' +
                                'eW0SB1HkLdj9szMXQY/OjQRewj88AQQAmNY4ibwPlDuP9SN3K6s4Z7g+zNaI/D8f' +
                                '6+iq0FgDmWluK8KD79oZU1kMqwMFJSAmz2IHPaGYgPLNH+ftcK5Hej1LfgXLOECP' +
                                'L0zAnL08D+GuA9N3Y2DAQ65FDzxXNtfcLtnIIFyaDE3qQYSWIrmCJHpXxiKgyaVY' +
                                'U+xoqX6katkAEQEAAcLAgwQYAQoADwUCXsI/PAUJDwmcAAIbLgCoCRCjxNUhPtyt' +
                                '950gBBkBCgAGBQJewj88AAoJEPdLiOHaISZLJ3UEAJIeK6I3Sy1Tg9hX4KPMgILl' +
                                'iaodzTGVhnFUq3MIMrPEDqbQDOjvU5Zseb82SxG2eIHo8OL4S/P3J+pTDMWIfGXK' +
                                '3QFEn2y4MkeVDnu0YSsh3f46IJStPumtifN+wc/BqM9FwAzKYj4qEG7WubOX2Hp3' +
                                '6bqo/kxkH8U0naYhEjZym58D/3td87WLOL0BWRYHtb+Gz9LcxNYAVDJIcB4q6Fsu' +
                                'Lb87694Jl8cUrtyhONDet+u09Ubjvoh7+b4o+SUx6zlX013erCndQqPZY8F0/I5F' +
                                'IdtThx+Fo9asCeCE/h151Y/R58k7a6gQB7lKQtvBHUL7MpliXJ9oTlEsxf573apl' +
                                'ZCWkzo0EXsI/PAEEAL5T9rqeCuwqNzkN+kmVIF6drcF/3SfthpFs5Ga7NcvCzuJM' +
                                'd6cQHdi37hEDvCj+HmP6VHcpX3zNkJoZBW2cXDWlFGhgpaVoCW4w2jxKbGvLpnQn' +
                                't9qj6bHEu3G2/QTnYGS/+T8pEmHNDlaDKXrQbeFniw+CytPALk7BsGqRn0t/ABEB' +
                                'AAHCwIMEGAEKAA8FAl7CPzwFCQ8JnAACGy4AqAkQo8TVIT7crfedIAQZAQoABgUC' +
                                'XsI/PAAKCRAkA6OJsct9MgRMBACaYDm9ooN1ANuLNTB1G3Zx580bs9fP4u4PIV3z' +
                                'Tn1SMH+wfAE6lS41u3aQWmjlCHb0DTi5ZBe/fBh0MlGhUnWDAdcP1S8kIjIhlEbB' +
                                '+3uJ8XE05O1UekZMvfkGOjRRK8G8P0dlvGVwwPvqzBi3cLMnISPQq7shptTH/ata' +
                                '/CuAGSwFA/4pytJkv+j0mXBQyEMLr41f4bDVCRdDdbTFBRTiTqYpRIkfZ/e3Uxkd' +
                                'XTDLQ44Sr0VcG7lkr4diAXAmVCDuhBcs5xCToPFco3caDFPui39u8ce5Bl7M1xtD' +
                                'J40KZo4He/GxS9Wd9gR+mnxqfoYtQXWBCPWapmYEmOTapIsqpMfAqg==' +
                                '=SBo7'; // Public key
        const [privateKeyArmored] = 'xcFGBF7CPzwBBAC/TAu0/wDYE/QV9Cc/RU1HkHZXXoQIuXCLLd2pN1/jAzWCtKYH' +
                                    '0nKd2ewQzltZp0a/1haK6/kagWmw7yy/ij8vTMeTwnmmZzlZK+nCIDyqXU/iAvGk' + 
                                    'RZjZnoAb9J9RAhqpN7vTlFXWV8Rm39Ir0jrUTYksfALlqC14yqPTshmgowARAQAB' +
                                    '/gkDCCXgKdVDTgZJYAHj2a1HXSVynvxkrNJ5OCn+6YLSI57qvKj2rZ0bLVMIKZKb' +
                                    'MSknSfULSw3YZScQmReuEFuQdKCdD8FieRcj0G7ohW2okaRfmvPd2GxNqJwuq2kl' +
                                    'uv75NruujqCrrmLf5ehHjQKSmtTz47yJOPoEPCcx1RYBaK2f5FXEP1Kd3RTCBzVe' +
                                    '11NMBDeAK96vlpXDnTWLe5MLRDZaOyJz/v1NW+O61Qf0Rwkskf9NAwhhhD94GP27' +
                                    'cMxQ/fMimFXAVnet8XwikntuE/rcS9o3Ku+NPFRe0TFhogxW8FLgs95MK3/6Q0zi' +
                                    'oLAnxU2EBXwxBob/ShN6r3F3mQIeqGU10/DMaTnypxnMDAlhu/lsJc/4QTEdweOp' +
                                    'qBv6JhNfyhtHeSfBvv8gy3V0Wc2bzZ8WCP8O7B5f7kbiA3hn2zxx91fYO643P1Wq' +
                                    'aPZ3UhPmtzzcTAyF68C27a+PdSPR/dw93CHSmd8nQVM0aQP0RtQRvRfNHkR1YyBU' +
                                    'YWkgPHJvbmluMzIwMTRAZ21haWwuY29tPsKtBBMBCgAXBQJewj88AhsvAwsJBwMV' +
                                    'CggCHgECF4AACgkQo8TVIT7crfdbPgP8C4IGCFto3b6VjHnyWDH/CBBt7FJ9+ZWj' +
                                    'ovL8lL58E0jaaqwiUzTbeJ3DXuPKUv3VOMDYihXkNFsOGYkqgGAOCre4u6t9poTC' +
                                    'd0EmlkzOeWqGVy4wsxqWaXDRtqABViKu++84QF8wJkenrKzOO4Vol9DgeW0SB1Hk' +
                                    'Ldj9szMXQY/HwUYEXsI/PAEEAJjWOIm8D5Q7j/UjdyurOGe4PszWiPw/H+voqtBY' +
                                    'A5lpbivCg+/aGVNZDKsDBSUgJs9iBz2hmIDyzR/n7XCuR3o9S34FyzhAjy9MwJy9' +
                                    'PA/hrgPTd2NgwEOuRQ88VzbX3C7ZyCBcmgxN6kGEliK5giR6V8YioMmlWFPsaKl+' +
                                    'pGrZABEBAAH+CQMIuGD2aY0FAWdgjGwbWbiwgn2QC/DSiST0UdztNFX/dRfGhRHP' +
                                    'e+GNdODeznQRJ9bExqE6NzY56wo4TohhxhLGfHSyoElECoed6CatnJqNl2Ax0new' +
                                    'KwefyMyFT5SgDUbqE3RWpahRoGL8LUmaHYxmJMKdULHMBjoTdQIGgKMGDdV8RUoE' +
                                    'dWwgZtC6cM+HbnwKnhQax5bZh6nDxbwfY5+gjDg9iMTr72it2Y2dup2dbL28uC9Z' +
                                    'ASILoAyB4GEoLiN8VnnVzPjVpop6ov+zg1yCHTp5/g4qtKp+wO2rzPhG8ni3m9+X' +
                                    'hLTVJoCzUCvUIghXf1XqVMjVaVue8XK0zkjSes3ANBhC3RJCN5MvJbg7/uhZnJJn' +
                                    'LEEWJDJ9Un6+7ghcef/O7uI/ejubWhNiOkNSJrClOSYiWdT1p1wyFVob0gR1z+fE' +
                                    'oPvIEVwb7idDDpa3hQraIX3LmcdPcIlIDgzIvBCGaFjOi5+UwIWBUdFrkXTs5C2B' +
                                    'M8LAgwQYAQoADwUCXsI/PAUJDwmcAAIbLgCoCRCjxNUhPtyt950gBBkBCgAGBQJe' +
                                    'wj88AAoJEPdLiOHaISZLJ3UEAJIeK6I3Sy1Tg9hX4KPMgILliaodzTGVhnFUq3MI' +
                                    'MrPEDqbQDOjvU5Zseb82SxG2eIHo8OL4S/P3J+pTDMWIfGXK3QFEn2y4MkeVDnu0' +
                                    'YSsh3f46IJStPumtifN+wc/BqM9FwAzKYj4qEG7WubOX2Hp36bqo/kxkH8U0naYh' +
                                    'EjZym58D/3td87WLOL0BWRYHtb+Gz9LcxNYAVDJIcB4q6FsuLb87694Jl8cUrtyh' +
                                    'ONDet+u09Ubjvoh7+b4o+SUx6zlX013erCndQqPZY8F0/I5FIdtThx+Fo9asCeCE' +
                                    '/h151Y/R58k7a6gQB7lKQtvBHUL7MpliXJ9oTlEsxf573aplZCWkx8FGBF7CPzwB' +
                                    'BAC+U/a6ngrsKjc5DfpJlSBena3Bf90n7YaRbORmuzXLws7iTHenEB3Yt+4RA7wo' +
                                    '/h5j+lR3KV98zZCaGQVtnFw1pRRoYKWlaAluMNo8Smxry6Z0J7fao+mxxLtxtv0E' +
                                    '52Bkv/k/KRJhzQ5Wgyl60G3hZ4sPgsrTwC5OwbBqkZ9LfwARAQAB/gkDCKlzdbpa' +
                                    '++85YN7jCyUyT/5i3MuQT7wZD4sD/AsJa5Sd0RvfPPvZBZAhgsqHAQJ/1phv0xlm' +
                                    '3E8PRTMranBPkvUD69ptQJ48BGFlhKdt+RwP+6iTB8+5lMOr2VpYLcTievRtiZY5' +
                                    '+POha/nPUB1Zj1N/ezu9G4+EdHKDiRp06W3VggVBWQ/4gSFUXDayS0mbp1wMX8QJ' +
                                    'Yt0Belm2vWLojLFRIwXTQD7dvQwv5ouk6/RrO3jwAJGO1BksOo1P4EZXp5LSBYaI' +
                                    'Z8QbnLMM9aOvu6pU5sf0iFo4ejmF8b0YQgooNyLctkGXfFhnx4yBDdHb8U+HxE4E' +
                                    'O53hIWy0i6LCLnADDvGsL5zeZVVnegDJjauVu0I94iH1gYTTL5QovOp0zyDrImUM' +
                                    'cnYGG0k/espLNUs9oTsTwzUb+FsUZc7r+4IUTfTWXqV3xgQDUuL6OwGzrJOMlx7U' +
                                    'DveRMzaNp6OjkHEqZUbMnrHU5gCI/DedY2TWkKCRuJ/CwIMEGAEKAA8FAl7CPzwF' +
                                    'CQ8JnAACGy4AqAkQo8TVIT7crfedIAQZAQoABgUCXsI/PAAKCRAkA6OJsct9MgRM' +
                                    'BACaYDm9ooN1ANuLNTB1G3Zx580bs9fP4u4PIV3zTn1SMH+wfAE6lS41u3aQWmjl' +
                                    'CHb0DTi5ZBe/fBh0MlGhUnWDAdcP1S8kIjIhlEbB+3uJ8XE05O1UekZMvfkGOjRR' +
                                    'K8G8P0dlvGVwwPvqzBi3cLMnISPQq7shptTH/ata/CuAGSwFA/4pytJkv+j0mXBQ' +
                                    'yEMLr41f4bDVCRdDdbTFBRTiTqYpRIkfZ/e3UxkdXTDLQ44Sr0VcG7lkr4diAXAm' +
                                    'VCDuhBcs5xCToPFco3caDFPui39u8ce5Bl7M1xtDJ40KZo4He/GxS9Wd9gR+mnxq' +
                                    'foYtQXWBCPWapmYEmOTapIsqpMfAqg==' +
                                    '=+Hav'; // Encrypted private key
        const passphrase = `nhom34`; // Password that private key is encrypted with
     
        const privateKey = (await openpgp.key.readArmored([privateKeyArmored])).keys[0];
        await privateKey.decrypt(passphrase);
     
        const readableStream = new ReadableStream({
            start(controller) {
                controller.enqueue('Hello, world!');
                controller.close();
            }
        });
     
        const encrypted = await openpgp.encrypt({
            message: openpgp.message.fromText(readableStream),                  // input as Message object
            publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys, // for encryption
            privateKeys: [privateKey]                                           // for signing (optional)
        });
        const ciphertext = encrypted.data; // ReadableStream containing '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
     
        const decrypted = await openpgp.decrypt({
            message: await openpgp.message.readArmored(ciphertext),             // parse armored message
            publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys, // for verification (optional)
            privateKeys: [privateKey]                                           // for decryption
        });
        const plaintext = await openpgp.stream.readToEnd(decrypted.data); // 'Hello, World!'
        console.log(plaintext);
    })();
    
    res.json({
        msg: 'hello from nodejs',
        now: moment().valueOf()
    });
})

app.use('/api/taikhoan', require('./routes/taikhoan.route'));
app.use('/api/noptien', require('./routes/noptien.route'));

app.use((req, res, next) => {
    res.status(404).send('RESOURCE NOT FOUND!');
})

app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500).send('View error on console log');
})


const PORT = 3000;
app.listen(PORT, _=>{
    console.log("API is running on port 3000");
})