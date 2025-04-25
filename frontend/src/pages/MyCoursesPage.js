import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MyCoursesPage = () => {
  return (
    <div className="my-courses-page">
      <Header />
      <h1>My Courses</h1>
      <Footer />
    </div>
  );
};

export default MyCoursesPage;