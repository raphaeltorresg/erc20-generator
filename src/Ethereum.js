import Web3 from  'web3'
import TokenFactoryInteface from './token-contract/TokenFactoryInterface.json'

export const fetchEthereum = () => new Promise(async (resolve, reject) => {
    try {
      const ethereum = new Web3(window.ethereum)
      await window.ethereum.enable()
      const [address] = await ethereum.eth.getAccounts()
      const networkId = await ethereum.eth.getChainId()
      resolve({ethereum, address, networkId})
    } catch (error) {
      reject(error)
    }
})

export const getTokenFactoryContract = () => new Promise(async(resolve, reject) => {
    try{
      const { ethereum } = await fetchEthereum()
      const contract = new ethereum.eth.Contract(TokenFactoryInteface, "0x12d411079704a7fd5d6e2e2d64f8405f7470bdca")
      resolve(contract)
    }catch(error){
      console.error(error)
      reject(error)
    }
})

export const getDeployTokens = ownerAddress => new Promise(async(resolve, reject) => {
    try{
        const tokenFactoryContract = await getTokenFactoryContract()
        const events = await tokenFactoryContract.getPastEvents('TokenDeploy', {
            filter:{ tokenOwner: ownerAddress},
            fromBlock: 5811158,
            toBlock: 'latest'
        })
        resolve(events)
    }catch(error){
        console.error(error)
        reject(error)
    }
})
