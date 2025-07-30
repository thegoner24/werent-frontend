"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  onCrop: (croppedImageBase64: string) => void;
  selectedImage: string | null;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  isOpen,
  onClose,
  onCrop,
  selectedImage
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 50, y: 50, width: 200, height: 200 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Load image when selectedImage changes
  useEffect(() => {
    if (selectedImage) {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        // Calculate canvas size to fit container while maintaining aspect ratio
        const container = containerRef.current;
        if (container) {
          const containerWidth = container.clientWidth - 40; // padding
          const containerHeight = container.clientHeight - 120; // padding + buttons
          
          let canvasWidth = img.width;
          let canvasHeight = img.height;
          
          // Scale down if image is too large
          if (canvasWidth > containerWidth || canvasHeight > containerHeight) {
            const scaleX = containerWidth / canvasWidth;
            const scaleY = containerHeight / canvasHeight;
            const scale = Math.min(scaleX, scaleY);
            
            canvasWidth = canvasWidth * scale;
            canvasHeight = canvasHeight * scale;
          }
          
          setCanvasSize({ width: canvasWidth, height: canvasHeight });
          
          // Center crop area
          const cropSize = Math.min(canvasWidth, canvasHeight) * 0.6;
          setCropArea({
            x: (canvasWidth - cropSize) / 2,
            y: (canvasHeight - cropSize) / 2,
            width: cropSize,
            height: cropSize
          });
        }
      };
      img.src = selectedImage;
    }
  }, [selectedImage]);

  // Draw image and crop area on canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image || !canvasSize.width || !canvasSize.height) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    ctx.drawImage(image, 0, 0, canvasSize.width, canvasSize.height);

    // Draw overlay (dark areas outside crop)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear crop area
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);

    // Draw crop area border
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);

    // Draw corner handles - make them more visible and properly aligned
    const handleSize = 12;
    const handleOffset = handleSize / 2;
    
    const handles = [
      { x: cropArea.x - handleOffset, y: cropArea.y - handleOffset, cursor: 'nw-resize' }, // top-left
      { x: cropArea.x + cropArea.width - handleOffset, y: cropArea.y - handleOffset, cursor: 'ne-resize' }, // top-right
      { x: cropArea.x - handleOffset, y: cropArea.y + cropArea.height - handleOffset, cursor: 'sw-resize' }, // bottom-left
      { x: cropArea.x + cropArea.width - handleOffset, y: cropArea.y + cropArea.height - handleOffset, cursor: 'se-resize' } // bottom-right
    ];

    // Draw handles with better visibility
    handles.forEach(handle => {
      // Draw white outline for better visibility
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(handle.x - 1, handle.y - 1, handleSize + 2, handleSize + 2);
      
      // Draw purple handle
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
      
      // Draw dark border
      ctx.strokeStyle = '#4c1d95';
      ctx.lineWidth = 1;
      ctx.strokeRect(handle.x, handle.y, handleSize, handleSize);
    });
  }, [image, cropArea, canvasSize]);

  // Redraw canvas when dependencies change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const getEventCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      // Mouse event
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const handleStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const { x, y } = getEventCoordinates(e);

    // Check if clicking on any resize handle - use consistent sizing
    const handleSize = 12;
    const handleOffset = handleSize / 2;
    const hitArea = 20; // Larger hit area for mobile
    
    const handles = [
      { x: cropArea.x - handleOffset, y: cropArea.y - handleOffset, type: 'top-left' },
      { x: cropArea.x + cropArea.width - handleOffset, y: cropArea.y - handleOffset, type: 'top-right' },
      { x: cropArea.x - handleOffset, y: cropArea.y + cropArea.height - handleOffset, type: 'bottom-left' },
      { x: cropArea.x + cropArea.width - handleOffset, y: cropArea.y + cropArea.height - handleOffset, type: 'bottom-right' }
    ];

    // Check each handle with expanded hit area
    for (const handle of handles) {
      const hitX = handle.x + handleOffset - hitArea / 2;
      const hitY = handle.y + handleOffset - hitArea / 2;
      
      if (x >= hitX && x <= hitX + hitArea && 
          y >= hitY && y <= hitY + hitArea) {
        setIsResizing(true);
        setActiveHandle(handle.type);
        setResizeStart({
          x: x,
          y: y,
          width: cropArea.width,
          height: cropArea.height
        });
        e.preventDefault(); // Prevent default behavior
        return;
      }
    }

    // Check if clicking inside crop area for dragging
    if (x >= cropArea.x && x <= cropArea.x + cropArea.width && 
        y >= cropArea.y && y <= cropArea.y + cropArea.height) {
      setIsDragging(true);
      setDragStart({ x: x - cropArea.x, y: y - cropArea.y });
      e.preventDefault();
    }
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getEventCoordinates(e);

    if (isDragging) {
      const newX = Math.max(0, Math.min(x - dragStart.x, canvasSize.width - cropArea.width));
      const newY = Math.max(0, Math.min(y - dragStart.y, canvasSize.height - cropArea.height));
      
      setCropArea(prev => ({
        ...prev,
        x: newX,
        y: newY
      }));
    } else if (isResizing && activeHandle) {
      const minSize = 50;
      
      // Calculate new dimensions based on which handle is being dragged
      let newCropArea = { ...cropArea };

      switch (activeHandle) {
        case 'bottom-right':
          // Simple case - just expand from top-left corner
          const newWidth = Math.max(minSize, x - cropArea.x);
          const newHeight = Math.max(minSize, y - cropArea.y);
          const size = Math.min(newWidth, newHeight); // Keep square
          
          // Don't exceed canvas bounds
          const maxSize = Math.min(
            canvasSize.width - cropArea.x,
            canvasSize.height - cropArea.y
          );
          
          newCropArea.width = Math.min(size, maxSize);
          newCropArea.height = newCropArea.width;
          break;
          
        case 'top-left':
          // Calculate new size based on distance from bottom-right corner
          const bottomRightX = cropArea.x + cropArea.width;
          const bottomRightY = cropArea.y + cropArea.height;
          const newSizeFromBR = Math.min(bottomRightX - x, bottomRightY - y);
          const finalSize = Math.max(minSize, newSizeFromBR);
          
          newCropArea.width = finalSize;
          newCropArea.height = finalSize;
          newCropArea.x = bottomRightX - finalSize;
          newCropArea.y = bottomRightY - finalSize;
          
          // Ensure we don't go beyond canvas bounds
          if (newCropArea.x < 0) {
            newCropArea.x = 0;
            newCropArea.width = bottomRightX;
            newCropArea.height = newCropArea.width;
            newCropArea.y = bottomRightY - newCropArea.height;
          }
          if (newCropArea.y < 0) {
            newCropArea.y = 0;
            newCropArea.height = bottomRightY;
            newCropArea.width = newCropArea.height;
            newCropArea.x = bottomRightX - newCropArea.width;
          }
          break;
          
        case 'top-right':
          const bottomLeftX = cropArea.x;
          const bottomLeftY = cropArea.y + cropArea.height;
          const newSizeFromBL = Math.min(x - bottomLeftX, bottomLeftY - y);
          const finalSizeBL = Math.max(minSize, newSizeFromBL);
          
          newCropArea.width = finalSizeBL;
          newCropArea.height = finalSizeBL;
          newCropArea.x = bottomLeftX;
          newCropArea.y = bottomLeftY - finalSizeBL;
          
          // Ensure bounds
          if (newCropArea.x + newCropArea.width > canvasSize.width) {
            newCropArea.width = canvasSize.width - newCropArea.x;
            newCropArea.height = newCropArea.width;
            newCropArea.y = bottomLeftY - newCropArea.height;
          }
          if (newCropArea.y < 0) {
            newCropArea.y = 0;
            newCropArea.height = bottomLeftY;
            newCropArea.width = newCropArea.height;
          }
          break;
          
        case 'bottom-left':
          const topRightX = cropArea.x + cropArea.width;
          const topRightY = cropArea.y;
          const newSizeFromTR = Math.min(topRightX - x, y - topRightY);
          const finalSizeTR = Math.max(minSize, newSizeFromTR);
          
          newCropArea.width = finalSizeTR;
          newCropArea.height = finalSizeTR;
          newCropArea.x = topRightX - finalSizeTR;
          newCropArea.y = topRightY;
          
          // Ensure bounds
          if (newCropArea.x < 0) {
            newCropArea.x = 0;
            newCropArea.width = topRightX;
            newCropArea.height = newCropArea.width;
          }
          if (newCropArea.y + newCropArea.height > canvasSize.height) {
            newCropArea.height = canvasSize.height - newCropArea.y;
            newCropArea.width = newCropArea.height;
            newCropArea.x = topRightX - newCropArea.width;
          }
          break;
      }
      
      setCropArea(newCropArea);
    } else {
      // Update cursor based on position - use consistent sizing
      const handleSize = 12;
      const handleOffset = handleSize / 2;
      const hitArea = 16;
      
      const handles = [
        { x: cropArea.x - handleOffset, y: cropArea.y - handleOffset, cursor: 'nw-resize' },
        { x: cropArea.x + cropArea.width - handleOffset, y: cropArea.y - handleOffset, cursor: 'ne-resize' },
        { x: cropArea.x - handleOffset, y: cropArea.y + cropArea.height - handleOffset, cursor: 'sw-resize' },
        { x: cropArea.x + cropArea.width - handleOffset, y: cropArea.y + cropArea.height - handleOffset, cursor: 'se-resize' }
      ];
      
      let cursorSet = false;
      for (const handle of handles) {
        const hitX = handle.x + handleOffset - hitArea / 2;
        const hitY = handle.y + handleOffset - hitArea / 2;
        
        if (x >= hitX && x <= hitX + hitArea && 
            y >= hitY && y <= hitY + hitArea) {
          canvas.style.cursor = handle.cursor;
          cursorSet = true;
          break;
        }
      }
      
      if (!cursorSet) {
        if (x >= cropArea.x && x <= cropArea.x + cropArea.width && 
            y >= cropArea.y && y <= cropArea.y + cropArea.height) {
          canvas.style.cursor = 'move';
        } else {
          canvas.style.cursor = 'default';
        }
      }
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    setIsResizing(false);
    setActiveHandle(null);
    
    // Reset cursor
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = 'default';
    }
  };

  const handleCrop = () => {
    if (!image || !canvasSize.width || !canvasSize.height) return;

    // Create a new canvas for cropping
    const cropCanvas = document.createElement('canvas');
    const cropCtx = cropCanvas.getContext('2d');
    if (!cropCtx) return;

    // Set crop canvas size to desired output size (300x300 for avatar)
    const outputSize = 300;
    cropCanvas.width = outputSize;
    cropCanvas.height = outputSize;

    // Calculate scale factors
    const scaleX = image.width / canvasSize.width;
    const scaleY = image.height / canvasSize.height;

    // Calculate source rectangle on original image
    const sourceX = cropArea.x * scaleX;
    const sourceY = cropArea.y * scaleY;
    const sourceWidth = cropArea.width * scaleX;
    const sourceHeight = cropArea.height * scaleY;

    // Draw cropped image
    cropCtx.drawImage(
      image,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, outputSize, outputSize
    );

    // Convert to base64
    const croppedImageBase64 = cropCanvas.toDataURL('image/jpeg', 0.9);
    onCrop(croppedImageBase64);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Crop Profile Image</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div 
          ref={containerRef}
          className="flex justify-center mb-4"
          style={{ height: '400px' }}
        >
          {canvasSize.width > 0 && (
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className="border border-gray-300"
              onMouseDown={handleStart}
              onMouseMove={handleMove}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={handleStart}
              onTouchMove={handleMove}
              onTouchEnd={handleEnd}
              style={{ cursor: 'default', touchAction: 'none' }}
            />
          )}
        </div>

        <div className="text-sm text-gray-600 mb-4 text-center">
          Drag to move • Drag any corner to resize • Square crop will be maintained
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCrop}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Crop & Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
