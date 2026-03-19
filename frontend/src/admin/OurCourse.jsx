import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

function OurCourse() {
   const [courses, setCourse] = useState([]);
   const [loading, setLoading] = useState(true);

    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;
    // fetch courses
useEffect(() => {
       const fetchCourse = async () => {
         try {
           const response = await axios.get(
             "http://localhost:3000/api/v1/course/courses",
             {
               withCredentials: true,
             }
           );
   
           setCourse(response.data.courses);
           setLoading(false);
   
         } catch (error) {
           console.log("error in fetching course", error);
         }
       };
   
       fetchCourse();
     }, []);


const handleDelete = async (id) => {
  console.log("deleting:",id)
    try {
      const response = await axios.delete(`http://localhost:3000/api/v1/course/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      const updatedCourses = courses.filter((course)=>course._id !== id);
      setCourse(updatedCourses);
    } catch (error) {
      console.log("Error in deleting course ", error);
      toast.error(error.response?.data?.errors || "Error in deleting course")
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }
   
  return (

<div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-8">
  <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
    Our Courses
  </h1>

  <div className="flex justify-center mb-8">
    <Link
      className="bg-orange-500 py-2 px-6 rounded-full text-white font-medium shadow hover:bg-orange-600 transition"
      to={"/admin/dashboard"}
    >
      Go to Dashboard
    </Link>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {courses.map((course) => (
      <div
        key={course._id}
        className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition duration-300"
      >
        {/* Course Image */}
        <div className="overflow-hidden">
          <img
            src={course?.image?.url}
            alt={course.title}
            className="h-44 w-full object-cover hover:scale-110 transition duration-300"
          />
        </div>

        <div className="p-5">
          {/* Course Title */}
          <h2 className="text-xl font-semibold text-gray-800">
            {course.title}
          </h2>

          {/* Course Description */}
          <p className="text-gray-600 mt-2 text-sm leading-relaxed">
            {course.description.length > 200
              ? `${course.description.slice(0, 200)}...`
              : course.description}
          </p>

          {/* Price */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-lg font-bold text-gray-800">
              ₹{course.price}
              <span className="line-through text-gray-400 text-sm ml-2">
                ₹300
              </span>
            </div>

            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
              10% OFF
            </span>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <Link
              to={`/admin/update-course/${course._id}`}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-600 transition"
            >
              Update
            </Link>

            <button
              onClick={() => handleDelete(course._id)}
              className="bg-red-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>


  );
}

export default OurCourse;