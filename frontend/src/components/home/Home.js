import React from 'react';
import Filter from '../filter/Filter';
import SearchBox from '../searchBox/SearchBox';
import LocationMap from './Map'

const Home = () => {
  return (
    <div className="App">
      Home ROUTE
      <Filter />
      <SearchBox />
      <div>
        <LocationMap />
      </div>
    </div>
  );
}

export default Home;
