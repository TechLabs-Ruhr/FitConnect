import Map from "./map/Map";
import SideBar from "./sideBar/SideBar";
import './style.scss';
import 'normalize.css';

function App() {
  return (
    <>
    {/* <Router>
      <Navbar />
      <Switch>

      </Switch>
    </Router> */}
      <SideBar />
      <Map />
    </>
  )
}

export default App;
