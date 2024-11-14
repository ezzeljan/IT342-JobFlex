import React, { useState } from 'react';
import axios from 'axios';

const ServiceForm = () => {
    const [service, setService] = useState({
        title: '',
        description: '',
        price: '',
        availability: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setService({ ...service, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/services', service);
            alert('Service added successfully!');
        } catch (error) {
            console.error('Error adding service:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Service</h2>
            <input
                type="text"
                name="title"
                placeholder="Service Title"
                value={service.title}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="description"
                placeholder="Description"
                value={service.description}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="price"
                placeholder="Price"
                value={service.price}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="availability"
                placeholder="Availability"
                value={service.availability}
                onChange={handleChange}
                required
            />
            <button type="submit">Add Service</button>
        </form>
    );
};

export default ServiceForm;