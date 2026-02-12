
/**
 * TV Navigation Composable
 * Handles spatial navigation for remote controls (D-pad)
 */

export const useTVNavigation = () => {
    // Current focused element
    const currentFocus = ref<HTMLElement | null>(null);

    // Initial query selector for focusable items
    const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [data-focusable]';

    const getFocusableElements = (): HTMLElement[] => {
        return Array.from(document.querySelectorAll(FOCUSABLE_SELECTOR))
            .filter(el => {
                const rect = el.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== 'hidden';
            }) as HTMLElement[];
    };

    const getDistance = (rect1: DOMRect, rect2: DOMRect, direction: string) => {
        const center1 = { x: rect1.left + rect1.width / 2, y: rect1.top + rect1.height / 2 };
        const center2 = { x: rect2.left + rect2.width / 2, y: rect2.top + rect2.height / 2 };

        // Simple Euclidean distance for now
        // TODO: Weighted logic for "alignment" vs "distance"
        return Math.sqrt(Math.pow(center2.x - center1.x, 2) + Math.pow(center2.y - center1.y, 2));
    };

    /**
     * Find best candidate in direction
     */
    const findNextFocus = (direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => {
        const active = document.activeElement as HTMLElement;
        if (!active || active === document.body) {
            // If nothing focused, focus first available
            const all = getFocusableElements();
            const first = all[0];
            if (first) {
                first.focus();
            }
            return;
        }

        const activeRect = active.getBoundingClientRect();
        const activeCenter = {
            x: activeRect.left + activeRect.width / 2,
            y: activeRect.top + activeRect.height / 2
        };

        const candidates = getFocusableElements().filter(el => el !== active);
        let bestCandidate: HTMLElement | null = null;
        let minDistance = Infinity;

        for (const candidate of candidates) {
            const rect = candidate.getBoundingClientRect();
            const center = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };

            let isValid = false;

            // Cone logic logic could be better, but simple directional check first
            switch (direction) {
                case 'ArrowRight':
                    isValid = center.x > activeCenter.x;
                    break;
                case 'ArrowLeft':
                    isValid = center.x < activeCenter.x;
                    break;
                case 'ArrowDown':
                    isValid = center.y > activeCenter.y;
                    break;
                case 'ArrowUp':
                    isValid = center.y < activeCenter.y;
                    break;
            }

            if (isValid) {
                // Weight distance to favor elements strictly aligned in the primary axis
                // e.g. for Up/Down, penalize X difference.
                let distance = Math.pow(center.x - activeCenter.x, 2) + Math.pow(center.y - activeCenter.y, 2);

                // Alignment penalty
                if (direction === 'ArrowUp' || direction === 'ArrowDown') {
                    distance += Math.pow(center.x - activeCenter.x, 2) * 2;
                } else {
                    distance += Math.pow(center.y - activeCenter.y, 2) * 2;
                }

                if (distance < minDistance) {
                    minDistance = distance;
                    bestCandidate = candidate;
                }
            }
        }

        if (bestCandidate) {
            bestCandidate.focus();
            // Scroll into view logic handled by browser focus usually, but we can enforce smooth:
            bestCandidate.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault(); // Stop default scroll
            findNextFocus(e.key as any);
        }

        // Back Button (Android TV / Fire Stick uses default browser behavior mostly, but Esc is mapped often)
        if (e.key === 'Escape' || e.key === 'Backspace') {
            // Let default history.back() happen if not handled
            // check if modal open?
        }
    };

    onMounted(() => {
        window.addEventListener('keydown', handleKeyDown);
    });

    onUnmounted(() => {
        window.removeEventListener('keydown', handleKeyDown);
    });
};
