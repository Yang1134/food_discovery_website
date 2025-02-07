import { useState, useEffect } from "react";
import { fetchCategories } from "../apis"; // Import the function from api.js
import "./Categories.css";
import Header from "../ReusableComponents/Header.jsx";

function Categories() {
  const [categories, setCategories] = useState([]);

  // Fetch categories from Firestore
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryList = await fetchCategories();
        setCategories(categoryList);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="homepage">
      <Header></Header>
      <main style={{padding: '0'}}>
        <div style={{padding: "36px 88px 26px 88px"}}>
          <p style={{fontSize: "32px", margin: "0px"}}>Categories</p>
        </div>

        <div className="categories-grid" style={{padding: '0'}}>
          {categories.map((category, index) => (
              <div key={index} className="category-wrapper">
                <div className="category-card">
                  <img src={category.imgpath} alt={category.Category} className="category-image"/>
                </div>
                <div className="category-info">
                  <p style={{color: 'black'}}>{category.Category}</p>
                </div>
              </div>
          ))}
        </div>
      </main>

      <footer>
        <p>&copy; 2024 EatLa! All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Categories;
