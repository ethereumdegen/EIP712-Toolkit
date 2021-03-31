import { expect } from 'chai' 
import fs from 'fs'
import path from 'path'

import ganache from 'ganache-cli' 
import  Web3 from 'web3' 

const provider = ganache.provider()
const OPTIONS = {
  defaultBlock: "latest",
  transactionConfirmationBlocks: 1,
  transactionBlockTimeout: 5
};
const web3 = new Web3(provider, null, OPTIONS);

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
  
      console.log("finished")

    });
  });