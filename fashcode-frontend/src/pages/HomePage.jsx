import React from 'react';
import HeroSection from '../components/home/HeroSection';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedProducts from '../components/home/FeaturedProducts';

const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
    </div>
  );
};

export default HomePage;