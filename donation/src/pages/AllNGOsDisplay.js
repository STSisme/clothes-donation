import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header';
import './AllNGOs.css'; 

// Image imports
import Imagea from '../images/NGOlogo1.jpg'; 
import Imageb from '../images/NGOlogo2.jpg'; 
import Imagec from '../images/NGOlogo3.jpg'; 
import Imaged from '../images/NGOlogo4.png'; 
import Footer from '../components/Footer';

const NGOS = [
    {
        "name" : "Sanghamithra",
        "desc" : "Sanghamitra Foundation focuses on CHILDREN & YOUTH EDUCATION HEALTH & NUTRITION and is headquartered in Kakinada, Andhra Pradesh, India.",
        "logo" : Imagea
    },
    {
        "name" : "Goonj",
        "desc" : "Goonj is a non-governmental organisation headquartered in New Delhi, India which undertakes disaster relief, humanitarian aid and community development in parts of 23 states across India.",
        "logo" : Imageb
    },
    {
        "name" : "Katha",
        "desc" : "Katha is a registered non-profit and non-governmental organisation based in Delhi that works in the field of community development, child welfare, education and literature.",
        "logo" : Imagec
    },
    {
        "name" : "Grow",
        "desc" : "GROW is an NGO dedicated to promote care and regeneration of natural resources, building a more equitable and sustainable society, generating awareness in people who live in the less favored sectors.",
        "logo" : Imaged
    },
    {
        "name" : "HelpAge India",
        "desc" : "HelpAge India works for the welfare of older people across the country by providing healthcare, financial aid, and other support services.",
        "logo" : Imagea
    },
    {
        "name" : "CRY India",
        "desc" : "CRY (Child Rights and You) works towards ensuring the rights of underprivileged children in India, focusing on health, education, and protection.",
        "logo" : Imageb
    },
    {
        "name" : "Pratham",
        "desc" : "Pratham is an NGO dedicated to improving the quality of education for children across India, especially in underserved areas.",
        "logo" : Imagec
    },
    {
        "name" : "Smile Foundation",
        "desc" : "Smile Foundation works in the fields of education, healthcare, livelihood, and women empowerment in underserved communities.",
        "logo" : Imaged
    }
];

class AllNGOs extends React.Component {
    render() {
        return (
            <>
                <Header />
                <Fragment>
                <h1 className="page-heading">NGO List</h1>

                    <div className="app">
                        {NGOS.map((value, index) => {
                            return (
                                <div className="card-container" key={index}>
                                    <div className="card mb-3">
                                        <div className="row no-gutters">
                                            <div className="col-12">
                                                <img src={value["logo"]} className="card-img" alt={`${value["name"]} logo`} />
                                            </div>
                                            <div className="col-12">
                                                <div className="card-body">
                                                    <h5 className="card-title">{value["name"]}</h5>
                                                    <p className="card-text" style={{ color: "black" }}>{value["desc"]}</p>
                                                </div>
                                                <div style={{ margin: "10px" }}>
                                                    <Link to={'/Donate.js'}>
                                                        <button className="btn btn-outline-success m-2">Donate</button>
                                                    </Link>
                                                    <Link to={'/NGO.js'}>
                                                    <button className="btn btn-outline-success m-2">Know More</button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Fragment>
                <Footer/>
            </>
        );
    }
}

export default AllNGOs;
