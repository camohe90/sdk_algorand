import * as algokit from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'
import 'dotenv/config'


async function main() {

    const camilo = algosdk.mnemonicToSecretKey(process.env.PASSPHRASE)
    console.log(camilo)
   
    const algod = algokit.getAlgoClient(algokit.getAlgoNodeConfig('testnet', 'algod'))

    const assetIndex = Number(302301229)
    console.log(assetIndex)

    const evert = algosdk.generateAccount();
    console.log(evert.addr)

     // transferir ALGOS
     const algoTransfer = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: camilo.addr,
        to: evert.addr,
        amount: 0.5 * 1e6, // convierto de algos a microalgos
        suggestedParams: await algod.getTransactionParams().do()
    })

    //obtener informacion de la cuenta
    console.log( await algod.accountInformation(evert.addr).do());

    // enviar la transacción a la red

    const resultTransferTx = await algokit.sendTransaction(
        {
            transaction: algoTransfer,
            from: camilo
        },
        algod
    );
    
    // crear transaccion de transferencia del asset a EVERT

    const asaTranfer = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: camilo.addr,
        to: evert.addr,
        assetIndex,
        amount: 10000,
        suggestedParams: await algod.getTransactionParams().do()
    }
    );

    const optIn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: evert.addr,
        to: evert.addr,
        assetIndex,
        amount:0,
        suggestedParams: await algod.getTransactionParams().do()
    })

    const groupTxResult = await algokit.sendGroupOfTransactions(
        {
            transactions:[
                {
                    transaction: optIn,
                    signer:evert
                },
                {
                    transaction:asaTranfer,
                    signer:camilo
                }
            ]
        }, 
        algod
    );

    console.log(groupTxResult)

    //obtener información de la cuenta camilo
    console.log(await algod.accountInformation(camilo.addr).do())

    //obtener información de la cuenta evert
    console.log(await algod.accountInformation(evert.addr).do())



}

main();
