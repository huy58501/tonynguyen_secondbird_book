import React from "react";
import '../styles/Navbar.css'; // Import the CSS for styling

const Navbar: React.FC = () => {
    return (
        <div className="navbar">
            <div className="logo">
                <h2>Book Inventory</h2>
            </div>
        </div>
    );
};

export default Navbar;
