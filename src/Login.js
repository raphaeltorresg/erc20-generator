import React from 'react';
import './App.css';
import { Grid, Button } from 'semantic-ui-react';

const Login = ({loadEthereum, loading }) => {
    return(
        <Grid centered verticalAlign='middle' style={{padding:10, margin: 10}}>
            <div style={{backgroundColor: '#5e5e6b40', padding: 15, marginTop: 160, borderRadius: 25}}>
            <p style={{fontSize: 25, margin: 0}}>ERC-20 Generator</p>
            <p style={{margin:0,color:'#d4d4d4'}}>Create and Manage ERC-2O Tokens on Ethereum Blockchain</p>
            {loading ? 
            <Button style={{marginTop: 20}} loading primary>Loading</Button>
            :    
            <Button style={{marginTop: 20}} onClick={() => loadEthereum()} primary>Login with Ethereum Wallet</Button>
            }
            </div>
        </Grid>
    )
}

export default Login