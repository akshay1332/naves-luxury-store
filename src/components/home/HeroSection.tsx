import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import styled from 'styled-components';

const HeroContainer = styled(motion.div)`
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  background: #0a0a0a;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding-top: 80px;
  }
`;

const ContentSection = styled.div`
  position: relative;
  z-index: 50;
  padding: 8rem 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;

  @media (max-width: 1024px) {
    padding: 6rem 3rem;
  }

  @media (max-width: 768px) {
    padding: 4rem 2rem;
    text-align: center;
    align-items: center;
  }
`;

const MainHeading = styled(motion.h1)`
  font-size: 5rem;
  font-weight: 900;
  line-height: 1.1;
  color: #ffffff;
  font-family: 'Montserrat', sans-serif;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.3);

  .highlight {
    color: #FF3366;
    display: block;
    text-shadow: 0 0 20px rgba(255, 51, 102, 0.3);
  }

  @media (max-width: 1024px) {
    font-size: 4rem;
  }

  @media (max-width: 768px) {
    font-size: 3.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2.75rem;
  }
`;

const SubHeading = styled(motion.p)`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  max-width: 500px;
  font-family: 'Inter', sans-serif;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.2);

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CTAButton = styled(motion(Link))`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: #FF3366;
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 51, 102, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 51, 102, 0.4);
    background: #ff1f4f;
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

const ImageSection = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to right,
      rgba(10, 10, 10, 0.4),
      transparent
    );
    z-index: 61;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const HeroImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0.85;
  filter: contrast(1.1) brightness(1.1);
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.95;
  }
`;

const LampEffect = styled(motion.div)`
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 150%;
    height: 150%;
    top: -25%;
    left: -25%;
    background: conic-gradient(
      from 90deg at 50% 50%,
      #0a0a0a,
      #00a2ff,
      #0a0a0a
    );
    animation: rotate 8s linear infinite;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      transparent 30%,
      #0a0a0a 70%
    );
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export function HeroSection() {
  return (
    <HeroContainer>
      <LampEffect 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.5 }}
      />
      
      <ContentSection>
        <MainHeading
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Elevate Your
          <span className="highlight">Style</span>
          With Custom Designs
        </MainHeading>
        
        <SubHeading
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Discover unique, personalized fashion that speaks your style. Create custom designs that make you stand out.
        </SubHeading>

        <CTAButton
          to="/products"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          Start Designing
          <ArrowRight size={20} />
        </CTAButton>
      </ContentSection>

      <ImageSection>
        <HeroImage
          src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80"
          alt="Fashion Collection"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </ImageSection>
    </HeroContainer>
  );
}

export default HeroSection;