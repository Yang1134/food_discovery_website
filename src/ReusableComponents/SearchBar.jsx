import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState} from "react";
import { useMapsLibrary, Map } from "@vis.gl/react-google-maps";
import {useNavigate} from "react-router-dom";
import {getLocationWithId, getTagFromText} from "../apis.js";

function SearchBar({ home=false, setCoordinates, text, search, input="" }) {
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [placeValue, setPlaceValue] = useState("");
    const navigate = useNavigate();

    // GOOGLE API STUFF
    const map = (<Map></Map>)
    const places = useMapsLibrary('places');
    const [sessionToken, setSessionToken] = useState(null);
    const [autocompleteService, setAutocompleteService] = useState(null);
    const [placesService, setPlacesService] = useState(null);

    useEffect(() => {
        if ( !places || !map) return;

        setAutocompleteService(new places.AutocompleteService());
        setPlacesService(new places.PlacesService(map));
        setSessionToken(new places.AutocompleteSessionToken());

        return () => setAutocompleteService(null);
    }, [places]);

    useEffect(() => {
        if (input !== "") {
            setInputValue(input)
        }
    },[input])


    async function fetchPredictions(inputValue) {
        const request = {input: inputValue, sessionToken};
        const response = await autocompleteService.getPlacePredictions(request);

        const data = response['predictions'].map((res) => ({
            id: res.place_id,
            description: res.description,
        }));

        return data
    }

    async function fetchGeolocations(placeId) {
        const res = await getLocationWithId(placeId)
        const currentLocation = {
            lat: res.location.latitude,
            lng: res.location.longitude,
            address: res.formattedAddress,
        };
        console.log(currentLocation)

        // Put current location into LS
        localStorage.setItem("locData", JSON.stringify(currentLocation));

        if (home) {
            navigate('/find-food')
        }
        else {
            setCoordinates(currentLocation);
        }
    }

    async function handleInput(value) {
        if (value !== '') {
            const data = await fetchPredictions(value);
            setOptions(data)
        }
        else {
            setOptions([])
        }
    }

    async function handleSearchClick() {
        if (search) {
            const res = await getTagFromText(inputValue)
            localStorage.setItem("recommended", JSON.stringify(res));
            navigate('/find-food')
        }
        else {
            await fetchGeolocations(placeValue)
            navigate('/find-food')
        }
    }

    return (
        <>
            {/* HOME PROPS TRUE WILL CHANGE CSS, GENERAL FUNCTIONALITY IS STILL THE SAME */}
            {home === true ? (
                <div
                    style={{
                        height: "48px",
                        display: "flex",
                        flexDirection: "row",
                        backgroundColor: "white",
                        borderRadius: "100px",
                        textAlign: "center",
                        alignItems: "center",
                        padding: "0 7px 0 20px",
                        gap: "7px",
                    }}
                >
                    {search === true ? (
                        <TextField
                            variant="standard"
                            placeholder={text}
                            slotProps={{
                                input: {
                                    disableUnderline: true,
                                },
                            }}
                            style={{ flex: 1 }}
                            onChange={(e) => { setInputValue(e.target.value); }}
                        />
                    ) : (
                        <Autocomplete
                            freeSolo
                            options={options} // Array of objects with { id, description }
                            filterOptions={(options) => options} // Prevent filtering
                            getOptionLabel={(option) =>
                                typeof option === "string" ? option : option.description // Display `description`
                            }
                            isOptionEqualToValue={(option, value) => option.id === value.id} // Ensure correct matching
                            inputValue={inputValue}
                            onInputChange={(event, value) => {
                                setInputValue(value);
                                handleInput(value);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    placeholder={text}
                                    slotProps={{
                                        input: {
                                            ...params.InputProps,
                                            disableUnderline: true,
                                        },
                                    }}
                                    style={{ flex: 1 }}
                                />
                            )}
                            onChange={(event, value) => {
                                value && setPlaceValue(value.id)
                            }}
                            style={{ flex: 1 }}
                        />
                    )}
                    <button
                        style={{
                            borderRadius: "100px",
                            height: "34px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#FD843D",
                        }}
                        onClick={() => {
                            handleSearchClick()
                        }}
                    >
                        <p>Search</p>
                    </button>
                </div>
            ) : (
                <div
                    style={{
                        height: "50px",
                        width: '384px',
                        display: "flex",
                        flexDirection: "row",
                        backgroundColor: "white",
                        borderRadius: "100px",
                        textAlign: "center",
                        alignItems: "center",
                        padding: "0 7px 0 20px",
                        gap: "7px",
                        marginTop: 'auto',
                        marginBottom: 'auto'
                    }}
                >
                    <Autocomplete
                        freeSolo
                        options={options} // Array of objects with { id, description }
                        filterOptions={(options) => options} // Prevent filtering
                        getOptionLabel={(option) =>
                            typeof option === "string" ? option : option.description // Display `description`
                        }
                        isOptionEqualToValue={(option, value) => option.id === value.id} // Ensure correct matching
                        inputValue={inputValue}
                        onInputChange={(event, value) => {
                            setInputValue(value);
                            handleInput(value);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                placeholder="Search..."
                                slotProps={{
                                    input: {
                                        ...params.InputProps,
                                        disableUnderline: true,
                                    },
                                }}
                                style={{ flex: 1 }}
                            />
                        )}
                        onChange={(event, value) => {
                            value && fetchGeolocations(value.id)
                        }}
                        style={{ flex: 1 }}
                    />
                </div>
            )}
        </>
    );
}

export default SearchBar;
