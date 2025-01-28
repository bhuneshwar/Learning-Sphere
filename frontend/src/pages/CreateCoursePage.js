import React, { useState } from 'react';
import axios from '../services/authService';
const CreateCoursePage = () => {
    const [formData, setFormData] = useState({ title: '', description: '' });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/courses', formData);
            alert('Course created successfully');
        } catch (err) {
            console.error(err);
            alert('Error creating course');
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <h1>Create a Course</h1>
            <input
                type="text"
                name="title"
                placeholder="Course Title"
                value={formData.title}
                onChange={handleChange}
            />
            <textarea
                name="description"
                placeholder="Course Description"
                value={formData.description}
                onChange={handleChange}
            />
            <button type="submit">Create Course</button>
        </form>
    );
};
export default CreateCoursePage;