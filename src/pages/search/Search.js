import React from 'react'
import Map from "../../components/map/Map";
import SideBar from "../../components/sideBar/SideBar";
import Spinner from '../../components/spinner/Spinner';
import { AuthContext } from "../../context/AuthContext";
import { useContext } from 'react';

const Search = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    (currentUser && currentUser.uid) ?
      <>
        <SideBar />
        <Map />
      </>
      : (<div className="spinner-container">
        <Spinner />
      </div>)
  );
}

export default Search;