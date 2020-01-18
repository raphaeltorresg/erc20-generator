import React from 'react';
import './App.css';
import { Grid } from 'semantic-ui-react';
import Login from './Login';
import Home from './Home';
import { fetchEthereum, getDeployTokens } from './Ethereum';

const App = () => {

  const [web3, setWeb3] = React.useState(false)
  const [page, setPage] = React.useState(0)
  const [myTokens, setMyTokens] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  const loadEthereum = async() => {
    try{
      setLoading(true)
      const { ethereum, address, networkId } = await fetchEthereum()
      setWeb3({ ethereum, address })
      if(networkId !== 1){
        alert('Please, connect on Ethereum Main Network')
        setLoading(false)
        return
      }
      const tokenEvents = await getDeployTokens(address)
      setMyTokens(tokenEvents)
      setPage(1)
      setLoading(false)
    }catch(error){
      setLoading(false)
      alert('Error Loading your Ethereum Account')
    }
  }

 
  return(
    <Grid centered style={{}}>
      {(page === 0) && <Login loadEthereum={loadEthereum} loading={loading} /> }
      {(page === 1) && <Home web3={web3} loadEthereum={loadEthereum} myTokens={myTokens} /> }        
    </Grid>
  )

}

export default App