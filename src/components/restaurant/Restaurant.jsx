import { useEffect, useState } from "react";
import Header from "../../ReusableComponents/Header.jsx";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CustomMenu from "../../ReusableComponents/Menu.jsx";
import "./Restaurant.css";
import {fetchRestaurants, fetchCategories} from "../../apis.js";

function Restaurant() {
  // State to store fetched restaurants and filtered restaurants
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  const [foodCategory, setFoodCategory] = useState(["All"]); // Default to ["All"]
  const [selectedCategory, setSelectedCategory] = useState("Sort by category");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurantData = await fetchRestaurants();
        setRestaurants(restaurantData);
        setFilteredRestaurants(restaurantData);

        const categoryData = await fetchCategories();
        const categories = categoryData.map((category) => category.Category);

        // Update foodCategory state
        setFoodCategory(["All", ...categories]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to handle category selection
  const handleCategorySelect = (selectedCategory) => {
    setSelectedCategory(selectedCategory);
    if (selectedCategory === "All") {
      setFilteredRestaurants(restaurants); // Show all restaurants
    } else {
      const filtered = restaurants.filter(
        (restaurant) => restaurant.category === selectedCategory
      );
      setFilteredRestaurants(filtered); // Show filtered restaurants
    }
  };

  return (
      <div className="restaurant-page">
        <Header/>
        <div className="main container section" style={{paddingLeft: "88px", paddingRight: '88px'}}>
          <div className="secTitle">
            <p className="title" style={{fontSize: "32px", margin: "0px"}}>Restaurants</p>
          </div>
          <div className="search-menu-container" style={{gap: '10px'}}>
            <CustomMenu
                text={selectedCategory}
                categories={foodCategory}
                onCategorySelect={handleCategorySelect}
            />
          </div>
        </div>
        <div className="secContent grid" style={{paddingLeft: "88px", paddingRight: '88px'}}>
          {filteredRestaurants.length === 0 ? (
              <p>No restaurants found</p>
          ) : (
              filteredRestaurants.map(({resName, imgSrc, address, name}) => (
                  <a href={`restaurant/${resName}`}>
                    <div key={resName} className="singleRetaurant">
                      <div className="imageDiv">
                        <img src={imgSrc} alt={resName}/>
                      </div>
                      <div className="cardInfo">
                        <h4 className="resTitle">{name}</h4>
                        <span className="continent flex">
                  <LocationOnIcon className="icon"/>
                  <span className="name">{address}</span>
                </span>
                      </div>
                    </div>
                  </a>
              ))
          )}
        </div>
        <footer>
          <p>&copy; 2024 EatLa! All Rights Reserved.</p>
        </footer>
      </div>
  );
}

export default Restaurant;
