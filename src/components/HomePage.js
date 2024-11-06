import React, { useState } from 'react';
import Navbar from './Navbar';
import ListProviders from './ListProviders';
import AddProvider from './AddProvider';
import Ellipse7 from '../assets/Ellipse 7.svg';
import './HomePage.css';


function HomePage() {
  const [showAddProviderModal, setShowAddProviderModal] = useState(false);
 
    // Function to open and close the modal
    const toggleAddProviderModal = () => {
        setShowAddProviderModal(!showAddProviderModal);
    };
 
    return (
        <div className="App">
            <Navbar /> {/*temporary pa ni nga navbar*/}
 
            <div className="heading-container">
                <h2 className="heading">Service Providers</h2>
                <button className="toggle-button" onClick={toggleAddProviderModal}>+</button>
            </div>
 
            <ListProviders />
 
            {showAddProviderModal && (
                <div className="modal-overlay">
                    <AddProvider toggleModal={toggleAddProviderModal} />
                </div>
            )}
 
            <img src={Ellipse7} alt="Background Ellipse" className="ellipse-bottom-left" />
        </div>
  );
}

export default HomePage;
