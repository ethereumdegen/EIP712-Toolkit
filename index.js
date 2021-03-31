

import  fs   from 'fs';
import beautify from "json-beautify";

import path from 'path';

import GenerationHelper from './lib/GenerationHelper.js' 
import EIP712Utils from './lib/EIP712Utils.js' 
/*

    let contractDataJSON = fs.readFileSync(path.join('src/config/contractdata.json'));
    let contractData = JSON.parse(contractDataJSON)

*/

function start(){

    console.log('Building EIP712 files...')

    generateSolidityFile()

    console.log('Built EIP712 files.')



    let customConfigJSON = fs.readFileSync(path.join('eip712-config.json'));
    let customConfig = JSON.parse(customConfigJSON)


      /*
      MAKE SURE YOU CHANGE THIS VARIABLE IF YOU MODIFY eip712-config.json!!!
      */     
    let dataValues = {
        customName:"myName",
        bidderAddress:"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
        nftContractAddress:"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
        currencyTokenAddress:"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
        currencyTokenAmount:100,
        requireProjectId:true,
        projectId:123,
        expires:50000 
    }


    let chainId = 1
    let contractAddress = '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'


    const typedData = EIP712Utils.getTypedDataFromParams( 
        chainId,  
        contractAddress,
        customConfig,
        dataValues  
   )
    

   console.log('typedData',typedData)

    //var stringifiedData =  (  typedData );

    
     let typedDatahash = EIP712Utils.getTypedDataHash(typedData)

     console.log('typedDatahash',typedDatahash)


}

function generateSolidityFile(){

    let customConfigJSON = fs.readFileSync(path.join('eip712-config.json'));
    let customConfig = JSON.parse(customConfigJSON)

    let sampleEcRecoverContract = GenerationHelper.getECRecoveryContract()


    let outputData = 'pragma solidity ^0.5.17;'

    outputData = outputData.concat('\n\n\n\n')
    outputData = outputData.concat(sampleEcRecoverContract)
    outputData = outputData.concat('\n\n\n\n')

    outputData = outputData.concat(`contract ${customConfig.contractName} is ECRecovery {`)
    outputData = outputData.concat('\n\n')
    outputData = outputData.concat(GenerationHelper.getConstructor( customConfig  ) )

    outputData = outputData.concat('\n\n')
    outputData = outputData.concat(GenerationHelper.getCustomStruct( customConfig ) )



    outputData = outputData.concat('\n\n')
    outputData = outputData.concat(GenerationHelper.getEIP712DomainCode() )


    outputData = outputData.concat('\n\n')
    outputData = outputData.concat(GenerationHelper.getCustomPacketTypehashMethod( customConfig ))

    outputData = outputData.concat('\n\n')
    outputData = outputData.concat(GenerationHelper.getCustomPacketHashMethod( customConfig ))


    outputData = outputData.concat('\n\n')
    outputData = outputData.concat(GenerationHelper.getCustomTypedDatahashMethod( customConfig ))

    outputData = outputData.concat('\n\n')
    outputData = outputData.concat(GenerationHelper.getVerificationMethod( customConfig ))

    

    outputData = outputData.concat('\n\n')
    outputData = outputData.concat(`}`)///end contract


    const contractLookupPath = path.join( './generated/contracts/soliditySample.sol' )

    fs.writeFile(contractLookupPath, outputData , (err) => {
        if (err) {
            throw err;
        }


    //      console.log('rebuilt world data in ', Date.now() - startTime, 'ms')
    });





}


start()