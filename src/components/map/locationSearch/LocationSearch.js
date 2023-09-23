import { Autocomplete } from "@react-google-maps/api";
import { useRef, useState } from "react";
import './locationSearch.scss';

const LocationSearch = ({ panTo }) => {
    const [inputValue, setInputValue] = useState('');
    const ref = useRef();

    const handleLoad = (autocomplete) => {
        ref.current = autocomplete;
    };

    const handlePlaceChanged = () => {
        const place = ref.current.getPlace();

        if (!place.geometry) return;

        panTo({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
        });
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleClearInput = () => {
        setInputValue('');
    };

    return (
        <div className="search">
            <Autocomplete onLoad={handleLoad} onPlaceChanged={handlePlaceChanged}>
                <input
                    type="text"
                    placeholder="Enter a location"
                    className="autocomplete"
                    value={inputValue}
                    onChange={handleInputChange}
                />
            </Autocomplete>
            {inputValue && (
                <button onClick={handleClearInput} className="clear-input-btn" title="clear">
                    ×
                </button>
            )}
        </div>
    );
}

export default LocationSearch; 
