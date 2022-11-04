import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/layout/navbar/Navbar'
import Footer from './components/layout/footer/Footer'
import Home from './components/home-container/home/Home'
import PostDetails from './components/home-container/post-details/PostDetails'
import VideoGallery from './components/video-gallery/VideoGallery'
import VideoPlayer from './components/videoplayer/VideoPlayer'
import CreatePost from './components/create-post/CreatePost'
import Web3 from 'web3'
import MyPost from './abis/Post.json'
import { useState } from 'react'

function App() {
  // Add variables
  const [account, setAccount] = useState('')
  const [contractData, setContractData] = useState('')

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.request({ method: 'eth_requestAccounts' })
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert(
        'Non-Ethereum browser detected. You should consider trying Metamask!',
      )
    }
  }

  const getContract = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])
    const networkId = await web3.eth.net.getId()
    const networkData = MyPost.networks[networkId]

    if (networkData) {
      const abi = MyPost.abi
      const address = MyPost.networks[networkId].address
      const myContract = new web3.eth.Contract(abi, address)
      setContractData(myContract)
    } else {
      window.alert(
        'Contract is not deployed to the detected network. Connect to the correct network!',
      )
    }
  }

  const connectWallet = async () => {
    await loadWeb3()
    await getContract()
  }

  return (
    <Router>
      <div className="cl">
        <Navbar account={account} connectWallet={connectWallet} />
        <Route exact path="/" component={Home} />
        <Switch>
          <Route exact path="/create-post" component={CreatePost} />
          <Route path="/post-details/:postId">
            <PostDetails account={account} contractData={contractData} />
          </Route>
        </Switch>
        <Route exact path="/videos" component={VideoGallery} />
        <Route exact path="/post-video" component={VideoPlayer} />
        <Footer />
      </div>
    </Router>
  )
}

export default App
