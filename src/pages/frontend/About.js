import React, { useState, useContext } from "react";
import Navbar from "./Navbar";
import Footer from "../Footer";
import "../../css/about.css";

export default function About() {
    return (
        <>
            <Navbar />
            <h1 className="about">About us</h1>
            <Footer />
        </>
    );    
}