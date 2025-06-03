// TeamSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TeamSection = () => {
  // Sample team data based on the image
  const teamMembers = [
    {
      id: 1,
      name: "Team Member",
      role: "Agent",
      image: "/images/team-member-1.jpg"
    },
    {
      id: 2,
      name: "Team Member",
      role: "Agent",
      image: "/images/team-member-2.jpg"
    },
    {
      id: 3,
      name: "Team Member",
      role: "Agent",
      image: "/images/team-member-3.jpg"
    },
    {
      id: 4,
      name: "Team Member",
      role: "Agent",
      image: "/images/team-member-4.jpg"
    },
    {
      id: 5,
      name: "Team Member",
      role: "Agent",
      image: "/images/team-member-5.jpg"
    },
    {
      id: 6,
      name: "Team Member",
      role: "Agent",
      image: "/images/team-member-6.jpg"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-light mb-4">OUR EXPERT TEAM</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Meet the professionals behind LA's leading luxury real estate team. Our agents combine extensive market knowledge with personalized service.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {teamMembers.map((member) => (
            <motion.div 
              key={member.id}
              variants={itemVariants}
              className="group"
            >
              <Link to={`/team/${member.id}`} className="block">
                <div className="relative overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6 w-full bg-white bg-opacity-90">
                      <h3 className="text-xl font-medium">{member.name}</h3>
                      <p className="text-gray-600">{member.role}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link 
            to="/team" 
            className="inline-block border border-gray-900 text-gray-900 px-6 py-3 font-medium hover:bg-gray-900 hover:text-white transition-colors duration-300"
          >
            MEET THE ENTIRE TEAM
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;