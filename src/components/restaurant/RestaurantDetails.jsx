import { useParams } from "react-router-dom";
import Header from "../../ReusableComponents/Header.jsx";
import {useEffect, useState} from "react";
import {getRestaurant} from "../../apis.js";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CustomCards from "../../ReusableComponents/Card.jsx";
import {Map, Marker} from "@vis.gl/react-google-maps";

const RestaurantDetails = () => {
    const { id } = useParams();
    const [restDetails, setRestDetails] = useState({});
    const [opHours, setOpHours] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(true);
    const [selectedMap, setSelectedMap] = useState(false);
    console.log(id);

    useEffect(() => {
        async function fetchData() {
            const res = await getRestaurant(id)
            setOpHours([res.operatingHours.open, res.operatingHours.close]);
            setRestDetails(res);
        }

        fetchData();
    }, [])

    return (
        <>
            <Header></Header>

            {/* Details */}
            <div style={{display: "flex", padding: '36px 88px'}}>
                <img src={`${restDetails.thumb_img_url}`} alt={'restaurant'}
                     style={{width: '550px', height: '370px', paddingRight: '50px'}}></img>
                <div style={{display: "flex", flexDirection: 'column', gap: '10px'}}>
                    <p style={{fontSize: "32px", margin: "0px", lineHeight: '80%'}}>{restDetails.name}</p>
                    <div style={{display: 'flex', alignItems: 'center', padding: '15px 0'}}>
                        {[...Array(restDetails.ratings)].map((_, index) => (
                            <StarIcon key={index} style={{color: '#FFD700'}}/>
                        ))}
                    </div>
                    <p>Operating Hours: {opHours[0]} - {opHours[1]}</p>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <p style={{paddingRight: '10px'}}>Category:</p>
                        <div style={{
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            padding: '5px 10px',
                            borderRadius: "25px",
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            fontSize: '14px',
                            width: '100px',
                            textAlign: 'center',
                        }}>
                            {restDetails.category}
                        </div>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <LocationOnIcon
                            style={{
                                color: "#FD843D",
                                width: '16px',
                                marginBottom: 'auto'
                            }}></LocationOnIcon>
                        <p style={{color: '#918D8D'}}>{restDetails.address}</p>
                    </div>
                </div>
            </div>
            <div style={{
                display: "flex",
                padding: '0px 88px',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <div
                    onClick={() => {
                        setSelectedMap(false);
                        setSelectedMenu(true);
                    }}
                    style={{
                        flex: "1",
                        border: selectedMenu ? '1px solid #ccc' : 'none',
                        cursor: 'pointer',
                        borderBottom: selectedMap ? '1px solid #ccc' : 'none',
                        backgroundColor: selectedMenu && 'white',
                        borderTopLeftRadius: '5px',
                        borderTopRightRadius: '5px',
                        padding: '20px',
                        color: selectedMap && '#918D8D'
                    }}
                >
                    <p style={{fontSize: "24px", margin: "0px", lineHeight: '80%'}}>
                        Menu
                    </p>
                </div>
                <div
                    onClick={() => {
                        setSelectedMap(true);
                        setSelectedMenu(false);
                    }}
                    style={{
                        flex: "1",
                        border: selectedMap ? '1px solid #ccc' : 'none',
                        cursor: 'pointer',
                        borderBottom: selectedMenu ? '1px solid #ccc' : 'none',
                        backgroundColor: selectedMap && 'white',
                        borderTopLeftRadius: '5px',
                        borderTopRightRadius: '5px',
                        padding: '20px',
                        color: selectedMenu && '#918D8D'
                    }}
                >
                    <p style={{fontSize: "24px", margin: "0px", lineHeight: '80%'}}>
                        Map
                    </p>
                </div>
            </div>
            <div style={{paddingBottom: '88px'}}>
                <div
                    style={{
                        display: 'flex',
                        border: '1px solid #ccc',
                        borderTop: 'none',
                        margin: '0px 88px',
                        position: 'relative',
                        padding: '30px 0px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        backgroundColor: 'white',
                    }}
                >
                    {selectedMenu && (
                        <div>
                            {restDetails.menuType === "image" && (
                                <div>
                                    {restDetails.menu.map((item, index) => (
                                        <img src={`${item}`} alt={'menu'} key={index}></img>
                                    ))
                                    }
                                </div>
                            )}
                            {restDetails.menuType === "string" && (
                                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                    {restDetails.menu.map((item, index) => (
                                        <p key={index} style={{color: '#918D8D'}}>{item}</p>
                                    ))
                                    }
                                </div>
                            )}
                        </div>
                    )}

                    {selectedMap && (
                        <div style={{width: '500px', height: '500px'}}>
                            <Map
                                mapId={"DEMO_MAP_ID"}
                                style={{borderRadius: "20px"}}
                                defaultZoom={17}
                                minZoom={11}
                                defaultCenter={{
                                    lat: Number(restDetails.coordinates.lat),
                                    lng: Number(restDetails.coordinates.lng)
                                }}
                                gestureHandling={"greedy"}
                                disableDefaultUI={true}
                            >
                                <Marker position={{
                                    lat: Number(restDetails.coordinates.lat),
                                    lng: Number(restDetails.coordinates.lng)
                                }}></Marker>
                            </Map>
                        </div>
                    )}
                </div>
            </div>
            <footer>
                <p>&copy; 2024 EatLa! All Rights Reserved.</p>
            </footer>
        </>
    )
}

export default RestaurantDetails;