"use client";

import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";

import Floating, { FloatingElement } from "@/components/ui/parallax-floating";

const exampleImages = [
  {
    url: "https://wallpapers.com/images/hd/anime-pictures-8hfh38y3ck06cjif.jpg",
    author: "Monster",
    title: "Monster Anime Cover",
  },
  {
    url: "https://indigomusic.com/wp-content/uploads/2024/06/untitled-design-11-min-4.png",
    title: "Ergo Proxy Anime Cover",
    author: "Ergo Proxy",
  },
  {
    url: "https://www.browardcenter.org/assets/img/edp_BronxTale_2122_955x500-f30235f38f.jpg",
    author: "A Bronx Tale",
    title: "A Bronx Tale Movie Cover",
  },
  {
    url: "https://sysfilessacbe149174fee.blob.core.windows.net/public-container/clients/worthingtheatres/files/e990fc99-41ef-4a4d-ab89-170b390ebb9c.jpg",
    author: "Spirited Away",
    title: "Spirited away",
  },
  {
    url: "https://www.bpmcdn.com/f/files/kelowna/import/2022-06/29555137_web1_220630-KCN-Breaking-Bad-_1.jpg",
    author: "Breaking Bad",
    title: "Breaking Bad Series Cover",
  },
  {
    url: "https://www.vitalthrills.com/wp-content/uploads/2024/12/invincibleccxp1.jpg",
    author: "Invincible",
    title: "Invincible Series Cover",
  },
  {
    url: "https://m.media-amazon.com/images/M/MV5BNmI1MmYxNWQtY2E5NC00ZTlmLWIzZGEtNzM1YmE3NDA5NzhjXkEyXkFqcGc@._V1_.jpg",
    author: "Jujutsu Kaisen",
    title: "Jujutsu Kaisen Series Cover",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/en/e/e4/Steins%3BGate_cover_art.jpg",
    author: "Steins;Gate",
    title: "Steins;Gate Anime Cover",
  }
];

const Preview = () => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(
      "img",
      { opacity: [0, 1] },
      { duration: 0.5, delay: stagger(0.15) }
    );
  }, [animate]);

  return (
    <div
      className="w-full h-full flex justify-center items-center bg-black overflow-hidden"
      ref={scope}
    >
      <Floating sensitivity={2} easingFactor={0.08} className="z-0">
        {/* Top row */}
        <FloatingElement depth={0.5} className="top-[8%] left-[11%]">
          <motion.img
            initial={{ opacity: 0 }}
            alt={exampleImages[0].title}
            src={exampleImages[0].url}
            className="w-16 h-16 md:w-24 md:h-24 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg shadow-lg"
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[10%] left-[32%]">
          <motion.img
            initial={{ opacity: 0 }}
            alt={exampleImages[1].title}
            src={exampleImages[1].url}
            className="w-20 h-20 md:w-28 md:h-28 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg shadow-lg"
          />
        </FloatingElement>
        <FloatingElement depth={2} className="top-[2%] left-[53%]">
          <motion.img
            initial={{ opacity: 0 }}
            alt={exampleImages[2].title}
            src={exampleImages[2].url}
            className="w-28 h-40 md:w-40 md:h-52 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg shadow-lg"
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[0%] left-[83%]">
          <motion.img
            initial={{ opacity: 0 }}
            alt={exampleImages[3].title}
            src={exampleImages[3].url}
            className="w-24 h-24 md:w-32 md:h-32 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg shadow-lg"
          />
        </FloatingElement>

        {/* Middle and bottom rows */}
        <FloatingElement depth={1} className="top-[40%] left-[2%]">
          <motion.img
            initial={{ opacity: 0 }}
            alt={exampleImages[4].title}
            src={exampleImages[4].url}
            className="w-28 h-28 md:w-36 md:h-36 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg shadow-lg"
          />
        </FloatingElement>
        <FloatingElement depth={4} className="top-[73%] left-[15%]">
          <motion.img
            initial={{ opacity: 0 }}
            alt={exampleImages[5].title}
            src={exampleImages[5].url}
            className="w-40 md:w-52 md:h-64 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg shadow-lg"
          />
        </FloatingElement>
        <FloatingElement depth={1.5} className="top-[65%] left-[70%]">
          <motion.img
            initial={{ opacity: 0 }}
            alt={exampleImages[6].title}
            src={exampleImages[6].url}
            className="w-24 h-24 md:w-32 md:h-32 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg shadow-lg"
          />
        </FloatingElement>
        <FloatingElement depth={0.8} className="top-[45%] left-[80%]">
          <motion.img
            initial={{ opacity: 0 }}
            alt={exampleImages[7].title}
            src={exampleImages[7].url}
            className="w-20 h-20 md:w-28 md:h-28 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg shadow-lg"
          />
        </FloatingElement>
      </Floating>
    </div>
  );
};

export { Preview };
