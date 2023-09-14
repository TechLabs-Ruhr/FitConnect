import mapsStyles from "../components/map/mapStyles/mapStyles"; 

export const libraries = ["places"]; 
 
export const mapContainerStyle = { 
    width: "100vw", 
    height: "100vh" 
} 
 
export const options = { 
    styles: mapsStyles, 
    disableDefaultUI: true, 
    zoomControl: false 
}