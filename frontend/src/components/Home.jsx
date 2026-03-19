import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.webp'
import { Link } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaInstagramSquare } from "react-icons/fa";
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from 'react-hot-toast';
import { BACKEND_URL } from '../utils/utils';

function Home() {

  const [courses, setCourse] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("user")
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message)
      setIsLoggedIn(false);
      localStorage.removeItem("user")
    } catch (error) {
      toast.error("error in logging out")
    }
  }

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true
        })
        setCourse(response.data.courses)
      } catch (error) {
        console.log("error in fetching course", error)
      }
    }
    fetchCourse()
  }, [])

  // ✅ FINAL RESPONSIVE SETTINGS
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3, // desktop
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1, // ✅ mobile full width
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-blue-900">

      <div className='text-white max-w-7xl mx-auto px-4 md:px-6 py-4'>

        {/* HEADER */}
        <header className='flex flex-col md:flex-row justify-between items-center gap-4'>

          <div className='flex items-center gap-4'>
            <img src={logo} className='w-12 h-12 md:w-14 md:h-14 rounded-full' />
            <h1 className='text-xl md:text-2xl text-orange-600 font-bold'>
              Course<span className='text-white'>Hub</span>
            </h1>
          </div>

          <div className='flex gap-3 flex-wrap justify-center md:justify-end'>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className='border px-4 py-2 rounded hover:bg-red-500'>
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className='border px-4 py-2 rounded'>Login</Link>
                <Link to="/signup" className='border px-4 py-2 rounded'>Signup</Link>
              </>
            )}
          </div>

        </header>

        {/* HERO */}
        <section className='text-center mt-10 space-y-4'>
          <h1 className='text-2xl md:text-4xl font-semibold text-orange-600'>
            Course<span className='text-white'>Hub</span>
          </h1>
          <p className='text-gray-400'>
            Sharpen your skills with expert courses
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center mt-6'>
            <Link to="/courses" className='bg-green-500 px-6 py-3 rounded font-semibold'>
              Explore Courses
            </Link>
            <Link to="/courses" className='bg-white text-black px-6 py-3 rounded font-semibold'>
              Course Video
            </Link>
          </div>
        </section>

        {/* SLIDER */}
        <section className="py-10 px-1 md:px-5">
          <Slider {...settings}>
            {courses.map((course) => (
              <div key={course._id} className="px-1 md:px-3">

                <div className="bg-gray-900 rounded-2xl overflow-hidden w-full hover:scale-105 transition">

                  {/* IMAGE */}
                  <div className="w-full h-40">
                    <img
                      src={course?.image?.url}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-4 text-center">
                    <h2 className="text-lg font-semibold text-white mb-2">
                      {course.title}
                    </h2>

                    <button className="px-4 py-2 bg-orange-600 rounded hover:bg-green-600">
                      Enroll
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </Slider>
        </section>

        <hr />

        {/* FOOTER */}
        <footer className='my-10'>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left'>

            <div className='flex flex-col items-center md:items-start space-y-3'>
              <div className='flex items-center gap-3'>
                <img src={logo} className='w-12 h-12 rounded-full' />
                <h1 className='text-xl text-orange-600 font-bold'>CourseHub</h1>
              </div>

              <div>
                <p className='mb-2'>Follow us</p>
                <div className='flex gap-3 justify-center md:justify-start'>
                  <FaFacebook />
                  <FaTwitter />
                  <FaInstagramSquare />
                </div>
              </div>
            </div>

            <div>
              <h1 className='text-orange-600 font-semibold mb-2'>Company</h1>
              <ul className='text-gray-300 space-y-1'>
                <li>About</li>
                <li>Careers</li>
              </ul>
            </div>

            <div>
              <h1 className='text-orange-600 font-semibold mb-2'>Support</h1>
              <ul className='text-gray-300 space-y-1'>
                <li>Help Center</li>
                <li>Contact</li>
              </ul>
            </div>

            <div>
              <h1 className='text-orange-600 font-semibold mb-2'>Legal</h1>
              <ul className='text-gray-300 space-y-1'>
                <li>Privacy</li>
                <li>Terms</li>
              </ul>
            </div>

          </div>

        </footer>

      </div>
    </div>
  )
}

export default Home