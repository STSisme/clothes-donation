import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import Header from "../../components/header";
import DonationPage from "../../components/DonationPage";
import Footer from "../../components/Footer";

const Donate = () => {

  return (
    <>
      <Header />
      <DonationPage/>
      <Footer/>
    </>
  );
};

export default Donate;
