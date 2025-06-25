import React from "react";

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
      <section className="relative bg-gray-900 text-white py-34 px-6 overflow-hidden">
  {/* Blurred gradient shapes */}
  <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-gradient-to-r from-[#D8B5FF] to-[#1EAE98] rounded-full blur-[100px] opacity-50 z-0"></div>
  <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-gradient-to-br from-[#1EAE98] to-[#D8B5FF] rounded-full blur-[100px] opacity-40 z-0"></div>

  {/* Glass panel style content */}
  <div className="relative z-10 text-center backdrop-blur-md bg-white/5 p-10 rounded-2xl shadow-xl border border-white/10 max-w-3xl mx-auto">
    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-md">
      Our Services
    </h1>
    <p className="text-lg md:text-xl opacity-90 text-white drop-shadow-sm">
      Discover the powerful features that make learning simple, smart, and personalized.
    </p>
  </div>
</section>


      {/* Services Grid */}
      <section className="max-w-7xl mx-auto py-16 px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300"
          >
            <div className="text-5xl mb-4">{service.icon}</div>
            <h3 className="text-2xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10 text-left">
            <div className="p-6 border-l-4 border-blue-600">
              <h4 className="text-xl font-semibold mb-2">1. Sign Up</h4>
              <p>Create your free account and explore available courses tailored to your interests.</p>
            </div>
            <div className="p-6 border-l-4 border-purple-600">
              <h4 className="text-xl font-semibold mb-2">2. Start Learning</h4>
              <p>Watch lessons, complete quizzes, interact with instructors, and track progress.</p>
            </div>
            <div className="p-6 border-l-4 border-green-600">
              <h4 className="text-xl font-semibold mb-2">3. Get Certified</h4>
              <p>Complete your course and receive an official certificate to showcase your skills.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16 text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Start Your Learning Journey Today</h2>
        <p className="mb-6 text-lg">Join thousands of students and explore endless learning opportunities.</p>
        <a
          href="/register"
          className="inline-block bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
        >
          Join Now
        </a>
      </section>
    </div>
  );
};

export default Services;
