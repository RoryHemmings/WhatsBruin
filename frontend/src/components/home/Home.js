import React from 'react';
import Filter from '../filter/Filter';
import LocationMap from './Map'

const Home = () => {
  return (
    <div className="App">
      <Filter />
      <div>
        <LocationMap />
      </div>
    </div>
  );
}

export default Home;
