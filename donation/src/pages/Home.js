import React from "react";
import Header from "../components/header";
import Baner from "../components/Baner";
import "./Home.css";
import Footer from "../components/Footer";
import HowToDonate from "../components/HowToDonate";
import HowItWorks from "../components/HowItWorks";
import WhyDonate from "../components/WhyDonate";
import DonationStats from "../components/DonationStats";
import DisasterRelief from "../components/DisataserRelief";
import ContactSupport from "../components/Contact";
import Partnerships from "../components/Partnerships";


const Home = () => {
    return (
      <>
      <Header/>
      <Baner/>

      <div className="home-container">
        <h1>Welcome to Clothes Donation Platform</h1>
        <p>
          Together we can make a difference. Donate your unused clothes and help those in need.
        </p>
      </div>
      <DonationStats/>
      <HowToDonate />
      <DisasterRelief/>
      <Partnerships/>
      <WhyDonate />
      
      <Footer />
        </>
    );
  };

export default Home;
