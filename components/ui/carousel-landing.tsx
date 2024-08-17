import { useEffect, useRef, useState } from "react";

interface Banner {
    url: string;
}

interface LandingCarouselProps {
    banners: Banner[];
    autoplayInterval?: number;
}

const LandingCarousel: React.FC<LandingCarouselProps> = ({
    banners,
    autoplayInterval = 5000,
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoplayActive, setIsAutoplayActive] = useState(true);
    const carouselRef = useRef<HTMLDivElement | null>(null);

    const slideTo = (targetImageNumber: number) => {
        const carouselWidth = carouselRef.current?.clientWidth || 0;
        const targetXPixel = carouselWidth * targetImageNumber + 1;
        carouselRef.current?.scrollTo({
            left: targetXPixel,
            behavior: "smooth",
        });
    };

    const handleNextSlide = () => {
        const nextIndex = (currentSlide + 1) % banners.length;
        setCurrentSlide(nextIndex);
        slideTo(nextIndex);
    };

    const handlePreviousSlide = () => {
        const prevIndex = (currentSlide - 1 + banners.length) % banners.length;
        setCurrentSlide(prevIndex);
        slideTo(prevIndex);
    };

    useEffect(() => {
        if (!isAutoplayActive) return;

        const intervalId = setInterval(handleNextSlide, autoplayInterval);

        return () => clearInterval(intervalId);
    }, [currentSlide, isAutoplayActive, autoplayInterval]);

    return (
        <div className="relative w-full overflow-hidden h-96" ref={carouselRef}>
            <div className="flex w-full h-full">
                {banners.map((b, idx) => (
                    <div
                        key={idx}
                        className="carousel-item relative w-full transition ease-in-out duration-700"
                    >
                        <img
                            src={b.url}
                            className="w-full h-full object-cover"
                            alt={`slide-${idx}`}
                        />
                        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <button onClick={handlePreviousSlide} className="btn btn-circle">
                                ❮
                            </button>
                            <button onClick={handleNextSlide} className="btn btn-circle">
                                ❯
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LandingCarousel;