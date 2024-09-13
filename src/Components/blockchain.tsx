import Lottie from 'react-lottie';
import animationData from '../assets/Blockchain.json';

export default function App2() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
      };
    
    return (
      <div className='mb-4'>
        <Lottie 
          options={defaultOptions}
          height={1000}
          width={1300}
        />
      </div>
    );
  }
  