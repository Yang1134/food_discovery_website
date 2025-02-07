import React, { useState, useEffect } from "react";  // Add useEffect here
import { fetchCategories } from "../../apis";  // Function to fetch categories
import { auth, db } from "../../../firebase.config";  // To get current logged-in user
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Header from "../../ReusableComponents/Header.jsx";

function SelectCategories() {
    const [categories, setCategories] = useState([]);  // Store fetched categories
    const [selectedCategories, setSelectedCategories] = useState([]);  // Store selected categories
    const navigate = useNavigate();

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories().then((categoryList) => {
            setCategories(categoryList);
        }).catch(error => {
            console.error("Error fetching categories:", error);
        });
        // Fetch the current user's preferences
        const user = auth.currentUser;
        if (user) {
            const userRef = doc(db, "Users", user.uid);
            getDoc(userRef).then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    if (userData.preference) {
                        setSelectedCategories(userData.preference);  // Set existing preferences to state
                    }
                }
            }).catch(error => {
                console.error("Error fetching user preferences:", error);
            });
        }
    }, []);

    //double check this
    // Handle category selection
    const handleCategorySelect = (category) => {
        setSelectedCategories((prev) => {
            if (prev.includes(category)) {
                return prev.filter((cat) => cat !== category);  // Remove if already selected
            } else {
                return [...prev, category];  // Add to the selected categories
            }
        });
    };

    // double check set doc() and docs
    // Handle saving preferences in Firestore
    const handleSavePreferences = async () => {
        const user = auth.currentUser;
        if (selectedCategories.length > 0) {
            const userRef = doc(db, "Users", user.uid);
            await setDoc(userRef, { preference: selectedCategories }, { merge: true });
            navigate("/");  // Redirect to profile page after saving preferences
        } else {
            alert("Please select at least one category.");
        }
    };

    return (
        <>
            <Header/>
            <div style={{padding: "36px 88px 26px 88px"}}>
                <p style={{fontSize: "32px", margin: "0px"}}>Select Categories You Like</p>
                <div style={{
                    marginTop: "20px",
                    display: "flex",
                    flexWrap: "wrap"
                }}>  {/* Use flexbox to align side by side */}
                    {categories.map((category) => (
                        <div key={category.id} style={{marginBottom: "10px"}}>
                            <div
                                style={{
                                    display: "inline-block",
                                    padding: "12px 20px",
                                    margin: "5px",
                                    borderRadius: "25px",
                                    backgroundColor: selectedCategories.includes(category.Category) ? "#FD843D" : "#f0f0f0",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s",
                                }}
                                onClick={() => handleCategorySelect(category.Category)}  // Handle category select
                            >
                                <span
                                    style={{color: selectedCategories.includes(category.Category) ? "white" : "black"}}>
                                    {category.Category}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={handleSavePreferences}
                        style={{marginTop: "20px", backgroundColor: '#FD843D', borderRadius: '50px', width: '100%'}}>
                    Save Preferences
                </button>
            </div>
            <footer style={{position: 'fixed', bottom: '0', width: '100%'}}>
                <p>&copy; 2024 EatLa! All Rights Reserved.</p>
            </footer>
        </>
    );
}

export default SelectCategories;
