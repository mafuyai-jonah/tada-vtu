'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const BUTTON_SIZE = 56; // 14 * 4 = 56px (w-14)
const MARGIN = 24; // Distance from edge

export function WhatsAppButton() {
  const phoneNumber = '2347058748217';
  const message = 'Hello TADA VTU, I need assistance with...';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const buttonStart = useRef({ x: 0, y: 0 });

  // Get button's actual position on screen
  const getButtonRect = useCallback(() => {
    if (!buttonRef.current) return null;
    return buttonRef.current.getBoundingClientRect();
  }, []);

  // Snap to nearest side
  const snapToSide = useCallback((currentX: number, currentY: number) => {
    const rect = getButtonRect();
    if (!rect) return { x: currentX, y: currentY };

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate center of button
    const buttonCenterX = rect.left + BUTTON_SIZE / 2;
    
    // Determine which side to snap to
    const snapToRight = buttonCenterX > viewportWidth / 2;
    
    // Calculate new X position (snap to left or right edge)
    let newX: number;
    if (snapToRight) {
      // Snap to right: button should be at right edge with margin
      // Default position is bottom-right (right-6 = 24px from right)
      // So x offset of 0 means right edge
      newX = 0;
    } else {
      // Snap to left: need to move button to left edge
      // Calculate offset needed to place button at left edge with margin
      newX = -(viewportWidth - BUTTON_SIZE - MARGIN * 2);
    }
    
    // Constrain Y within viewport
    const minY = -(viewportHeight - BUTTON_SIZE - MARGIN * 2);
    const maxY = 0;
    const newY = Math.max(minY, Math.min(maxY, currentY));
    
    return { x: newX, y: newY };
  }, [getButtonRect]);

  // Load saved position
  useEffect(() => {
    const saved = localStorage.getItem('whatsapp-btn-pos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPosition(parsed);
      } catch (e) {
        console.error('Failed to parse saved position');
      }
    }
  }, []);

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setHasMoved(false);
    setIsSnapping(false);
    dragStart.current = { x: clientX, y: clientY };
    buttonStart.current = { ...position };
  };

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;

    const deltaX = clientX - dragStart.current.x;
    const deltaY = clientY - dragStart.current.y;

    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      setHasMoved(true);
    }

    let newX = buttonStart.current.x + deltaX;
    let newY = buttonStart.current.y + deltaY;

    // Constrain within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Max left offset (button starts at right-6, so moving left is negative)
    const maxLeftOffset = -(viewportWidth - BUTTON_SIZE - MARGIN);
    // Max right offset (can't go past right edge)
    const maxRightOffset = MARGIN;
    // Max up offset (button starts at bottom-6)
    const maxUpOffset = -(viewportHeight - BUTTON_SIZE - MARGIN);
    // Max down offset
    const maxDownOffset = MARGIN;

    newX = Math.max(maxLeftOffset, Math.min(maxRightOffset, newX));
    newY = Math.max(maxUpOffset, Math.min(maxDownOffset, newY));

    setPosition({ x: newX, y: newY });
  }, [isDragging]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    setIsSnapping(true);
    
    // Snap to nearest side
    const snappedPosition = snapToSide(position.x, position.y);
    setPosition(snappedPosition);
    
    // Save position after snap
    setTimeout(() => {
      localStorage.setItem('whatsapp-btn-pos', JSON.stringify(snappedPosition));
      setIsSnapping(false);
    }, 300);
  }, [isDragging, position, snapToSide]);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleMouseUp = () => handleEnd();

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMove, handleEnd]);

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => handleEnd();

  const handleClick = (e: React.MouseEvent) => {
    if (hasMoved) {
      e.preventDefault();
    }
  };

  return (
    <a
      ref={buttonRef}
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`fixed bottom-6 right-6 z-[100] w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 select-none ${
        isDragging ? 'cursor-grabbing scale-110' : 'cursor-grab'
      }`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) scale(${isDragging ? 1.1 : 1})`,
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      aria-label="Contact us on WhatsApp"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-8 h-8 text-white pointer-events-none"
        fill="currentColor"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    </a>
  );
}
