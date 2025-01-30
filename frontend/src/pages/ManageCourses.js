import { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageCourses.css';

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        axios.get('/api/protected/admin/courses')
            .then(res => setCourses(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="manage-courses">
            <h1>Manage Courses</h1>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Instructor</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => (
                        <tr key={course._id}>
                            <td>{course.title}</td>
                            <td>{course.instructor.username}</td>
                            <td>
                                <button className="delete-btn" onClick={() => handleDelete(course._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const handleDelete = async (id) => {
    try {
        await axios.delete(`/api/protected/admin/courses/${id}`);
        window.location.reload();
    } catch (error) {
        console.error('Error deleting course', error);
    }
};

export default ManageCourses;
