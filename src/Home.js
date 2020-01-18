import React from 'react';
import './App.css';
import { Grid, Button, Modal, Form, Loader } from 'semantic-ui-react';
import Blockie from 'ethereum-blockies-base64'

import { getTokenFactoryContract } from './Ethereum';

const Home = ({ web3, myTokens, loadEthereum }) => {
    const [modal, setModal] = React.useState(false)
    const [transactionHash, setTransactionHash] = React.useState(false)
    const [transactionReceipt, setTransactionReceipt] = React.useState(false)
    const [error, setError] = React.useState(false)

    const deployNewToken = async(name, symbol, decimals, supply) => {
        if(!name || !symbol){
            alert('Missing form parameters')
            return
        }
        if(decimals<0 || decimals>32){
            alert("Decimals Max Value is 32")
            return
        }
        if(supply<=0){
            alert('Supply need to be higher than 0')
            return
        }
        if(symbol.length>4 || symbol.length<3){
            alert('Symbol need to be 3 or 4 characters')
            return
        }
        if((supply.toString().includes('.') || decimals.toString().includes('.'))){
            alert('Decimals Values Not Allow')
            return
        }
        try{
            setError(false)
            const tokenFactoryContract = await getTokenFactoryContract()
            tokenFactoryContract.methods.deployToken(name, symbol, decimals, supply).send({from: web3.address})
            .on('transactionHash', function(hash){
                setTransactionHash(hash)
            })
            .on('receipt', function(receipt){
                setTransactionReceipt(receipt)
                return
            })
            .on('error', function(error){
                console.log(error)
                setError(true)
                return
            })
        }catch(error){
            console.log(error)
            setError(true)
        }
    }

    const clean = () => {
        setModal(false)
        setTransactionHash(false)
        setTransactionReceipt(false)
        setError(false)
        loadEthereum()
    }

    return(
        <Grid centered>
            <Grid.Row centered>
                <p style={{fontSize: 20}}>ERC-20 Generator</p>
            </Grid.Row>
        <Grid centered style={{padding:10, margin: 25, borderRadius: 25, backgroundColor: '#1b1919'}}>
            <Grid.Row centered>
                <p><span className="dot"></span>Ethereum Main Network</p>
            </Grid.Row>
            <div>
                <img src={Blockie(web3.address)} alt="User Avatar" style={{width: 50, weigth: 50}} />
                <p>{web3.address}</p>
            </div>
            <Grid.Row>
            <Button onClick={() => setModal(true)} primary>Create New ERC-20 Token</Button>
            <ModalCreateToken closeModal={() => setModal(false)} open={modal} deployNewToken={deployNewToken} />
            <ModalTransaction error={error} clean={clean} transactionHash={transactionHash} transactionReceipt={transactionReceipt} />
            </Grid.Row>
            <Grid.Row>
            <p style={{fontSize: 20}}>My Deploy Tokens</p>
            </Grid.Row>
            {myTokens.length === 0 &&
                <Grid.Row>
                <p>No ERC-20 Deploy</p>
                </Grid.Row>
            }
            {myTokens.map((token, index) => {
                const { tokenAddress, tokenName, tokenSymbol } = token.returnValues
                return(
                    <div key={index} style={{margin: 10, padding: 0, backgroundColor:"grey"}}>
                        <div style={{backgroundColor:'rgb(32, 33, 37)', width: "100%", padding: 7}}>
                            <p>{tokenName} ({tokenSymbol})</p>
                        </div>
                        <div style={{ padding: 10}}>
                            <p style={{ fontSize: 12, marginBottom: 0, color: '#d9dae4' }}>Contract Address</p>
                            <a href={`https://etherscan.io/token/${tokenAddress}`} target="_blank" rel="noopener noreferrer">
                            <p>{tokenAddress}</p>
                            </a>
                        </div>
                    </div>
                )
            })}
        </Grid>
        </Grid>
    )
}

const ModalTransaction = props => {
    return(
        <Modal open={props.transactionHash}>
        <Modal.Content style={{backgroundColor: '#e6e5e8', color:"black", padding: 10}}>
            <Grid centered style={{color:'black'}}>
                <div>
                    <label>Transaction Hash:</label>
                    <p style={{color: 'black', wordBreak:'break-all'}}>{props.transactionHash}</p>
                </div>
            {props.transactionReceipt ? 
                <Grid.Row>
                <div>
                <p style={{color: 'black', fontStyle:'italic', fontSize: 20, margin:10}}>Token Deploy!</p>
                <label>Contract Address: </label>
                <a href={`https://etherscan.io/token/${props.transactionReceipt.events.TokenDeploy.returnValues.tokenAddress    }`} target="_blank" rel="noopener noreferrer">
                <p style={{color: 'black', wordBreak:'break-all'}}>{props.transactionReceipt.events.TokenDeploy.returnValues.tokenAddress}</p>
                </a>
                </div>
                </Grid.Row>
            :
            <>
            <Grid.Row>
                <p style={{color: 'black'}}>Waiting Transaction Confirmation...</p>
            </Grid.Row>
            <Grid.Row>
                <Loader  active inline='centered'/>
            </Grid.Row>
            </>
            }
            {props.error && 
            <Grid.Row>
                <label>Error on Transaction</label>
            </Grid.Row>
            }
            <Grid.Row>
                <Button style={{margin:5}} primary onClick={() => props.clean()}>Close Modal</Button>
            </Grid.Row>
            </Grid>
        </Modal.Content>
        </Modal>
    )
}

const ModalCreateToken = props => {
    const [name, setName] = React.useState('')
    const [symbol, setSymbol] = React.useState('')
    const [supply, setSupply] = React.useState(0)
    const [decimals, setDecimals] = React.useState(16)


    return(
        <Modal open={props.open}>
        <Modal.Header style={{backgroundColor: 'rgba(0, 0, 0, 0.71)', color:'white'}}>Create ERC-20 Token</Modal.Header>
        <Modal.Content style={{backgroundColor: '#e6e5e8'}}>
            <Grid centered>
            <Form style={{margin:30}}>
            <Form.Field>
                <label>Token Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Field>
            <Form.Field>
                <label>Token Symbol</label>
                <input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} />
            </Form.Field>
            <Form.Field>
                <label>Token Supply</label>
                <input value={supply} type="number" min="0" step="1" onChange={(e) => setSupply(e.target.value)} />
            </Form.Field>
            <Form.Field>
                <label>Token Decimals</label>
                <input value={decimals} type="number" min="0" step="1"  onChange={(e) => setDecimals(e.target.value)} />
            </Form.Field>
            <Form.Field>
                <Button color='green' onClick={() => props.deployNewToken(name, symbol, decimals, supply)}>Confirm Transaction</Button>
            </Form.Field>
            <Form.Field>
                <Button color='red' onClick={() => props.closeModal()}>Close Modal</Button>
            </Form.Field>
            </Form>
            </Grid>
        </Modal.Content>
        </Modal>
    )
    }

export default Home