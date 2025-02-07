import { useEffect, useState} from "react";
import Header from "../ReusableComponents/Header.jsx";
import {getAllRestaurant, getGeocoding, getRestaurantForHome} from "../apis.js";
import bg from "../assets/mtb-bg.png"
import SearchBar from "../ReusableComponents/SearchBar.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import CustomCards from "../ReusableComponents/Card.jsx";
import LocationOffIcon from '@mui/icons-material/LocationOff';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {useAuth} from "../contexts/authContext/index.jsx";


function Home() {

    const {currentUserDB, userLoggedIn} = useAuth()
    const [recommendations, setRecommendations] = useState([]);
    const [locData, setLocData] = useState({});

    useEffect( () => {
        // Localstorage get Location Data
        const items = JSON.parse(localStorage.getItem('locData'));
        if (items) {
            setLocData(items);
        } else {
            getCurrentLocation();
        }
    }, [])

    useEffect(() => {
        async function fetchRecommendations() {
            const prefArr = userLoggedIn ? currentUserDB.preference : null
            const loc = Object.keys(locData).length !== 0 ? locData : null
            const data = await getRestaurantForHome(loc, prefArr);
            setRecommendations(data);
        }

        fetchRecommendations()
    }, [locData]); // This runs whenever locData changes

    async function getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            console.error("Geolocation not supported");
        }

        async function success(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            try {
                const data = await getGeocoding(latitude, longitude);
                if (data) {
                    setLocData({address: data.formatted_address, lng: longitude, lat: latitude});
                    localStorage.setItem("locData", JSON.stringify({address: data.formatted_address, lng: longitude, lat: latitude}));

                }
            } catch (error) {
                console.error("Error fetching geocode:", error);
            }
        }

        function error() {
            console.log("Unable to retrieve your location");
        }
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2, // Corrected the property to 'slidesToShow'
        slidesToScroll: 2, // Corrected the property to 'slidesToScroll'
        variableWidth: false,
    };

  return (
      <>
          <Header></Header>
          <div style={{
              backgroundImage: `url(${bg})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              minHeight: `calc(100vh - 98px)`,
              display: 'flex',
              flexDirection: 'column',
              imageRendering: '-webkit-optimize-contrast',
              gap: '100px'
          }}>

              <div style={{padding: '100px 60px 0px 60px', maxWidth: '500px'}}>
                  <p style={{fontSize: '48px', fontWeight: '450', lineHeight: '50px'}}>Find restaurants that</p>
                  <p style={{fontSize: '48px', fontWeight: '450', lineHeight: '50px'}}>are near you.</p>
                  <div style={{
                      paddingTop: '25px', maxWidth: "430px",
                  }}>
                      {locData.address ? (
                          <SearchBar home={true} text={"What are you craving?"} search={true}></SearchBar>
                      ) : (
                          <SearchBar home={true} text={"Enter your location..."}></SearchBar>
                      )}
                  </div>
              </div>

              <div style={{padding: '50px 60px', maxWidth: '50%'}}>
                  <div style={{display: 'flex', flexDirection: 'row', gap: '15px'}}>
                      <p style={{fontSize: '32px', fontWeight: '450', lineHeight: '32px'}}>
                          Today's Top Picks
                      </p>
                      <p style={{
                          fontSize: '16px',
                          marginTop: 'auto',
                          lineHeight: '20px',
                          color: '#918D8D',
                          textOverflow: 'ellipsis',
                          width: '30%',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                      }}>
                          {locData.address ? (<LocationOnIcon style={{fontSize: '16px'}}/>) : (<LocationOffIcon
                              style={{fontSize: '16px'}}/>)} {locData.address ? locData.address : "No Location"}
                      </p>
                  </div>
                  <div className="carousel-container">
                      <div className="slider-container">
                          <Slider {...settings}>
                              {recommendations.map((recommendation, index) => (
                                  <div style={{width: '400px'}} key={index}>
                                      <CustomCards props={recommendation} key={index}
                                                   recommendations={true}></CustomCards>
                                  </div>
                              ))}
                          </Slider>
                      </div>
                  </div>
              </div>
          </div>
          <footer style={{position: 'fixed', bottom: '0', width: '100%'}}>
              <p>&copy; 2024 EatLa! All Rights Reserved.</p>
          </footer>
      </>
  );
}

export default Home;
