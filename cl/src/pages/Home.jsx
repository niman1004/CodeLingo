import React from 'react';
import Heatmap from '../components/Heatmap';
import StreakDisplay from '../components/StreakDisplay';
import Postform from '../components/Postform';
import Container from '../components/container/Container';

function Home() {
  return (
    <div className="w-full">
      <Container>
        <div className="flex flex-col lg:flex-row   p-4 bg-black space-y-4 lg:space-y-0 lg:space-x-4">
          
          {/* Left Side: Heatmap */}
          <div className="w-full lg:w-1/2 flex-1 ">
            <Heatmap />
          </div>

          {/* Right Side: StreakDisplay and Postform */}
          <div className="w-full lg:w-1/2 h-1/2 flex-1 flex flex-col space-y-4">
            <StreakDisplay />
            <Postform />
          </div>
          
        </div>
      </Container>
    </div>
  );
}

export default Home;
