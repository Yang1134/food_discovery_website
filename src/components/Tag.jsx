import { useEffect, useState } from "react";
import Header from "../ReusableComponents/Header";
import SearchBar from "../ReusableComponents/SearchBar";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CustomMenu from "../ReusableComponents/Menu";
import TagPopup from './TagPopup'; // Import the popup component
import "./Tag.css";
import { fetchRestaurants,fetchCategories, fetchTags } from "../apis";
import { doc, updateDoc, getFirestore } from "firebase/firestore";
 
function Tags() {
    // State to store fetched restaurants and filtered restaurants
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  
    const [foodCategory, setFoodCategory] = useState(["All"]); // Default to ["All"]
    const [selectedCategory, setSelectedCategory] = useState("Sort by category");
  
    const [allTags, setAllTags] = useState([]);
    const [popupOpen, setPopupOpen] = useState(false);
    const [currentRestaurant, setCurrentRestaurant] = useState(null);  
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const restaurantData = await fetchRestaurants();
          setRestaurants(restaurantData);
          setFilteredRestaurants(restaurantData);
  
          const categoryData = await fetchCategories();
          console.log("Fetched categories:", categoryData); // Debugging log
  
          // Extract the Category field
          const categories = categoryData.map((category) => category.Category);
          console.log("Mapped categories:", categories); // Debugging log
  
          // Update foodCategory state
          setFoodCategory(["All", ...categories]);
          const tagsData = await fetchTags();
          setAllTags(tagsData);
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
  
    const openTagPopup = (restaurant) => {
        setCurrentRestaurant(restaurant);
        setPopupOpen(true);
      };
    
    const closeTagPopup = () => {
        setPopupOpen(false);
      };
    const saveTags = async (updatedTags) => {
        try {
            // Update the restaurant tags in Firestore
            const db = getFirestore();
            const restaurantRef = doc(db, "Restaurants", currentRestaurant.resName); 
            await updateDoc(restaurantRef, {
              tag: updatedTags, // Update the tags field
            });
        
            // Update the restaurant tags locally
            const updatedRestaurants = restaurants.map((restaurant) =>
              restaurant.resName === currentRestaurant.resName
                ? { ...restaurant, tags: updatedTags }
                : restaurant
            );
            setRestaurants(updatedRestaurants);
            setFilteredRestaurants(updatedRestaurants);
            
            // Close the popup
            setPopupOpen(false);
          } catch (error) {
            console.error("Error updating tags in Firestore:", error);
          }
      };    
    return (
      <div className="restaurant-page">
        <Header />
        <div className="main container section">
          <div className="secTitle">
            <p className="title" style={{fontSize: "32px", margin: "0px"}}>click to change tag</p>
          </div>
          <div className="search-menu-container">
            <SearchBar home={false} />
            <CustomMenu
              text={selectedCategory} // Dynamic text
              categories={foodCategory}
              onCategorySelect={handleCategorySelect}
            />
          </div>
        </div>
        <div className="secContent grid">
          {filteredRestaurants.length === 0 ? (
            <p>No restaurants found</p>
          ) : (
            filteredRestaurants.map(({ resName, imgSrc, address, tags }) => (
                <div key={resName} className="singleRetaurant" onClick={() => openTagPopup({ resName, imgSrc, address, tags })}>
                  <div className="imageDiv">
                    <img src={imgSrc} alt={resName} />
                  </div>
                  <div className="cardInfo">
                    <h4 className="resTitle">{resName}</h4>
                    <span className="continent flex">
                      <LocationOnIcon className="icon" />
                      <span className="name">{address}</span>
                    </span>
                    {/* Display tags */}
                    <div className="tags">
                      {tags.length > 0 ? (
                        tags.map((tag, index) => (
                          <span key={index} className="tag">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="no-tags">No tags available</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
        <footer>
          <p>&copy; 2024 EatLa! All Rights Reserved.</p>
        </footer>
        <TagPopup
        open={popupOpen}
        restaurantTags={currentRestaurant?.tags || []}
        allTags={allTags}
        onClose={closeTagPopup}
        onSave={saveTags}
        />
      </div>
    );
  }
  
  export default Tags;