import React from 'react';
import { Link } from 'react-router';
import { PATHS } from '@/utils';

function About() {
    const teamMembers = [
        {
            name: 'Pratik Meghnathi',
            role: 'Lead Developer',
            desc: 'Highly skilled full-stack developer passionate about impactful web applications.',
            img: 'https://randomuser.me/api/portraits/men/11.jpg',
        },
        {
            name: 'Swapnil Kanthiwar',
            role: 'UI/UX Designer',
            desc: 'Focused on intuitive and visually appealing interfaces that enhance user experience.',
            img: 'https://randomuser.me/api/portraits/men/21.jpg',
        },
        {
            name: 'Gopal Kute',
            role: 'Backend Developer',
            desc: 'Specializes in backend architecture and scalable application development.',
            img: 'https://randomuser.me/api/portraits/men/22.jpg',
        },
    ];

    const techStack = [
        { src: 'https://img.icons8.com/ios/50/000000/react.png', alt: 'React' },
        { src: 'https://img.icons8.com/ios/50/000000/nodejs.png', alt: 'NodeJS' },
        { src: 'https://img.icons8.com/ios/50/000000/javascript.png', alt: 'JavaScript' },
        { src: 'https://img.icons8.com/ios/50/000000/python.png', alt: 'Python' },
        { src: 'https://img.icons8.com/ios/50/000000/html-5--v1.png', alt: 'HTML5' },
        { src: 'https://img.icons8.com/ios/50/000000/css3.png', alt: 'CSS3' },
        { src: 'https://img.icons8.com/ios/50/000000/github.png', alt: 'GitHub' },
        { src: 'https://img.icons8.com/ios/50/000000/figma.png', alt: 'Figma' },
    ];

    const coreValues = [
        { title: 'Innovation', text: 'We are driven by creativity and innovation to deliver cutting-edge solutions.' },
        { title: 'Collaboration', text: 'We believe in teamwork, shared knowledge, and mutual support.' },
        { title: 'Excellence', text: 'We strive for the highest quality in everything we do.' },
    ];

    return (
        <main className="bg-gradient-to-r from-teal-500 to-blue-600 text-white">
            {/* Hero */}
            <section className="container mx-auto text-center py-20 px-4">
                <h1 className="text-5xl font-bold mb-4">Meet Our Team</h1>
                <p className="text-lg max-w-2xl mx-auto">
                    A team of passionate individuals working together to deliver results.
                </p>
            </section>

            {/* Team Members */}
            <section className="bg-white text-gray-800 py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">Our Dedicated Team</h2>
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition duration-300 cursor-pointer"
                            >
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                                />
                                <h3 className="text-xl font-semibold text-center">{member.name}</h3>
                                <p className="text-center text-blue-600 mb-2">{member.role}</p>
                                <p className="text-sm text-center text-gray-600">{member.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="bg-gray-100 text-gray-800 py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">Our Core Values</h2>
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                        {coreValues.map((value, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-lg shadow cursor-pointer">
                                <h3 className="text-2xl font-semibold mb-2">{value.title}</h3>
                                <p className="text-gray-600">{value.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="bg-gradient-to-r from-blue-600 to-teal-500 text-white text-center py-20 px-4">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-bold mb-6">Our Mission & Vision</h2>
                    <p className="text-lg max-w-2xl mx-auto">
                        Our mission is to empower businesses with innovative solutions that foster growth and success.
                        We envision a world where technology bridges challenges and solutions.
                    </p>
                </div>
            </section>

            {/* Technologies */}
            <section className="bg-white py-20 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold mb-12">Technologies We Work With</h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        {techStack.map((tech, index) => (
                            <div key={index} className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full cursor-pointer">
                                <img src={tech.src} alt={tech.alt} className="w-10 h-10" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gradient-to-r from-blue-600 to-teal-500 text-white text-center py-20 px-4">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-bold mb-6">Join Our Team</h2>
                    <Link to={PATHS.SIGNUP}>
                        <button className="bg-white text-blue-600 font-bold py-3 px-6 rounded-full hover:bg-gray-200 transition cursor-pointer">
                            Apply Now
                        </button>
                    </Link>
                </div>
            </section>
        </main>
    );
}

export default About;
