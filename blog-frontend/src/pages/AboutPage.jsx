import { Link } from 'react-router-dom';
import { 
  UserGroupIcon, 
  LightBulbIcon, 
  HeartIcon, 
  CodeBracketIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const AboutPage = () => {
  const features = [
    {
      icon: <LightBulbIcon className="w-8 h-8" />,
      title: "Innovative Content",
      description: "We share cutting-edge ideas, insights, and perspectives that inspire and educate our readers."
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: "Community Driven",
      description: "Our platform brings together writers, thinkers, and readers from diverse backgrounds and experiences."
    },
    {
      icon: <CodeBracketIcon className="w-8 h-8" />,
      title: "Technology Focus",
      description: "We explore the latest in web development, programming, and digital innovation."
    },
    {
      icon: <GlobeAltIcon className="w-8 h-8" />,
      title: "Global Perspective",
      description: "Our content reflects diverse viewpoints and experiences from around the world."
    }
  ];

  const team = [
    {
      name: "Alex Johnson",
      role: "Founder & Editor-in-Chief",
      bio: "Passionate about technology and storytelling, Alex founded BlogSystem to create a platform for meaningful conversations.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      name: "Sarah Chen",
      role: "Lead Developer",
      bio: "Full-stack developer with expertise in React, Django, and modern web technologies. Builds the technical foundation of our platform.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      name: "Michael Rodriguez",
      role: "Content Strategist",
      bio: "Experienced writer and content creator who helps shape our editorial direction and ensures quality across all publications.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          About BlogSystem
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-4xl mx-auto">
          We're a modern blogging platform dedicated to sharing knowledge, fostering creativity, 
          and building a community of passionate writers and readers. Our mission is to make 
          quality content accessible to everyone.
        </p>
      </div>

      {/* Mission Statement */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mb-16 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg leading-relaxed">
            To democratize knowledge sharing by providing a platform where anyone can publish, 
            discover, and engage with high-quality content. We believe in the power of stories 
            to connect people, inspire change, and drive innovation.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          What Makes Us Different
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Our Impact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">500+</div>
            <div className="text-gray-600 dark:text-gray-400">Published Articles</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">10K+</div>
            <div className="text-gray-600 dark:text-gray-400">Monthly Readers</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">50+</div>
            <div className="text-gray-600 dark:text-gray-400">Contributing Writers</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">25+</div>
            <div className="text-gray-600 dark:text-gray-400">Categories</div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg mx-auto mb-4">
              <HeartIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Authenticity
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We value genuine voices and authentic storytelling that resonates with real experiences.
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-lg mx-auto mb-4">
              <LightBulbIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Innovation
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We embrace new ideas, technologies, and approaches to content creation and sharing.
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 rounded-lg mx-auto mb-4">
              <ChatBubbleLeftRightIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Community
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We foster meaningful connections and conversations between writers and readers.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Join Our Community
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Whether you're a writer looking to share your ideas or a reader seeking quality content, 
          we'd love to have you as part of our growing community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Get Started
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors duration-200"
          >
            Browse Articles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;