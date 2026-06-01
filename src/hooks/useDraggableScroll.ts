import { useRef, useEffect, useCallback } from 'react';

export const useDraggableScroll = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);
  const scrollTop = useRef(0);

  const isDragging = useRef(false);

  const onMouseDown = useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    
    const target = e.target as HTMLElement;
    if (
      target.closest('a') || 
      target.closest('input') || 
      target.closest('select')
    ) {
      return;
    }

    isDown.current = true;
    isDragging.current = false;
    ref.current.classList.add('active-drag');
    const rect = ref.current.getBoundingClientRect();
    startX.current = e.clientX - rect.left;
    startY.current = e.clientY - rect.top;
    scrollLeft.current = ref.current.scrollLeft;
    scrollTop.current = ref.current.scrollTop;
  }, []);

  const onMouseLeave = useCallback(() => {
    isDown.current = false;
    ref.current?.classList.remove('active-drag');
  }, []);

  const onMouseUp = useCallback((e: MouseEvent) => {
    if (isDragging.current) {
      // Prevent click if we were dragging
      const preventClick = (e: MouseEvent) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        window.removeEventListener('click', preventClick, true);
      };
      window.addEventListener('click', preventClick, true);
    }
    isDown.current = false;
    isDragging.current = false;
    ref.current?.classList.remove('active-drag');
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDown.current || !ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const walkX = (x - startX.current) * 1.5; 
    const walkY = (y - startY.current) * 1.5;
    
    if (Math.abs(walkX) > 5 || Math.abs(walkY) > 5) {
      isDragging.current = true;
    }

    if (isDragging.current) {
      e.preventDefault();
      ref.current.scrollLeft = scrollLeft.current - walkX;
      ref.current.scrollTop = scrollTop.current - walkY;
    }
  }, []);

  const onTouchStart = useCallback((e: TouchEvent) => {
    if (!ref.current) return;
    const target = e.target as HTMLElement;
    if (
      target.closest('a') || 
      target.closest('input') || 
      target.closest('select')
    ) {
      return;
    }

    isDown.current = true;
    isDragging.current = false;
    const rect = ref.current.getBoundingClientRect();
    startX.current = e.touches[0].clientX - rect.left;
    startY.current = e.touches[0].clientY - rect.top;
    scrollLeft.current = ref.current.scrollLeft;
    scrollTop.current = ref.current.scrollTop;
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!isDown.current || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    const walkX = (x - startX.current) * 1.5;
    const walkY = (y - startY.current) * 1.5;
    
    if (Math.abs(walkX) > 5 || Math.abs(walkY) > 5) {
      isDragging.current = true;
    }

    if (isDragging.current) {
      if (e.cancelable) e.preventDefault();
      ref.current.scrollLeft = scrollLeft.current - walkX;
      ref.current.scrollTop = scrollTop.current - walkY;
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mousemove', onMouseMove);
    
    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchend', onMouseUp);
    el.addEventListener('touchmove', onTouchMove);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mousemove', onMouseMove);
      
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onMouseUp);
      el.removeEventListener('touchmove', onTouchMove);
    };
  }, [onMouseDown, onMouseLeave, onMouseUp, onMouseMove, onTouchStart, onTouchMove]);

  return ref;
};
