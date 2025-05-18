import Banner from "components/Banner";
import HowToDonate from "components/HowToDonate";
import Partnerships from "components/Partnerships";
import WhyDonate from "components/WhyDonate";
import React from "react";

const Home = () => {
  return (
    <>
      <Banner />
      <div className="container text-center my-5">
        <h1 className="fw-bold mb-3">Welcome to Clothes Donation Platform</h1>
        <p className="lead text-muted">
          Together we can make a difference. Donate your unused clothes and help those in need.
        </p>
      </div>
      <HowToDonate />
      <Partnerships />
      <WhyDonate />
    </>
  );
};

export default Home;
