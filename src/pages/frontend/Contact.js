import React, { useState, useContext } from "react";
import Navbar from "./Navbar";
import Footer from "../Footer";
import "../../css/about.css";

export default function Contact() {
    return (
        <>
            <Navbar />
            <h1 className="about">Contact us</h1>
            <Footer />
        </>
    );    
}