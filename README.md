## EIP712 Offchain Signatures Toolkit 


#### Getting Started
First, modify the file 'eip-712-config.json' to your liking 

Then, modify 'dataValues' variable in both '/test/ganacheTest.js' and in 'index.js'


[or skip those first two steps]


Then, run the 'build, compile, test' commands to build and test associated solidity files for your EIP712 project


Use the Helper and Utils libraries along with your eip712-config.json file in your frontend web3 project to interact with that solidity code ! 



To generate the offchain signature using metamask instead, use this method:

    let signResult = await  EIP712Helper.signTypedData(   )
     


#### Commands: 
    nvm install 14 (requires node14)
    nvm use 14

    npm install 
    npm run build 


    npm run compile 
    npm run test 