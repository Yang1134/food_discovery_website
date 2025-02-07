import {
    Map, useMap
} from "@vis.gl/react-google-maps";
import {useEffect, useState, useRef} from "react";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import CustomMenu from "../ReusableComponents/Menu.jsx";
import { getCategories, getRestaurantsWithParam } from "../apis.js";
import CloseIcon from "@mui/icons-material/Close";
import CustomCards from "../ReusableComponents/Card.jsx";
import { useNavigate } from "react-router-dom";
import Header from "../ReusableComponents/Header.jsx";
import MarkerWithInfoWindow from "../ReusableComponents/MarkerInfo.jsx";
import SearchBar from "../ReusableComponents/SearchBar.jsx";

function LocationQuery() {
    const navigate = useNavigate();
    const [coordinates, setCoordinates] = useState({ lat: 3.044917, lng: 101.445564 });
    const map = useMap();
    const restaurantRefs = useRef([]);
    const [locData, setLocData] = useState({})
    const [foodCategory, setFoodCategory] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [bounds, setBounds] = useState(null);
    const [recommended, setRecommended] = useState(false);
    const [tag, setTag] = useState([]);

    // Initial setup
    useEffect(() => {
        // Fetch location data from LS
        const items = JSON.parse(localStorage.getItem('locData'));
        if (items) {
            setLocData(items);
            setCoordinates({ lat: items.lat, lng: items.lng })
        }
        else {
            navigate('/')
        }

        // Fetch recommended tag from LS if available
        const tag = JSON.parse(localStorage.getItem('recommended'));
        if (tag) {
            setRecommended(true);
            setTag(tag.keywords);
            setSelectedCategory("Recommended")
        }

        // Fetch categories data
        async function fetchData() {
            const data = await getCategories();
            setFoodCategory(data);
        }
        fetchData()

    }, []);

    // Fetch restaurant data
    useEffect(() => {
        async function fetchData() {
            if (bounds) {
                const data = await getRestaurantsWithParam(bounds, selectedCategory, tag, locData);
                setRestaurants(data);
            }
        }

        fetchData()

    }, [bounds, selectedCategory]);

    // Pan the map to new coordinates when they change
    useEffect(() => {
        if (map) {
            map.panTo(coordinates)
        }
    }, [coordinates]);


    // Callback for smooth scrollIntoView of selected marker/restaurants
    function handleMarkerClick(index) {
        if (restaurantRefs.current[index]) {
            restaurantRefs.current[index].scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }

    // Overwrites existing coords to current geolocation
    function handleCurrentLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCoordinates({ lat: latitude, lng: longitude });
        });
    }

    // Clears recommended LS data if user click off recommended filter
    function clearRecommended() {
        setRecommended(false);
        setTag([]);
        localStorage.removeItem('recommended');
    }

    return (
        <>
            {/* Header */}
            <Header/>

            {/* Page Title */}
            <div style={{padding: "36px 88px 26px 88px"}}>
                <p style={{fontSize: "32px", margin: "0px"}}>Nearby Restaurants</p>
            </div>

            {/* Query Toolbar */}
            <div style={{padding: "0px 88px 12px 88px"}}>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "12px",
                    padding: "0px 88px 0px 88px",
                }}
            >
                <p style={{textAlign: "center", marginTop: "auto", marginBottom: "auto"}}>
                    Filters:{" "}
                </p>
                <div>
                    {selectedCategory !== null ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                textAlign: "center",
                                padding: "14px 18px 14px 18px",
                                borderRadius: "100px",
                                backgroundColor: "white",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "12px",
                            }}
                        >
                            <p style={{margin: "0px", color: "#918D8D"}}>{selectedCategory}</p>
                            <CloseIcon
                                style={{color: "#918D8D"}}
                                cursor={"pointer"}
                                onClick={() => {
                                    if (selectedCategory === "Recommended" && recommended) {
                                        clearRecommended()
                                    }
                                    setSelectedCategory(null);
                                }}
                            />
                        </div>
                    ) : (
                        <CustomMenu
                            text={"Sort by category"}
                            categories={foodCategory}
                            onCategorySelect={setSelectedCategory}
                        />
                    )}
                </div>
                <SearchBar home={false} setCoordinates={setCoordinates} input={locData.address || ""}/>
                <button
                    style={{
                        textAlign: "center",
                        padding: "0px",
                        borderRadius: "100px",
                        backgroundColor: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onClick={() => {
                        handleCurrentLocation()
                    }}
                >
                    <MyLocationIcon
                        style={{
                            color: "black",
                            padding: "14px",
                            margin: "0px",
                        }}
                    />
                </button>
            </div>

            {/* Results */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: "36px 88px 88px 88px",
                    maxHeight: "60vh",
                }}
            >
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        paddingRight: "40px",
                        maxWidth: "610px",
                    }}
                >
                    {restaurants.map((item, index) => (
                        <div
                            key={item.id}
                            ref={(el) => (restaurantRefs.current[index] = el)}
                        >
                            <CustomCards props={item}/>
                        </div>
                    ))}
                </div>
                <div style={{flex: 2, paddingLeft: "40px"}}>
                    <div style={{height: "60vh", width: "100%"}}>
                        <Map
                            mapId={"DEMO_MAP_ID"}
                            style={{borderRadius: "20px"}}
                            defaultZoom={13}
                            minZoom={11}
                            defaultCenter={coordinates}
                            gestureHandling={"greedy"}
                            disableDefaultUI={true}
                            onBoundsChanged={(e) => {
                                setBounds({
                                    neLat: e.map.getBounds().getNorthEast().lat(),
                                    neLng: e.map.getBounds().getNorthEast().lng(),
                                    swLat: e.map.getBounds().getSouthWest().lat(),
                                    swLng: e.map.getBounds().getSouthWest().lng(),
                                });
                            }}
                        >
                            {restaurants.map((item, index) => (
                                <MarkerWithInfoWindow
                                    position={{
                                        lat: Number(item.coordinates.lat),
                                        lng: Number(item.coordinates.lng),
                                    }}
                                    key={index}
                                    data={item}
                                    onClick={() => handleMarkerClick(index)}
                                />
                            ))}
                        </Map>
                    </div>
                </div>
            </div>
            <footer>
                <p>&copy; 2024 EatLa! All Rights Reserved.</p>
            </footer>
        </>
    );
}

export default LocationQuery;