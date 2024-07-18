import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { io } from "socket.io-client"

// Components
import Navigation from './components/Navigation'
import Servers from './components/Servers'
import Channels from './components/Channels'
import Messages from './components/Messages'

// ABIs
import Cryptalchat from './abis/Cryptalchat.json'

// Config
import config from './config.json';

// Socket
const socket = io('ws://10.10.0.178:3030')

function App() {

  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [cryptalchat, setCryptalchat] = useState(null)
  const [channels, setChannels] = useState([])
  const [currentChannel, setCurrentChannel] = useState(null)
  const [messages, setMessages] = useState([])

  const loadBlockchainData = async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()
    // Contract( address, abi, signerOrprovider)
    const cryptalchat = new ethers.Contract(config[network.chainId].Cryptalchat.address, Cryptalchat, provider)
    setCryptalchat(cryptalchat)

    const totalChannels = await cryptalchat.totalChannels()
    // console.log(totalChannels.toString())

    const channels = []
    for (var i = 1; i <= totalChannels; i++) {
      const channel = await cryptalchat.getChannel(i)
      channels.push(channel)
    }

    setChannels(channels)

    // console.log(channels)
    // console.log(cryptalchat.address)

    // 계정 변경
    window.ethereum.on('accountsChanged', async () => {
      window.location.reload()
    })
  }

  useEffect(() => {
    loadBlockchainData()

    socket.on("connect", () => {
      console.log("socket connected...")
      socket.emit('get messages')
    })

    socket.on("new message", (messages) => {
      setMessages(messages)
    })

    socket.on("get messages", (messages) => {
      setMessages(messages)
    })

    return () => {
      socket.off("connect")
      socket.off("new meessage")
      socket.off("get messages")
    }

  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount}/>

      <main>

        <Servers/>
        <Channels 
          provider={provider}
          account={account}
          cryptalchat={cryptalchat}
          channels={channels}
          currentChannel={currentChannel}
          setCurrentChannel={setCurrentChannel}
          />
        <Messages account={account} messages={messages} currentChannel={currentChannel}/>
      </main>
    </div>
  );
}

export default App;
