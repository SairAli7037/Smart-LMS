import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const {user}=useContext(AuthContext);
const services = [
  {
    title: "Interactive Courses",
    description: "Engaging video lessons, quizzes, and projects to help you learn by doing.",
    icon: "📚",
  },
  {
    title: "Live Instructor Support",
    description: "Get real-time guidance from expert instructors through Q&A sessions and forums.",
    icon: "👩‍🏫",
  },
  {
    title: "Certification",
    description: "Earn certificates upon course completion to boost your career prospects.",
    icon: "🎓",
  },
  {
    title: "Progress Tracking",
    description: "Visualize your learning journey and track your course progress in real-time.",
    icon: "📈",
  },
  {
    title: "Mobile Access",
    description: "Learn anytime, anywhere with our mobile-friendly platform.",
    icon: "📱",
  },
  {
    title: "AI Tutor Assistance",
    description: "Get help instantly using our smart AI-powered tutoring assistant.",
    icon: "🤖",
  },
];

const Services = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-20 md:py-28 lg:py-36 px-4 sm:px-6 overflow-hidden">
  {/* Blurred gradient shapes */}
    <div className="absolute top-[-50px] sm:top-[-100px] left-[-50px] sm:left-[-100px] w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-gradient-to-r from-[#D8B5FF] to-[#1EAE98] rounded-full blur-[50px] sm:blur-[100px] opacity-50 z-0"></div>
      <div className="absolute bottom-[-50px] sm:bottom-[-100px] right-[-50px] sm:right-[-100px] w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-gradient-to-br from-[#1EAE98] to-[#D8B5FF] rounded-full blur-[50px] sm:blur-[100px] opacity-40 z-0"></div>
  {/* Glass panel style content */}
  <div className="relative z-10 text-center backdrop-blur-md bg-white/5 p-6 sm:p-8 md:p-10 rounded-xl md:rounded-2xl shadow-lg border border-white/10 max-w-2xl sm:max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-4 text-white drop-shadow-md">
          Our Services
        </h1>
        <p className="text-base sm:text-lg md:text-xl opacity-90 text-white drop-shadow-sm">
          Discover the powerful features that make learning simple, smart, and personalized.
        </p>
      </div>
    </section>


      {/* Services Grid */}
      <section className="max-w-7xl mx-auto py-12 sm:py-16 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg md:rounded-xl shadow-sm hover:shadow-md transition duration-300 p-5 sm:p-6"
          >
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{service.icon}</div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">{service.title}</h3>
            <p className="text-gray-600 text-sm sm:text-base">{service.description}</p>
          </div>
        ))}
        </div>
      </section>

      {/* How It Works */}
     <section className="bg-white py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-left">
          <div className="p-4 sm:p-6 border-l-4 border-blue-600">
            <h4 className="text-lg sm:text-xl font-semibold mb-2">1. Sign Up</h4>
            <p className="text-sm sm:text-base">Create your free account and explore available courses.</p>
          </div>
          <div className="p-4 sm:p-6 border-l-4 border-purple-600">
            <h4 className="text-lg sm:text-xl font-semibold mb-2">2. Start Learning</h4>
            <p className="text-sm sm:text-base">Watch lessons, complete quizzes, and track progress.</p>
          </div>
          <div className="p-4 sm:p-6 border-l-4 border-green-600">
            <h4 className="text-lg sm:text-xl font-semibold mb-2">3. Get Certified</h4>
            <p className="text-sm sm:text-base">Complete your course and receive an official certificate.</p>
          </div>
        </div>
      </div>
    </section>

    {/* CTA - Improved responsive padding and typography */}
    <section className="bg-blue-600 text-white py-12 sm:py-16 text-center px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Start Your Learning Journey Today</h2>
        <p className="mb-5 sm:mb-6 text-base sm:text-lg opacity-90">
          Join thousands of students and explore endless learning opportunities.
        </p>
        {!user && (
        <Link to ="/register"
          className="inline-block bg-white text-blue-600 px-5 py-2 sm:px-6 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition text-sm sm:text-base"
        >
          Join Now
        </Link>
        )}
      </div>
    </section>
  </div>
  );
};

export default Services;
