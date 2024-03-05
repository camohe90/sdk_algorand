import * as algokit from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'
import 'dotenv/config'


async function main() {

    const camilo = algosdk.mnemonicToSecretKey(process.env.PASSPHRASE!)
    console.log(camilo)
   
    const algod = algokit.getAlgoClient(algokit.getAlgoNodeConfig('testnet', 'algod'))

    const appId = Number(612998611)
    const account_app = algosdk.getApplicationAddress(appId)
    console.log(account_app)

     const algoTransfer = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: camilo.addr,
        to: account_app,
        amount: 0.5 * 1e6, // convierto de algos a microalgos
        suggestedParams: await algod.getTransactionParams().do()
    })

    //obtener informacion de la cuenta
    console.log( await algod.accountInformation(account_app).do());

    const resultTransferTx = await algokit.sendTransaction(
        {
            transaction: algoTransfer,
            from: camilo
        },
        algod
    );

}

main();
