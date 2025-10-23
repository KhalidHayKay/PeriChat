import { useEffect, type RefObject } from 'react';

/**
 * Custom hook that prevents scroll events from propagating to parent elements
 * when a scrollable container reaches its boundaries
 *
 * @param ref - Reference to the scrollable element
 */
export default function usePreventScrollPropagation(
    ref: RefObject<HTMLElement>
) {
    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleWheel = (e: WheelEvent) => {
            const { scrollTop, scrollHeight, clientHeight } = element;

            // Check if we're at the top or bottom boundary
            const isAtTop = scrollTop === 0 && e.deltaY < 0;
            const isAtBottom =
                Math.abs(scrollHeight - scrollTop - clientHeight) < 1 &&
                e.deltaY > 0;

            // If we're at a boundary, prevent the event from bubbling up
            if (isAtTop || isAtBottom) {
                e.preventDefault();
            }
        };

        // Add the event listener with the passive option set to false to allow preventDefault
        element.addEventListener('wheel', handleWheel, { passive: false });

        // Clean up
        return () => {
            element.removeEventListener('wheel', handleWheel);
        };
    }, [ref]);
}
