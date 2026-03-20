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
      setIsLoggedIn(false)
      localStorage.removeItem("user")
    } catch (error) {
      toast.error("Error in logging out")
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
        console.log("Error fetching courses", error)
      }
    }
    fetchCourse()
  }, [])

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 }
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── NAVBAR ── */}
      <nav className="border-b border-gray-800 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className="w-10 h-10 rounded-full object-cover" />
            <span className="text-xl font-bold">
              <span className="text-orange-500">Course</span>Hub
            </span>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded-lg border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm rounded-lg border border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-14">

        {/* ── HERO ── */}
        <section className="text-center space-y-5 py-6">
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
            Learn from the <span className="text-orange-500">best experts</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
            Sharpen your skills with our expert-led courses. Learn at your own pace, anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              to="/courses"
              className="px-6 py-3 bg-orange-500 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Explore Courses
            </Link>
            <Link
              to="/courses"
              className="px-6 py-3 bg-gray-800 rounded-lg font-semibold hover:bg-gray-700 transition"
            >
              Watch Preview
            </Link>
          </div>
        </section>

        {/* ── COURSE SLIDER ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-200">Popular Courses</h2>
          <Slider {...sliderSettings}>
            {courses.map((course) => (
              <div key={course._id} className="px-2">
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-orange-500 transition">

                  {/* Course image */}
                  <div className="h-40 w-full overflow-hidden">
                    <img
                      src={course?.image?.url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Course info */}
                  <div className="p-4 space-y-3">
                    <h3 className="text-base font-semibold text-white line-clamp-2">
                      {course.title}
                    </h3>
                    <button className="w-full py-2 text-sm bg-orange-500 rounded-lg hover:bg-orange-600 transition font-medium">
                      Enroll Now
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </Slider>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-gray-800 pt-10 pb-6 space-y-8">

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">

            {/* Brand */}
            <div className="col-span-2 sm:col-span-1 space-y-4">
              <div className="flex items-center gap-3">
                <img src={logo} alt="logo" className="w-9 h-9 rounded-full object-cover" />
                <span className="font-bold text-lg">
                  <span className="text-orange-500">Course</span>Hub
                </span>
              </div>
              <p className="text-gray-400 text-sm">Learn. Grow. Succeed.</p>
              <div className="flex gap-3 text-gray-400">
                <FaFacebook className="hover:text-white cursor-pointer transition" size={18} />
                <FaTwitter className="hover:text-white cursor-pointer transition" size={18} />
                <FaInstagramSquare className="hover:text-white cursor-pointer transition" size={18} />
              </div>
            </div>

            {/* Company */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-orange-500 uppercase tracking-wide">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer transition">About</li>
                <li className="hover:text-white cursor-pointer transition">Careers</li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-orange-500 uppercase tracking-wide">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer transition">Help Center</li>
                <li className="hover:text-white cursor-pointer transition">Contact</li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-orange-500 uppercase tracking-wide">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer transition">Privacy</li>
                <li className="hover:text-white cursor-pointer transition">Terms</li>
              </ul>
            </div>

          </div>

          <p className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} CourseHub. All rights reserved.
          </p>

        </footer>

      </div>
    </div>
  )
}

export default Home