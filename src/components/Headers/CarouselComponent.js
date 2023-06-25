import React, { useState } from 'react';
import { Carousel, CarouselItem, CarouselCaption } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/CarouselComponent.css';

const CarouselComponent = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);
    const navigate = useNavigate();

    const items = [
        {
            src: 'bytes2.jpeg',
            altText: 'bytes2',
            caption: 'bytes2',
            path: '/game1'

        },
        {
            src: '/fallback.jpeg',
            altText: 'fallback',
            caption: 'fallback',
            path: '/game2'
        },
        {
            src: 'checkBalance.jpeg',
            altText: 'checkBalance',
            caption: 'checkBalance',
            path: '/game3'
        },
        {
            src: 'payableContract.jpeg',
            altText: 'payableContract',
            caption: 'payableContract',
            path: '/game4'
        },
        {
            src: 'timeStamp.jpeg',
            altText: 'timeStamp',
            caption: 'timeStamp',
            path: '/game5'
        },
        {
            src: 'GasChecker.jpeg',
            altText: 'GasChecker',
            caption: 'GasChecker',
            path: '/game6'
        },
        {
            src: 'chamgePassword.jpeg',
            altText: 'chamgePassword',
            caption: 'chamgePassword',
            path: '/game7'
        },
        {
            src: 'overflow.jpeg',
            altText: 'overflow',
            caption: 'overflow',
            path: '/game8'
        },
        {
            src: 'blockhash.jpeg',
            altText: 'blockhash',
            caption: 'blockhash',
            path: '/game9'
        },
        {
            src: 'interfaceId.jpeg',
            altText: 'interfaceId',
            caption: 'interfaceId',
            path: '/game10'
        },
        {
            src: 'encodeData.jpeg',
            altText: 'encodeData',
            caption: 'encodeData',
            path: '/game11'
        },
        {
            src: 'hashCollosion.jpeg',
            altText: 'hashCollosion',
            caption: 'hashCollosion',
            path: '/game12'
        },
        {
            src: 'decodeData.jpeg',
            altText: 'decodeData',
            caption: 'decodeData',
            path: '/game13'
        },
        {
            src: 'factory.jpeg',
            altText: 'factory',
            caption: 'factory',
            path: '/game14'
        }
    ];
    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    }

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    }

    const slides = items.map((item) => {
        return (
            <CarouselItem
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
                key={item.src}
            >
                <img
                    className="carousel-image"
                    src={item.src}
                    alt={item.altText}
                    onClick={() => navigate(item.path)} // Use the 'path' property
                />
                
                <CarouselCaption
                    captionText={item.caption}
                    className="custom-caption"
                    style={{ fontSize: '300px' }} // Add style here
                />            
                </CarouselItem>
        );
    });


    return (
        <div className="carousel-container">
            <Carousel
                activeIndex={activeIndex}
                next={next}
                previous={previous}
                interval={2500}
                className="carousel-size"
            >
                {/* Removed CarouselIndicators */}
                {slides}
                {/* Removed CarouselControl components */}
            </Carousel>
        </div>
    );
}

export default CarouselComponent;