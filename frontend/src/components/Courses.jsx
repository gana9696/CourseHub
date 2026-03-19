import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6"; // ✅ correct
import { RiHome2Fill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../assets/logo.webp";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function Courses() {

  const [courses, setCourse] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const navigate = useNavigate()

  // login check
  useEffect(() => {
    const token = localStorage.getItem("user");
    setIsLoggedIn(!!token);
  }, []);

  // logout
  const handleLogout = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/")
    } catch {
      toast.error("error in logout");
    }
  };

  // fetch courses
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/course/courses`);
        setCourse(res.data.courses);
        setLoading(false);
      } catch {
        console.log("error fetching");
      }
    };
    fetchCourse();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-100 p-5 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition duration-300 w-64 z-50`}
      >
        <div className="flex items-center mb-6">
          <img src={logo} className="w-12 h-12 rounded-full" />
        </div>

        <ul className="mt-10 md:mt-0 space-y-4">
          <li>
            <Link to="/" className="flex items-center">
              <RiHome2Fill className="mr-2" /> Home
            </Link>
          </li>

          <li>
            <Link to="/courses" className="flex items-center text-blue-500">
              <FaDiscourse className="mr-2" /> Courses
            </Link>
          </li>

          <li>
            <Link to="/purchases" className="flex items-center">
              <FaDownload className="mr-2" /> Purchases
            </Link>
          </li>

          <li>
            <Link to="#" className="flex items-center">
              <IoMdSettings className="mr-2" /> Settings
            </Link>
          </li>

          <li>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="flex items-center">
                <IoLogOut className="mr-2" /> Logout
              </button>
            ) : (
              <Link to="/login" className="flex items-center">
                <IoLogIn className="mr-2" /> Login
              </Link>
            )}
          </li>
        </ul>
      </div>

      {/* Mobile Toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded"
      >
        {isSidebarOpen ? <HiX size={22} /> : <HiMenu size={22} />}
      </button>

      {/* Main */}
      <div
        className={`flex-1 p-4 md:p-8 bg-white transition-all ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } md:ml-64`}
      >

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between gap-4 mb-6">

          <h1 className="text-xl md:text-2xl font-bold">Courses</h1>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center w-full md:w-auto">
              <input
                type="text"
                placeholder="Search..."
                className="border px-3 py-2 rounded-l-full w-full md:w-auto"
              />
              <button className="border px-3 py-2 rounded-r-full">
                <FiSearch />
              </button>
            </div>

            <FaCircleUser className="text-3xl text-blue-600" />
          </div>

        </header>

        {/* Courses */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {courses.map((course) => (
              <div
                key={course._id}
                className="border rounded-lg p-4 shadow hover:shadow-lg"
              >
                <img
                  src={course.image.url}
                  className="w-full h-40 object-cover rounded mb-3"
                />

                <h2 className="font-bold text-lg">{course.title}</h2>

                <p className="text-gray-600 text-sm mb-2">
                  {course.description.slice(0, 80)}...
                </p>

                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold">₹{course.price}</span>
                  <span className="text-green-600 text-sm">20% off</span>
                </div>

                <Link
                  to={`/buy/${course._id}`}
                  className="block text-center bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
                >
                  Buy Now
                </Link>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;