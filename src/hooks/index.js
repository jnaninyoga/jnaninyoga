import { useState, useEffect} from "react";

export function useIntersectView(ref) {
    const [isIntersected, setIsintersected] = useState();
  
    useEffect(()=>{
        const observer = new IntersectionObserver(entries =>{
            setIsintersected(entries[0].isIntersecting);
        });
        observer.observe(ref.current);
    }, [ref]);

    return isIntersected;
}