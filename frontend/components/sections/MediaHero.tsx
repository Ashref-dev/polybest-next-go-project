import Image from "next/image";
import { motion } from "framer-motion";

interface MediaHeroProps {
  title: string;
  description: string;
  backgroundGradient: string;
  backgroundImage: string;
  textColor: string;
}

export function MediaHero({
  title,
  description,
  backgroundGradient,
  backgroundImage,
  textColor,
}: MediaHeroProps) {
  return (
    <section
      className={`${backgroundGradient} relative overflow-hidden min-h-[60vh] flex items-center`}
    >
      {/* Background image with parallax effect */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay scale-105"
          fill
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 md:py-32 relative z-10">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <motion.h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold ${textColor} mb-6 drop-shadow-lg tracking-tight`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {title}
          </motion.h1>
          <motion.p
            className={`text-xl ${textColor} mb-8 leading-relaxed max-w-2xl opacity-90`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {description}
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}
