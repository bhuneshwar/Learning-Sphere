import React, { useEffect, useState } from 'react';
import axios from '../services/authService';
const CourseListPage = () => {
    const [courses, setCourses] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`/courses?page=${page}`);
                setCourses(response.data.courses);
                setTotalPages(response.data.totalPages);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCourses();
    }, [page]);
    return (
        <div>
            <h1>Available Courses</h1>
            <ul>
                {courses.map((course) => (
                    <li key={course._id}>
                        <h2>{course.title}</h2>
                        <p>{course.description}</p>
                        <p>Instructor: {course.instructor.username}</p>
                        <button onClick={() => enrollInCourse(course._id)}>Enroll</button>
                    </li>
                ))}
            </ul>
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                Previous
            </button>
            <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                Next
            </button>
        </div>
    );
};
const enrollInCourse = async (courseId) => {
    try {
        await axios.post(`/courses/${courseId}/enroll`);
        alert('Enrolled successfully');
    } catch (err) {
        console.error(err);
        alert('Error enrolling in course');
    }
};
export default CourseListPage