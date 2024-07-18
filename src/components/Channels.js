const Channels = ({ provider, account, cryptalchat, channels, currentChannel, setCurrentChannel }) => {

  // 여기다가 채널 nft 없으면 사게 해야댐
  const channelHandler = async (channel) => {
    
    console.log("clicked..")
    const hasJoined = await cryptalchat.hasJoined(channel.id, account)
    
    if(hasJoined) {
      console.log("joined!!")
      setCurrentChannel(channel)
    }
    else {
      // 해당 채널 입장 시 nft 사게 함
      console.log("not joined...")
      const signer = await provider.getSigner()
      const transaction = await cryptalchat.connect(signer).mint(channel.id, { value: channel.cost })
      await transaction.wait()
      setCurrentChannel(channel)
    }
  }
  return (
    <div className="channels">
      <div className="channels__text">
        <h2>Text Channels</h2>

        <ul>
        {channels.map((channel, index) => (
          <li 
            key={index} 
            onClick={() => channelHandler(channel)}
            // 누른 버튼 active
            className={currentChannel && currentChannel.id.toString() === channel.id.toString() ? "active" : ""}
            > {channel.name} </li>
        ))}
        </ul>
        
      </div>

      <div className="channels__voice">
        <h2>Voice Channels</h2>

        <ul>
          <li>Channel 1</li>
          <li>Channel 2</li>
          <li>Channel 3</li>
        </ul>
      </div>
    </div>
  );
}

export default Channels;