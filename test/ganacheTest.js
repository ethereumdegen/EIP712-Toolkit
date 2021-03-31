import { expect } from 'chai' 
import fs from 'fs'
import path from 'path'

import ganache from 'ganache-cli' 
import  Web3 from 'web3' 

import ethUtil from 'ethereumjs-util'

 
import EIP712Utils from '../lib/EIP712Utils.js'

import EIP712Helper from '../lib/EIP712Helper.js'

let testAccount = {
  publicAddress: '0x95eDA452256C1190947f9ba1fD19422f0120858a',
  secretKey: "0x31c354f57fc542eba2c56699286723e94f7bd02a4891a0a7f68566c2a2df6795",
  balance: "1000000000000000000000000000000000"

}

const ganacheOptions = { gasLimit: 8000000, accounts:[testAccount] };

const provider = ganache.provider( ganacheOptions )
const OPTIONS = {
  defaultBlock: "latest",
  transactionConfirmationBlocks: 1,
  transactionBlockTimeout: 5 
};

 
 
const web3 = new Web3(provider, null, OPTIONS);

let customConfigJSON = fs.readFileSync(path.join('eip712-config.json'));
let customConfig = JSON.parse(customConfigJSON)

//const { abi, evm } = require('../compile');
let contractJSON = fs.readFileSync(path.join('generated/built/MyFirstContract.json'));
let contractData = JSON.parse(contractJSON)

let abi = contractData.abi
let evm = contractData.evm

describe("EIP712 Contract Testing", function() {
    it("deploys contract", async function() {

      ///let accounts = await web3.eth.getAccounts()
      let chainId = await web3.eth.net.getId()

      let primaryAccountAddress = testAccount.publicAddress

      let myEIP712Contract = await new web3.eth.Contract(abi)
          .deploy({data: "0x" + evm.bytecode.object, arguments: [chainId]})
          .send({from:  primaryAccountAddress, gas: 5000000});
  
      let contractAddress = myEIP712Contract.options.address
      console.log("deployed contract at ", contractAddress)


      let dataValues = {
        customName:"myName",
        bidderAddress: primaryAccountAddress,
        nftContractAddress:"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
        currencyTokenAddress:"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
        currencyTokenAmount:100,
        requireProjectId:true,
        projectId:123,
        expires:50000 
    }

    console.log('chainId', chainId)

    const typedData = EIP712Utils.getTypedDataFromParams( 
      chainId,  
      contractAddress,
      customConfig,
      dataValues  
    )

    console.log('typedData', (typedData))
    let typedDatahash = EIP712Utils.getTypedDataHash(typedData) 

     

 

    /*
    This is what you would do in your frontend to make metamask pop up 
    This would output the signature value 


     let signResult = await  EIP712Helper.signTypedData( web3, from, stringifiedData  )
         
    */



   
    var privateKey = testAccount.secretKey;
    var privKey = Buffer.from(privateKey.substring(2), 'hex')
 
    
    //let signature = EIP712Utils.signTypedData(privKey,typedData ) 


    




    const sig = ethUtil.ecsign( typedDatahash   , privKey );
    //const sig = ethUtil.ecsign( typedDatahash , privKey );
    var signature = ethUtil.toRpcSig(sig.v, sig.r, sig.s);
    //this signatre is wrong 


    let recoveredSigner = EIP712Utils.recoverPacketSigner(typedData, signature)
    console.log('recoveredSigner', recoveredSigner )
      

      let args = Object.values(dataValues)
      args.push(signature)

      console.log('args', args )

      let result = await myEIP712Contract.methods.verifyOffchainSignatureAndDoStuff(...args).send({from:  primaryAccountAddress })

      console.log("result of method call: ", result)
    });
  });