import React from "react";
import BackgroundImage from "../utils/images/bg3.jpeg"
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

const AboutUs = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative text-white  text-center px-4 p-55">
        {/* Background Image */}
                     <img
                       src={BackgroundImage} // Replace with your image path
                       alt="Hero Background"
                       className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
                     />
        
                     {/* Overlay (optional: to darken the image slightly) */}
                    <div className="absolute inset-0 bg-black opacity-20 z-0"></div> 
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to SmartLMS</h1>
        <p className="max-w-2xl text-white mx-auto text-lg opacity-90">
          Empowering education through technology. Learn anywhere, anytime, at your own pace.
        </p>
       </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto py-16 px-4 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-3xl font-bold mb-4">🎯 Our Mission</h2>
          <p className="text-gray-700 text-lg">
            To make quality education accessible and engaging for everyone by leveraging the power of technology and personalized learning.
          </p>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">🌟 Our Vision</h2>
          <p className="text-gray-700 text-lg">
            We envision a world where learning is barrier-free, interactive, and tailored to each individual’s needs.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-xl shadow">
              <p className="text-4xl font-bold text-blue-600">{stat.value}</p>
              <p className="text-lg text-gray-600 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet the Team */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-10">👨‍🏫 Meet Our Team</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
              <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full mb-4"></div>
              <h4 className="text-xl font-semibold">{member.name}</h4>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16 text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Ready to start learning?</h2>
        <p className="mb-6 text-lg">Join thousands of learners on LearnSphere today.</p>
        <a
          href="/register"
          className="inline-block bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
        >
          Get Started
        </a>
      </section>
    </div>
  );
};

export default AboutUs;
