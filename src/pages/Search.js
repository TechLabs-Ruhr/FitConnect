import React from 'react'
import Map from "../components/map/Map";
import SideBar from "../components/sideBar/SideBar";

const Search = () => {
  return (
    <>
      <SideBar />
      <div style={{ position: 'fixed' }}>
        <Map />
      </div>
    </>
  )
}

export default Search