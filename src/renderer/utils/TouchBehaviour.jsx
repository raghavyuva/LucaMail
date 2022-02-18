import { useState, useEffect, useRef } from 'react';
export default function useComponentVisible(initialIsVisible, open, setopen) {
    const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
    const ref = useRef(null);
    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsComponentVisible(false);
            setopen(false);
        }
    };
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };

    });
    return { ref, isComponentVisible, setIsComponentVisible };
} 