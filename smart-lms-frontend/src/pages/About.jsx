import React from "react";
import BackgroundImage from "../utils/images/bg3.jpeg"
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const stats = [
  { label: "Students Enrolled", value: "12,000+" },
  { label: "Courses Available", value: "150+" },
  { label: "Expert Instructors", value: "80+" },
];

const team = [
  { name: "John Doe", role: "Founder & CEO" },
  { name: "Jane Smith", role: "Head of Content" },
  { name: "Mike Johnson", role: "Lead Developer" },
];
const { user } = useContext(AuthContext);
const AboutUs = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative text-white text-center py-20 min-h-[50vh] md:min-h-[70vh] md:py-32 px-4 sm:px-6">
        {/*Background image*/}
        <img
        src={BackgroundImage}
        loading="lazy"
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover opacity-30 md:opacity-20 z-0"
       />
  
          <div className="absolute inset-0 bg-black opacity-20 z-0"></div> 
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Welcome to SmartLMS</h1>
        <p className="max-w-2xl mx-auto text-white text-base sm:text-lg opacity-90 px-4">
          Empowering education through technology. Learn anywhere, anytime, at your own pace.
        </p>
       </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto py-12 sm:py-16 px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">🎯 Our Mission</h2>
          <p className="text-gray-700 text-base sm:text-lg">
            To make quality education accessible and engaging for everyone by leveraging the power of technology and personalized learning.
          </p>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">🌟 Our Vision</h2>
          <p className="text-gray-700 text-base sm:text-lg">
            We envision a world where learning is barrier-free, interactive, and tailored to each individual’s needs.
          </p>
        </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <p className="text-3xl sm:text-4xl font-bold text-blue-600">{stat.value}</p>
              <p className="text-base sm:text-lg text-gray-600 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet the Team */}
      <section className="max-w-6xl mx-auto py-12 sm:py-16 px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">👨‍🏫 Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-5 sm:p-6 text-center hover:shadow-md transition">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-blue-100 rounded-full mb-4 flex items-center justify-center"></div>
              <span className="text-2xl">{"👤"}</span>
              <h4 className="text-lg sm:text-xl font-semibold">{member.name}</h4>
              <p className="text-gray-600 text-sm sm:text-base">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-12 sm:py-16 text-center px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to start learning?</h2>
        <p className="mb-6 text-base sm:text-lg opacity-90">
          Join thousands of learners on LearnSphere today.
        </p>
        {!user &&(
        <Link to = "/register"
          className="inline-block bg-white text-blue-600 px-5 py-2 sm:px-6 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition text-sm sm:text-base"
        >
          Get Started
        </Link>
)}
      </div>
      </section>
     </div>
);
};

export default AboutUs;
