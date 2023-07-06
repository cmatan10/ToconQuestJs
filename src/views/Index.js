
// core components
import Header from "components/Headers/Header.js";
import Card from "components/Card.js";
import { cards } from "components/Data/IndexData.js";
import { useContext, useState, useEffect } from 'react';
import { Web3Context } from '../index';
import AdminFooter from '../components/Footers/AdminFooter.js'
import CarouselComponent from '../components/Headers/CarouselComponent.js'
import '../assets/css/game.css'

const Index = () => {
  const web3Context = useContext(Web3Context);
  const [walletAddress, setWalletAddress] = useState(web3Context.walletAddress);
  const { nftContract } = useContext(Web3Context);
  const [stages, setStages] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);


  // Function to get stage status
  const getStageStatus = async (id) => {
    if (!walletAddress) {
      return "Unsolved";
    }
    const balance = await nftContract.methods.balanceOf(walletAddress, id).call();
    // console.log(`Balance of token ${id} in wallet ${walletAddress}: ${balance}`);
    // console.log(stages);
    return balance > 0 ? 1 : 0;
  };

  useEffect(() => {
    const updateStages = async () => {
      const updatedStages = await Promise.all(stages.map((_, index) => getStageStatus(index + 1)));
      setStages(updatedStages);
    };
    if (walletAddress) {
      updateStages();
    }
  }, [walletAddress, nftContract]);

  useEffect(() => {
    if (web3Context.walletAddress !== walletAddress) {
      setWalletAddress(web3Context.walletAddress);
    }
  }, [web3Context.walletAddress]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', function (accounts) {
        // Time to reload your interface with accounts[0]!
        setWalletAddress(accounts[0]);
      });
    }
  }, []);

  return (
    < >
      <Header />

      <div className="title-container">
        <p className="index-title" style={{ fontFamily: 'Montserrat'}}>welcome to solidity games world</p>
      </div>
      <div className="card-container-custom">
        {cards.map((card, index) => (
          <Card
            key={index}
            url={card.url}
            title={card.title}
            description={card.description}
            imageUrl={card.imageUrl}
            difficulty={card.difficulty}
            stageNumber={card.stageNumber}
            status={stages[card.stageNumber] === 1 ? <b style={{ color: 'green' }}>Successfully solved</b> : <b style={{ color: 'gray' }}>Unsolved</b>}
          />
        ))}
      </div>
      <div className="title-container">
        <p className="index-title" style={{ fontFamily: 'Montserrat', fontSize: '3em'}}>More levels are coming soon . . .</p>
      </div>
      <AdminFooter />
    </>
  );
};

export default Index;

