import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "./Donate.css";
import Header from "../components/header";
import DonationPage from "../components/DonationPage";
import Footer from "../components/Footer";

const Donate = () => {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    clothingType: "",
    quantity: "",
    address: "",
    donationMethod: "Dropoff",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/donationsDB", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert("Thank you for your donation!");
        window.location.href = "/"; // Redirect to home
      } else {
        alert("Failed to submit donation.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  return (
    <>
      <Header />
      <DonationPage/>
      <Footer/>
    </>
  );
};

export default Donate;
