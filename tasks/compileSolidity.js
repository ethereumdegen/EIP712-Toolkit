
import solc from 'solc'
import path from 'path'
import fs from 'fs-extra'
 

const buildPath = path.resolve('generated', 'built');

const createBuildFolder = () => {
	fs.emptyDirSync(buildPath);
}

const contractFolderPath = path.resolve('generated', 'contracts');

const buildSources = () => {
  const sources = {};
  const contractsFiles = fs.readdirSync(contractFolderPath);
  
  contractsFiles.forEach(file => {
    const contractFullPath = path.resolve(contractFolderPath, file);
    sources[file] = {
      content: fs.readFileSync(contractFullPath, 'utf8')
    };
  });
  
  return sources;
}
 


const input = {
	language: 'Solidity',
	sources: buildSources(),
	settings: {
		outputSelection: {
			'*': {
				'*': [ 'abi', 'evm.bytecode' ]
			}
		}
	}
}


const compileContracts = () => {
	const compiledContractsData = JSON.parse(solc.compile(JSON.stringify(input)));


	if(compiledContractsData.errors && compiledContractsData.errors.length >= 1){
		console.error( compiledContractsData.errors )
	 
	}

 

	const compiledContracts = compiledContractsData.contracts


    console.log('compiledContracts:',compiledContracts)
	for (let contract in compiledContracts) {
		for(let contractName in compiledContracts[contract]) {
			fs.outputJsonSync(
				path.resolve(buildPath, `${contractName}.json`),
				compiledContracts[contract][contractName],
				{
					spaces: 2
				}
			)
		}
	}
}

compileContracts()