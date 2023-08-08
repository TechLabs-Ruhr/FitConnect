const Geolocation = ({ panTo }) => {
    return (
      <button 
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            })
          }, () => null
          );
      }}
      >
        <img src="img/compass.png" alt="compass" />
      </button>
    );
  }

  export default Geolocation; 