import * as algokit from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'
import 'dotenv/config'


async function main() {

    const camilo = algosdk.mnemonicToSecretKey(process.env.PASSPHRASE!)
    console.log(camilo)
   
    const algod = algokit.getAlgoClient(algokit.getAlgoNodeConfig('testnet', 'algod'))

    const indexer = algokit.getAlgoIndexerClient(algokit.getAlgoNodeConfig('testnet', 'algod'))

  
    //obtener información de la cuenta camilo
    console.log(await algod.accountInformation(camilo.addr).do())

    const assetId = 302301229;
    const assetInfo = await indexer.lookupAssetByID(assetId).do();

    console.log(await assetInfo)




}

main();
