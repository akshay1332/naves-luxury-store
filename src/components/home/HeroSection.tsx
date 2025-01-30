import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { LampContainer } from "@/components/ui/lamp";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { MarqueeAnimation } from "@/components/ui/marquee-effect";


export function HeroSection() {
  return (
    <>
      <LampContainer>
        <VerticalCutReveal
          splitBy="characters"
          staggerDuration={0.025}
          staggerFrom="first"
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 21,
          }}
          containerClassName="mt-8 text-white py-4 text-center text-4xl font-medium tracking-tight md:text-7xl"
        >
          Elevate Your Style
        </VerticalCutReveal>
        <VerticalCutReveal
          splitBy="characters"
          staggerDuration={0.025}
          staggerFrom="last"
          reverse={true}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 21,
            delay: 0.5,
          }}
          containerClassName="mt-8 text-white py-4 text-center text-4xl font-medium tracking-tight md:text-7xl"
        >
          With Luxury
        </VerticalCutReveal>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-4 text-slate-300 text-lg md:text-xl text-center max-w-2xl"
        >
          Discover our curated collection of premium clothing that defines modern elegance
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8"
        >
          <Link to="/products">
            <Button size="lg" className="bg-cyan-500 text-white hover:bg-cyan-600">
              Shop Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </LampContainer>
      <div className="mt-12">
        <MarqueeAnimation
          direction="left"
          baseVelocity={-3}
          className="bg-cyan-500/10 text-cyan-500 py-2"
        >
          Free Shipping on Orders Over 499 • Premium Quality • Exclusive Designs
        </MarqueeAnimation>
        <MarqueeAnimation
          direction="right"
          baseVelocity={-3}
          className="bg-cyan-500/10 text-cyan-500 py-2"
        >
          New Collections Every Season • Limited Edition Pieces • Worldwide Delivery
        </MarqueeAnimation>
      </div>
      
    </>
  );
}

export default HeroSection;