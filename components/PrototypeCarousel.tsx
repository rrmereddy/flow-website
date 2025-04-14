import * as React from "react"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Iphone15Pro from "@/components/magicui/iphone-15-pro";

export function PrototypeCarousel() {
    const images = ["/screen.png", "/Prototype1.png", "/Prototype2.png", "/Prototype3.png", "/Prototype4.png", "/Prototype5.png"];
    return (
        <Carousel className="w-full max-w-xs items-center justify-center">
            <CarouselContent>
                {images.map((name, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                            <Iphone15Pro
                                className="size-full"
                                src={name}
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <p className="text-sm text-gray-500 mt-4 text-center">
                * Not reflective of actual prices and wait times
            </p>
        </Carousel>
    )
}
