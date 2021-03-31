import { expect } from 'chai' 
import fs from 'fs'
import path from 'path'

import ganache from 'ganache-cli' 
import  Web3 from 'web3' 




import GenerationHelper from '../lib/GenerationHelper.js' 
import EIP712Utils from '../lib/EIP712Utils.js'

const provider = ganache.provider()
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

      let accounts = await web3.eth.getAccounts()
      let chainId = await web3.eth.net.getId()

      let myEIP712Contract = await new web3.eth.Contract(abi)
          .deploy({data: "0x" + evm.bytecode.object, arguments: [chainId]})
          .send({from: accounts[0], gas: 5000000});
  
      let contractAddress = myEIP712Contract.options.address
      console.log("deployed contract at ", contractAddress)


      let dataValues = {
        customName:"myName",
        bidderAddress:accounts[0],
        nftContractAddress:"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
        currencyTokenAddress:"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
        currencyTokenAmount:100,
        requireProjectId:true,
        projectId:123,
        expires:50000 
    }

    const typedData = EIP712Utils.getTypedDataFromParams( 
      chainId,  
      contractAddress,
      customConfig,
      dataValues  
    )
    let typedDatahash = EIP712Utils.getTypedDataHash(typedData)



    let signature = "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"



      let args = Object.values(dataValues)
      args.push(signature)

      let result = await myEIP712Contract.methods.verifyOffchainSignatureAndDoStuff(...args).send({from: accounts[0] })

      console.log("result of method call: ", result)
    });
  });