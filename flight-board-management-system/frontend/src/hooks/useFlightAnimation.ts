import { useState, useEffect } from 'react';

export const useFlightAnimation = (isNew: boolean = false) => {
    const [animationClass, setAnimationClass] = useState('');

    useEffect(() => {
        if (isNew) {
            setAnimationClass('fade-in');
            const timeout = setTimeout(() => setAnimationClass(''), 1000);
            return () => clearTimeout(timeout);
        }
    }, [isNew]);

    return animationClass;
};