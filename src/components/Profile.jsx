import React, { useState, useEffect } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom"; 
import Header from "../ReusableComponents/Header.jsx";
import { auth } from "../../firebase.config"; // Import Firebase auth
import { getUserEntry } from "../apis"; // Function to get user data from Firestore


function Profile() {
    const navigate = useNavigate(); // Initialize navigate hook
    const [user, setUser] = useState(null); // To store user details
    const [loading, setLoading] = useState(true); // Loading state 
    // Function to navigate to change preference page
    const handleChangePreferences = () => {
      navigate("/changepreference");  // Navigate to the "changepreference" route
    };    
    useEffect(() => {
      // Check if user is authenticated and fetch their details
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        // Fetch the user's details from Firestore
        getUserEntry(currentUser.uid).then((userData) => {
          setUser(userData); // Set the user data to state
          setLoading(false); // Update loading state
        }).catch(error => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
      } else {
        setLoading(false); // If no user is logged in, stop loading
      }
    }, []);
  
    // If the user is still loading or not logged in, show a loading message or login prompt
    if (loading) {
      return (
        <div className="loading-container">
            <p>Loading...</p>
        </div>
      );
    }
  
    if (!user) {
      return (
        <div>
          <Header />
          <div className="not-logged-in">
              <p>You need to be logged in to view your profile.</p>
          </div>
        </div>
      );
    }
  // Displaying the preferences if available
    const preferences = user.preference || []; //   

    return (
      <div className="profile-page homepage">
          <Header />
          <main className="profile-main">
              <div className="profile-container">
                  <div className="profile-header">
                      <h2>Welcome, {user.name}</h2>
                  </div>
                  <div className="profile-email">
                      <p>Email: {user.email}</p>
                  </div>
              </div>
              <h3>Your Preferences</h3>
                  <div className="profile-preferences">
                      
                      {preferences.length > 0 ? (
                          <div className="preferences-grid">
                              {preferences.map((pref, index) => (
                                  <div key={index} className="preference-box">
                                      {pref}
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <p>No preferences set.</p>
                      )}
                  </div>
                  <button 
                    onClick={handleChangePreferences} 
                    style={{ marginTop: "20px", backgroundColor: '#FD843D', borderRadius: '50px', width: '100%' }}
                >
                    Change Preferences
                </button>
              
          </main>
          <footer className="profile-footer">
              <p>&copy; 2024 EatLa! All Rights Reserved.</p>
          </footer>
      </div>
  );
}
  
export default Profile;
  