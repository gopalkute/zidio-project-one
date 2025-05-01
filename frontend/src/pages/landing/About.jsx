import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router';
import { PATHS } from '@/utils';

function About() {
    // Team slider settings
    const teamSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    // Technologies slider settings
    const techSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    };

    return (
        <main className="bg-gradient-to-r from-teal-500 to-blue-600">
            {/* Hero Section */}
            <section className="container mx-auto text-center text-white py-20 px-4 animate-fadeIn">
                <h1 className="text-5xl font-extrabold mb-6 tracking-tight drop-shadow-md">
                    Meet Our Team
                </h1>
                <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                    A team of passionate individuals working together to deliver results.
                </p>
            </section>

            {/* Team Members Section */}
            <section className="bg-white text-gray-800 py-20">
                <div className="container mx-auto text-center px-4">
                    <h2 className="text-4xl font-bold mb-12 animate-slideInDown">Our Dedicated Team</h2>
                    <Slider {...teamSettings}>
                        {/* Team Members */}
                        {[
                            {
                                name: 'Pratik Meghnathi',
                                role: 'Lead Developer',
                                desc: 'Pratik is a highly skilled full-stack developer, passionate about creating impactful web applications.',
                                img: 'https://randomuser.me/api/portraits/men/11.jpg',
                            },
                            {
                                name: 'Swapnil Kanthiwar',
                                role: 'UI/UX Designer',
                                desc: 'Swapnil is passionate about creating intuitive and visually appealing user interfaces that elevate user experience.',
                                img: 'https://randomuser.me/api/portraits/men/21.jpg',
                            },
                            {
                                name: 'Gopal Kute',
                                role: 'Backend Developer',
                                desc: 'Gopal specializes in backend architecture and development, ensuring scalability and performance.',
                                img: 'https://randomuser.me/api/portraits/men/22.jpg',
                            },
                            {
                                name: 'John Doe',
                                role: 'Frontend Developer',
                                desc: 'John is an expert in HTML, CSS, JavaScript, and React, delivering responsive and dynamic websites.',
                                img: 'https://randomuser.me/api/portraits/men/23.jpg',
                            },
                            {
                                name: 'Jane Smith',
                                role: 'Project Manager',
                                desc: 'Jane excels at overseeing projects from start to finish, ensuring all deliverables are met on time and within budget.',
                                img: 'https://randomuser.me/api/portraits/men/24.jpg',
                            },
                        ].map((member, index) => (
                            <div
                                key={index}
                                className="p-8 bg-gray-100 rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 animate-fadeInUp"
                            >
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="rounded-full mx-auto mb-4 w-32 h-32 object-cover"
                                />
                                <h3 className="text-2xl font-semibold mb-2">{member.name}</h3>
                                <p className="mb-4">{member.role}</p>
                                <p className="text-sm text-gray-600">{member.desc}</p>
                            </div>
                        ))}
                    </Slider>
                </div>
            </section>

            {/* Company Values Section */}
            <section className="bg-gray-100 py-20 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold mb-6">Our Core Values</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[
                            { title: 'Innovation', text: 'We are driven by creativity and innovation to deliver cutting-edge solutions.' },
                            { title: 'Collaboration', text: 'We believe in working together, sharing knowledge, and supporting each other to achieve great results.' },
                            { title: 'Excellence', text: 'We strive for excellence in everything we do, ensuring quality and precision in every project.' },
                        ].map((value, idx) => (
                            <div key={idx} className="p-8 bg-white shadow-lg rounded-lg">
                                <h3 className="text-2xl font-semibold mb-4">{value.title}</h3>
                                <p className="text-lg text-gray-600">{value.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="bg-gradient-to-r from-blue-600 to-teal-500 text-white text-center py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold mb-6">Our Mission & Vision</h2>
                    <p className="text-xl mb-4 max-w-2xl mx-auto">
                        Our mission is to empower businesses with innovative solutions that foster growth,
                        productivity, and success. We envision a world where technology bridges the gap between
                        challenges and solutions.
                    </p>
                </div>
            </section>

            {/* Technologies We Work With - Slider */}
            <section className="py-20 bg-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold mb-12">Technologies We Work With</h2>
                    <Slider {...techSettings}>
                        {[
                            { src: 'https://img.icons8.com/ios/50/000000/react.png', alt: 'React' },
                            { src: 'https://img.icons8.com/ios/50/000000/nodejs.png', alt: 'NodeJS' },
                            { src: 'https://img.icons8.com/ios/50/000000/javascript.png', alt: 'JavaScript' },
                            { src: 'https://img.icons8.com/ios/50/000000/python.png', alt: 'Python' },
                            { src: 'https://img.icons8.com/ios/50/000000/html-5--v1.png', alt: 'HTML5' },
                            { src: 'https://img.icons8.com/ios/50/000000/css3.png', alt: 'CSS3' },
                            { src: 'https://img.icons8.com/ios/50/000000/github.png', alt: 'GitHub' },
                            { src: 'https://img.icons8.com/ios/50/000000/figma.png', alt: 'Figma' },
                        ].map((tech, index) => (
                            <div key={index} className="p-4">
                                <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                    <img src={tech.src} alt={tech.alt} className="w-12 h-12" />
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </section>

            {/* Call to Action */}
            <section className="relative bg-gradient-to-r from-blue-600 to-teal-500 text-white text-center py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/memphis-mini.png')] bg-repeat"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-bold mb-6 animate-pulse">Join Our Team</h2>
                    <Link to={PATHS.SIGNUP}>
                        <button className="bg-white text-blue-600 py-3 px-8 rounded-full font-bold hover:bg-gray-100 transition-all transform hover:scale-110 cursor-pointer">
                            Apply Now
                        </button>
                    </Link>
                </div>
            </section>
        </main>
    );
}

export default About;
