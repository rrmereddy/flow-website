import * as React from "react";
import { motion, useAnimation } from "framer-motion";
import Iphone15Pro from "@/components/magicui/iphone-15-pro";

export function PrototypeCarousel() {
    const images = ["/screen.png", "/Prototype1.png", "/Prototype2.png", "/Prototype3.png", "/Prototype4.png", "/Prototype5.png"];
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [progress, setProgress] = React.useState(0);
    const controls = useAnimation();

    // Animation duration should be adjusted based on your preference
    const carouselDuration = 30; // seconds for one complete cycle
    const singleImageDuration = carouselDuration / images.length; // seconds for one image

    // Start automatic animation
    React.useEffect(() => {
        // Start the carousel animation
        const autoAnimate = async () => {
            await controls.start({
                x: `-${100 * images.length}%`,
                transition: {
                    duration: carouselDuration,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "loop"
                }
            });
        };

        autoAnimate();

        // Calculate elapsed time for precise progress tracking
        const startTime = Date.now();
        let currentImageIndex = 0;

        const intervalId = setInterval(() => {
            const elapsedTime = (Date.now() - startTime) / 1000; // in seconds
            const currentImageTime = elapsedTime % singleImageDuration;
            const currentProgress = currentImageTime / singleImageDuration;

            // Calculate which image should be active based on total elapsed time
            const newImageIndex = Math.floor((elapsedTime % carouselDuration) / singleImageDuration);

            // Only update state if something changed
            if (newImageIndex !== currentImageIndex) {
                setActiveIndex(newImageIndex);
                currentImageIndex = newImageIndex;
            }

            setProgress(currentProgress);
        }, 50); // Update frequently for smooth animation

        return () => clearInterval(intervalId);
    }, [controls, images.length, carouselDuration, singleImageDuration]);

    return (
        <div className="w-full max-w-xs overflow-hidden flex flex-col items-center">
            <div className="relative w-full overflow-hidden">
                <motion.div
                    className="flex"
                    initial={{ x: 0 }}
                    animate={controls}
                >
                    {[...images, ...images].map((name, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-full flex justify-center p-2"
                        >
                            <Iphone15Pro
                                className="w-full h-auto"
                                src={name}
                            />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center mt-4 space-x-2">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className="relative h-3 rounded-full bg-gray-200 overflow-hidden"
                        style={{
                            width: index === activeIndex ? "24px" : "12px",
                            transition: "width 0.3s ease"
                        }}
                    >
                        <div
                            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                            style={{
                                width: index === activeIndex ? `${progress * 100}%` :
                                    index < activeIndex ? "100%" : "0%",
                                transition: index === activeIndex ? "width 50ms linear" : "width 0.3s ease"
                            }}
                        />
                    </div>
                ))}
            </div>

            <p className="text-sm text-gray-500 mt-4 text-center">
                * Not reflective of actual prices and wait times
            </p>
        </div>
    );
}