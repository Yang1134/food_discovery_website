import { useState } from "react";
import Header from "../ReusableComponents/Header.jsx";
import "./ApplyPartner.css"; // You can style this page as needed

// WhatsApp Link
const whatsAppLink = "https://wa.me/601121116050?text=I'm%20interested%20to%20get%20my%20restaurant%20listed%20on%20Eat%20La%21";

function ApplyPartner() {
    // Handle form submission (if you plan to use a form)
    const handleSubmit = (e) => {
      e.preventDefault();
      // Here, you would handle the form submission logic
      console.log("Form Data Submitted:", formData);
    };
  
    return (
        <div className="apply-partner-page">
            <Header/> {/* Add Header */}

            <main style={{padding: "0"}}>
                <div style={{padding: "36px 88px 26px 88px"}}>
                    <p style={{fontSize: "32px", margin: "0px"}}>Apply for Partner</p>
                </div>

                <div style={{padding: "0 88px"}}>
                    {/* WhatsApp Button */}
                    <button
                        style={{
                            backgroundColor: "#25D366", // WhatsApp green color
                            color: "white",
                            padding: "10px 20px",
                            borderRadius: "10px",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "16px",
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "20px",
                        }}
                        onClick={() => window.open(whatsAppLink, "_blank")} // Open WhatsApp in a new tab
                    >
                        <i className="fab fa-whatsapp" style={{marginRight: "10px"}}></i> {/* Optional WhatsApp icon */}
                        Contact us on WhatsApp
                    </button>

                    <div style={{display: "flex", justifyContent: "center"}}>
                        <img
                            src="https://i.ibb.co/cTz93C0/qrcode-158553275-0825989f382dd26f38fc57d69aabbe09.png" // Ensure the path to your SVG file is correct
                            alt="QR Code"
                            width="150"
                            height="150"
                        />
                    </div>

                </div>
            </main>

            <footer style={{position: 'fixed', bottom: '0', width: '100%'}}>
                <p>&copy; 2024 EatLa! All Rights Reserved.</p>
            </footer>
        </div>
    );
}

export default ApplyPartner;