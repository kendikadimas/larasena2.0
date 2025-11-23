import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer, Rect, Line, Group, Circle } from 'react-konva';
import useImage from 'use-image';

// Custom SVG Icons untuk toolbar
const MoveIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15 5M12 2L9 5M12 2V8M12 22L15 19M12 22L9 19M12 22V16M2 12L5 15M2 12L5 9M2 12H8M22 12L19 15M22 12L19 9M22 12H16" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const CantingIcon = () => (
    <img 
        src="/images/cankuy.png" 
        alt="Canting" 
        className="w-7 h-7 object-contain"
    />
);

const PenToolIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4L18 10L12 22L6 10L12 4Z" 
              fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <ellipse cx="12" cy="11" rx="2.5" ry="3" fill="white" opacity="0.4"/>
        <line x1="12" y1="22" x2="12" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="4" r="1.5" fill="#3B82F6" stroke="white" strokeWidth="0.8"/>
    </svg>
);

const EraserIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.24 3.56L20.44 7.76C21.22 8.54 21.22 9.81 20.44 10.59L12 19.03L5.56 12.59L14.04 4.11C14.82 3.32 16.09 3.32 16.87 4.11L16.24 3.56ZM14.12 14.17L9.88 9.93L4.22 15.59C3.44 16.37 3.44 17.64 4.22 18.42L7.05 21.25C7.83 22.03 9.1 22.03 9.88 21.25L14.12 17.01L14.12 14.17Z" 
              fill="currentColor"/>
        <rect x="2" y="20" width="20" height="2" fill="currentColor" opacity="0.7"/>
    </svg>
);

const RectangleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="6" width="16" height="12" rx="1" 
              stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
);

const TriangleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5 L20 19 L4 19 Z" 
              stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round"/>
    </svg>
);

const CircleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="7" 
                stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
);

const PentagonIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4 L19 9 L16 18 L8 18 L5 9 Z" 
              stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round"/>
    </svg>
);

const LineIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="5" y1="18" x2="19" y2="6" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

// Komponen untuk render motif image
const MotifImage = ({ shapeProps, isSelected, onSelect, onChange, trRef, activeTool }) => {
    const shapeRef = useRef();
    
    // ✅ FIX: Support kedua key 'imageUrl' dan 'src'
    const resolvedImage = React.useMemo(() => {
        const imageSource = shapeProps.imageUrl || shapeProps.src; // ✅ Cek kedua key
        
        if (!imageSource) return { src: null, crossOrigin: undefined };

        const isSameOrigin = imageSource.startsWith('/')
            || imageSource.startsWith(window.location.origin);

        return {
            src: imageSource,
            crossOrigin: isSameOrigin ? undefined : 'Anonymous',
        };
    }, [shapeProps.imageUrl, shapeProps.src]); // ✅ Watch kedua key

    const [image] = useImage(resolvedImage.src, resolvedImage.crossOrigin);

    useEffect(() => {
        if (isSelected && trRef.current && shapeRef.current) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer()?.batchDraw();
        }
    }, [isSelected, trRef]);

    return (
        <KonvaImage
            id={shapeProps.id}
            onClick={onSelect}
            onTap={onSelect}
            ref={shapeRef}
            {...shapeProps}
            image={image}
            draggable={activeTool === 'move'}
            listening={activeTool === 'move'}
            onDragEnd={(e) => {
                const node = shapeRef.current;
                if (!node) return;

                onChange({
                    ...shapeProps,
                    x: node.x(),
                    y: node.y(),
                });
            }}
            onTransformEnd={(e) => {
                const node = shapeRef.current;
                if (!node) return;

                const scaleX = node.scaleX();
                const scaleY = node.scaleY();

                node.scaleX(1);
                node.scaleY(1);

                const newWidth = Math.max(10, node.width() * scaleX);
                const newHeight = Math.max(10, node.height() * scaleY);
                const rotation = node.rotation();

                node.width(newWidth);
                node.height(newHeight);
                node.rotation(rotation);

                onChange({
                    ...shapeProps,
                    x: node.x(),
                    y: node.y(),
                    rotation: rotation,
                    width: newWidth,
                    height: newHeight,
                });
            }}
        />
    );
};

const TOOL_LIST = [
    { label: 'Move', value: 'move', icon: <MoveIcon /> },
    { label: 'Canting', value: 'brush', icon: <CantingIcon /> },
    { label: 'Pen Tool', value: 'pen', icon: <PenToolIcon /> },
    { 
        label: 'Shapes', 
        value: 'shape',
        icon: <RectangleIcon />,
        hasDropdown: true,
        subTools: [
            { label: 'Rectangle', value: 'rectangle', icon: <RectangleIcon /> },
            { label: 'Circle', value: 'circle', icon: <CircleIcon /> },
            { label: 'Triangle', value: 'triangle', icon: <TriangleIcon /> },
            { label: 'Pentagon', value: 'pentagon', icon: <PentagonIcon /> },
            { label: 'Line', value: 'line', icon: <LineIcon /> },
        ]
    },
    { label: 'Eraser', value: 'eraser', icon: <EraserIcon /> },
];

// Helper function untuk memotong line dengan eraser
function splitLineByEraser(linePoints, eraserPoints, eraserRadius) {
    if (!linePoints || linePoints.length < 4) return [linePoints];
    if (!eraserPoints || eraserPoints.length < 2) return [linePoints];

    const segments = [];
    let currentSegment = [];
    
    for (let i = 0; i < linePoints.length; i += 2) {
        const px = linePoints[i];
        const py = linePoints[i + 1];
        let isErased = false;

        for (let j = 0; j < eraserPoints.length; j += 2) {
            const ex = eraserPoints[j];
            const ey = eraserPoints[j + 1];
            const distance = Math.sqrt(
                Math.pow(px - ex, 2) + Math.pow(py - ey, 2)
            );

            if (distance < eraserRadius) {
                isErased = true;
                break;
            }
        }

        if (isErased) {
            if (currentSegment.length >= 4) {
                segments.push([...currentSegment]);
            }
            currentSegment = [];
        } else {
            currentSegment.push(px, py);
        }
    }

    if (currentSegment.length >= 4) {
        segments.push(currentSegment);
    }

    return segments.length > 0 ? segments : null;
}

export default function CanvasArea({ 
    canvasObjects = [], // ✅ Terima dari parent
    setCanvasObjects,   // ✅ Terima dari parent
    selectedId,
    setSelectedId,
    stageRef,
    pointer,
    setPointer,
    activeBrush,
    isDrawing,
    setIsDrawing,
    currentTool,
    showGrid,
    snapToGrid,
    onDrop,
    defaultSize = { width: 800, height: 800 } // ✅ Terima dari parent dengan default
}) {
    // ✅ Destructure defaultSize
    const canvasWidth = defaultSize.width;
    const canvasHeight = defaultSize.height;

    const trRef = useRef();
    const containerRef = useRef(null);
    const layerRef = useRef(null);
    const clipGroupRef = useRef(null);
    const isDrawingRef = useRef(false);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const [stageScale, setStageScale] = useState(1);
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
    const [activeTool, setActiveTool] = useState('move');
    const [activeShape, setActiveShape] = useState('rectangle'); // Active shape type
    const [showShapeDropdown, setShowShapeDropdown] = useState(false);
    const [drawing, setDrawing] = useState(false);
    const [currentShape, setCurrentShape] = useState(null);
    const [brushColor, setBrushColor] = useState('#BA682A');
    const [eraserWidth, setEraserWidth] = useState(20);
    const [brushWidth, setBrushWidth] = useState(6);
    
    // Pen Tool states
    const [penPoints, setPenPoints] = useState([]); // Array of {x, y} anchor points
    const [penPath, setPenPath] = useState(null); // Current path being drawn
    const [isPathClosed, setIsPathClosed] = useState(false);
    const [penStrokeWidth, setPenStrokeWidth] = useState(3);
    const [penOpacity, setPenOpacity] = useState(1); // Opacity 0-1
    const [penFillMode, setPenFillMode] = useState('fill'); // 'fill' or 'outline'
    
    // Shape Tool states (Rectangle, Circle, Triangle, Pentagon, Line)
    const [shapeStart, setShapeStart] = useState(null);
    const [shapePreview, setShapePreview] = useState(null);
    const [shapeFillColor, setShapeFillColor] = useState('#BA682A');
    const [shapeStrokeColor, setShapeStrokeColor] = useState('#8B5A2B');
    const [shapeStrokeWidth, setShapeStrokeWidth] = useState(2);
    const [shapeOpacity, setShapeOpacity] = useState(1);
    const [shapeFillMode, setShapeFillMode] = useState('fill'); // 'fill' or 'outline'
    
    // Legacy rectangle states (for backward compatibility)
    const rectangleStart = shapeStart;
    const setRectangleStart = setShapeStart;
    const rectanglePreview = shapePreview;
    const setRectanglePreview = setShapePreview;
    const rectangleFillColor = shapeFillColor;
    const setRectangleFillColor = setShapeFillColor;
    const rectangleStrokeColor = shapeStrokeColor;
    const setRectangleStrokeColor = setShapeStrokeColor;
    const rectangleStrokeWidth = shapeStrokeWidth;
    const setRectangleStrokeWidth = setShapeStrokeWidth;
    const rectangleOpacity = shapeOpacity;
    const setRectangleOpacity = setShapeOpacity;
    const rectangleFillMode = shapeFillMode;
    const setRectangleFillMode = setShapeFillMode;
    
    const gridSize = 40;

    // Layer management functions
    const moveLayerUp = (id) => {
        const index = canvasObjects.findIndex(obj => obj.id === id);
        if (index < canvasObjects.length - 1) {
            const newObjects = [...canvasObjects];
            [newObjects[index], newObjects[index + 1]] = [newObjects[index + 1], newObjects[index]];
            setCanvasObjects(newObjects);
        }
    };

    const moveLayerDown = (id) => {
        const index = canvasObjects.findIndex(obj => obj.id === id);
        if (index > 0) {
            const newObjects = [...canvasObjects];
            [newObjects[index], newObjects[index - 1]] = [newObjects[index - 1], newObjects[index]];
            setCanvasObjects(newObjects);
        }
    };

    const bringToFront = (id) => {
        const index = canvasObjects.findIndex(obj => obj.id === id);
        if (index !== -1) {
            const newObjects = [...canvasObjects];
            const [item] = newObjects.splice(index, 1);
            newObjects.push(item);
            setCanvasObjects(newObjects);
        }
    };

    // Update transformer when selection changes
    useEffect(() => {
        if (!trRef.current || !layerRef.current) return;

        if (selectedId && activeTool === 'move') {
            const selectedNode = layerRef.current.findOne('#' + selectedId);
            if (selectedNode && selectedNode.getClassName() === 'Image') {
                trRef.current.nodes([selectedNode]);
                trRef.current.getLayer()?.batchDraw();
            } else {
                trRef.current.nodes([]);
            }
        } else {
            trRef.current.nodes([]);
        }
    }, [selectedId, activeTool, canvasObjects]); // ✅ Ubah objects jadi canvasObjects

    // Responsive sizing - LANGSUNG tanpa delay
    useEffect(() => {
        if (!containerRef.current) return;

        const checkSize = () => {
            if (!containerRef.current) return;
            
            const containerWidth = containerRef.current.offsetWidth;
            const containerHeight = containerRef.current.offsetHeight;
            
            console.log('Container dimensions:', { containerWidth, containerHeight });
            
            setSize({ width: containerWidth, height: containerHeight });

            const padding = 100;
            const scaleX = (containerWidth - padding * 2) / canvasWidth;
            const scaleY = (containerHeight - padding * 2) / canvasHeight;
            const optimalScale = Math.min(scaleX, scaleY, 1);

            setStageScale(optimalScale);
            
            const stageX = (containerWidth - canvasWidth * optimalScale) / 2;
            const stageY = (containerHeight - canvasHeight * optimalScale) / 2;
            setStagePos({ x: stageX, y: stageY });
            
            console.log('Canvas ready:', { containerWidth, containerHeight, scale: optimalScale });
        };

        // Immediate check
        checkSize();
        
        // Backup check dengan requestAnimationFrame
        requestAnimationFrame(checkSize);
        
        // Resize listener
        window.addEventListener('resize', checkSize);
        return () => {
            window.removeEventListener('resize', checkSize);
        };
    }, [canvasWidth, canvasHeight]);

    // Deselect on empty click
    const checkDeselect = (e) => {
        const clickedOnTransformer = e.target.getParent()?.className === 'Transformer';
        if (clickedOnTransformer) return;

        const clickedOnEmpty = e.target === e.target.getStage() || 
                               e.target.getClassName() === 'Rect';
        
        if (clickedOnEmpty && activeTool === 'move') {
            setSelectedId(null);
        }
    };

    // Zoom handler
    const handleWheel = (e) => {
        e.evt.preventDefault();
        const scaleBy = 1.05;
        const stage = stageRef.current;
        const oldScale = stage.scaleX();

        let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
        newScale = Math.max(0.1, Math.min(4, newScale));
        
        setStageScale(newScale);
        
        const newStageX = (size.width - canvasWidth * newScale) / 2;
        const newStageY = (size.height - canvasHeight * newScale) / 2;
        setStagePos({ x: newStageX, y: newStageY });
    };

    // Get pointer position relative to canvas
    const getCanvasPointer = (stage) => {
        const pointer = stage.getPointerPosition();
        return {
            x: (pointer.x - stagePos.x) / stageScale,
            y: (pointer.y - stagePos.y) / stageScale,
        };
    };

    // Drawing handlers
    const handleMouseDown = (e) => {
        if (activeTool === 'move') return;

        const stage = e.target.getStage();
        const pos = getCanvasPointer(stage);
        
        // Check if click is within canvas bounds
        if (pos.x < 0 || pos.x > canvasWidth || pos.y < 0 || pos.y > canvasHeight) {
            return;
        }

        if (activeTool === 'pen') {
            // Pen tool: add anchor point on click
            const newPoint = { x: pos.x, y: pos.y };
            
            // Check if clicking near first point to close path (within 10px)
            if (penPoints.length > 2) {
                const firstPoint = penPoints[0];
                const dist = Math.sqrt(Math.pow(pos.x - firstPoint.x, 2) + Math.pow(pos.y - firstPoint.y, 2));
                
                if (dist < 10 / stageScale) {
                    // Close the path
                    const closedPath = {
                        id: 'path-' + Date.now(),
                        type: 'path',
                        points: [...penPoints, penPoints[0]], // Add first point again to close
                        stroke: brushColor,
                        strokeWidth: penStrokeWidth,
                        closed: true,
                        fill: penFillMode === 'fill' ? brushColor : null,
                        opacity: penOpacity,
                    };
                    
                    setCanvasObjects(prev => [...prev, closedPath]);
                    setPenPoints([]);
                    setPenPath(null);
                    setIsPathClosed(false);
                    return;
                }
            }
            
            // Add new anchor point
            const updatedPoints = [...penPoints, newPoint];
            setPenPoints(updatedPoints);
            
            // Update preview path
            if (updatedPoints.length > 1) {
                setPenPath({
                    points: updatedPoints,
                    stroke: brushColor,
                    strokeWidth: penStrokeWidth,
                });
            }
            return;
        }

        // Shape tools (rectangle, circle, triangle, pentagon, line)
        const shapeTools = ['rectangle', 'circle', 'triangle', 'pentagon', 'line'];
        if (shapeTools.includes(activeTool)) {
            setShapeStart({ x: pos.x, y: pos.y });
            isDrawingRef.current = true;
            setDrawing(true);
            return;
        }

        if (activeTool === 'brush') {
            isDrawingRef.current = true;
            setDrawing(true);
            
            setCurrentShape({
                tool: 'brush',
                points: [pos.x, pos.y],
                stroke: brushColor,
                strokeWidth: brushWidth,
                id: 'temp-' + Date.now(),
            });
        } else if (activeTool === 'eraser') {
            isDrawingRef.current = true;
            setDrawing(true);
            
            setCurrentShape({
                tool: 'eraser',
                points: [pos.x, pos.y],
                eraserWidth: eraserWidth,
                id: 'temp-eraser-' + Date.now(),
            });
        }
    };

    const handleMouseMove = (e) => {
        if (!drawing || !isDrawingRef.current) return;

        const pos = getCanvasPointer(e.target.getStage());
        const clampedX = Math.max(0, Math.min(canvasWidth, pos.x));
        const clampedY = Math.max(0, Math.min(canvasHeight, pos.y));
        
        // Update shape preview untuk semua shape tools
        const shapeTools = ['rectangle', 'circle', 'triangle', 'pentagon', 'line'];
        if (shapeTools.includes(activeTool) && shapeStart) {
            const width = clampedX - shapeStart.x;
            const height = clampedY - shapeStart.y;
            
            setShapePreview({
                type: activeTool,
                x: width >= 0 ? shapeStart.x : clampedX,
                y: height >= 0 ? shapeStart.y : clampedY,
                width: Math.abs(width),
                height: Math.abs(height),
                endX: clampedX, // For line tool
                endY: clampedY, // For line tool
            });
            return;
        }
        
        if (activeTool === 'brush') {
            setCurrentShape(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    points: [...prev.points, clampedX, clampedY]
                };
            });
        } else if (activeTool === 'eraser') {
            setCurrentShape(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    points: [...prev.points, clampedX, clampedY]
                };
            });
        }
    };

    const handleMouseUp = () => {
        // Create shape untuk semua shape tools
        const shapeTools = ['rectangle', 'circle', 'triangle', 'pentagon', 'line'];
        if (shapeTools.includes(activeTool) && shapeStart && shapePreview) {
            const minSize = activeTool === 'line' ? 2 : 5;
            
            if (shapePreview.width > minSize || shapePreview.height > minSize) {
                const newShape = {
                    id: `${activeTool}-${Date.now()}`,
                    type: activeTool,
                    x: shapePreview.x,
                    y: shapePreview.y,
                    width: shapePreview.width,
                    height: shapePreview.height,
                    fill: shapeFillMode === 'fill' ? shapeFillColor : null,
                    stroke: shapeStrokeColor,
                    strokeWidth: shapeStrokeWidth,
                    opacity: shapeOpacity,
                };
                
                // For line tool, save start and end points
                if (activeTool === 'line') {
                    newShape.x1 = shapeStart.x;
                    newShape.y1 = shapeStart.y;
                    newShape.x2 = shapePreview.endX;
                    newShape.y2 = shapePreview.endY;
                }
                
                setCanvasObjects(prev => [...prev, newShape]);
            }
            
            // Reset shape states
            setShapeStart(null);
            setShapePreview(null);
            isDrawingRef.current = false;
            setDrawing(false);
            return;
        }
        
        if (!drawing || !currentShape) {
            isDrawingRef.current = false;
            setDrawing(false);
            setCurrentShape(null);
            return;
        }

        if (activeTool === 'brush') {
            if (currentShape.points && currentShape.points.length >= 4) {
                const finalShape = {
                    ...currentShape,
                    type: 'line',
                    id: 'stroke-' + Date.now(),
                };
                setCanvasObjects(prev => [...prev, finalShape]); // ✅ Ubah setObjects jadi setCanvasObjects
            }
        } else if (activeTool === 'eraser' && currentShape.points) {
            const eraserRadius = eraserWidth / 2;
            
            setCanvasObjects(prev => { // ✅ Ubah setObjects jadi setCanvasObjects
                const newObjects = [];
                
                prev.forEach(obj => {
                    if (obj.type !== 'line') {
                        newObjects.push(obj);
                        return;
                    }
                    
                    const segments = splitLineByEraser(
                        obj.points, 
                        currentShape.points, 
                        eraserRadius
                    );
                    
                    if (segments && segments.length > 0) {
                        segments.forEach((segmentPoints, idx) => {
                            newObjects.push({
                                ...obj,
                                id: obj.id + '-segment-' + idx + '-' + Date.now(),
                                points: segmentPoints
                            });
                        });
                    }
                });
                
                return newObjects;
            });
        }

        isDrawingRef.current = false;
        setDrawing(false);
        setCurrentShape(null);
    };

    // Handle drop motif
    const handleContainerDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!stageRef.current) return;
        
        try {
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const dropX = (x - stagePos.x) / stageScale;
            const dropY = (y - stagePos.y) / stageScale;
            
            const motifDataString = e.dataTransfer.getData('application/json');
            if (!motifDataString) return;
            
            const motifData = JSON.parse(motifDataString);
            
            const motifWidth = 150;
            const motifHeight = 150;
            
            const finalX = dropX - (motifWidth / 2);
            const finalY = dropY - (motifHeight / 2);
            
            const newObject = {
                id: 'motif-' + Date.now(),
                type: 'image',
                name: motifData.name || 'Motif',
                imageUrl: motifData.preview_image_path || motifData.image_url || motifData.file_path,
                x: finalX,
                y: finalY,
                width: motifWidth,
                height: motifHeight,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
            };
            
            setCanvasObjects(prev => [...prev, newObject]); // ✅ Ubah setObjects jadi setCanvasObjects
            setSelectedId(newObject.id);
            setActiveTool('move');
        } catch (error) {
            console.error('Drop error:', error);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
    };

    // Jangan tampilkan loading jika size.width === 0
    // Biarkan canvas render dengan size default dulu
    const shouldShowCanvas = size.width > 0 && size.height > 0;

    return (
        <div className="relative w-full h-full bg-gray-100">
            {!shouldShowCanvas && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-30">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-[#BA682A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Initializing Canvas...</p>
                        <p className="text-gray-400 text-sm mt-2">
                            {canvasWidth} × {canvasHeight} px
                        </p>
                    </div>
                </div>
            )}

            {/* Toolbar */}
            <div
                className="absolute top-4 left-4 z-20 flex gap-2 items-center rounded-lg shadow-lg p-2"
                style={{
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(4px)",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
            >
                {TOOL_LIST.map(tool => {
                    // For shape tools with dropdown
                    if (tool.hasDropdown) {
                        // Find currently selected shape tool
                        const currentShapeTool = tool.subTools.find(st => st.value === activeShape) || tool.subTools[0];
                        const shapeTools = tool.subTools.map(st => st.value);
                        const isActive = shapeTools.includes(activeTool);
                        
                        return (
                            <div key={tool.value} className="relative">
                                <button
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                                        isActive 
                                            ? 'bg-[#BA682A] text-white shadow-md' 
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                    onClick={() => {
                                        setActiveTool(activeShape);
                                        setSelectedId(null);
                                        setShowShapeDropdown(!showShapeDropdown);
                                    }}
                                    title={currentShapeTool.label}
                                >
                                    {currentShapeTool.icon}
                                    <svg 
                                        className={`absolute bottom-0 right-0 w-3 h-3 ${isActive ? 'text-white' : 'text-gray-600'}`} 
                                        fill="currentColor" 
                                        viewBox="0 0 20 20"
                                    >
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                
                                {showShapeDropdown && (
                                    <div 
                                        className="absolute top-12 left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[140px]"
                                        onMouseLeave={() => setShowShapeDropdown(false)}
                                    >
                                        {tool.subTools.map(subTool => (
                                            <button
                                                key={subTool.value}
                                                className={`w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-100 transition-colors ${
                                                    activeShape === subTool.value ? 'bg-orange-50' : ''
                                                }`}
                                                onClick={() => {
                                                    setActiveShape(subTool.value);
                                                    setActiveTool(subTool.value);
                                                    setSelectedId(null);
                                                    setShowShapeDropdown(false);
                                                }}
                                            >
                                                <span className="w-5 h-5 flex items-center justify-center">
                                                    {subTool.icon}
                                                </span>
                                                <span className="text-sm text-gray-700">{subTool.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }
                    
                    // Regular tools without dropdown
                    return (
                        <button
                            key={tool.value}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                                activeTool === tool.value 
                                    ? 'bg-[#BA682A] text-white shadow-md' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => {
                                setActiveTool(tool.value);
                                if (tool.value !== 'move') {
                                    setSelectedId(null);
                                }
                                // Reset pen tool state when switching away
                                if (tool.value !== 'pen' && penPoints.length > 0) {
                                    setPenPoints([]);
                                    setPenPath(null);
                                }
                            }}
                            title={tool.label}
                        >
                            {tool.icon}
                        </button>
                    );
                })}
                
                {(activeTool === 'brush') && (
                    <>
                        <div className="w-px h-8 bg-gray-300 mx-1"></div>
                        <input
                            type="color"
                            value={brushColor}
                            onChange={e => setBrushColor(e.target.value)}
                            className="w-8 h-8 border-2 border-gray-300 rounded cursor-pointer"
                            title="Warna"
                        />
                        <input
                            type="range"
                            min={1}
                            max={40}
                            value={brushWidth}
                            onChange={e => setBrushWidth(Number(e.target.value))}
                            className="w-24"
                            title="Ketebalan Brush"
                        />
                        <span className="text-xs font-medium text-gray-700 min-w-[35px]">{brushWidth}px</span>
                    </>
                )}
                
                {activeTool === 'pen' && (
                    <>
                        <div className="w-px h-8 bg-gray-300 mx-1"></div>
                        <input
                            type="color"
                            value={brushColor}
                            onChange={e => setBrushColor(e.target.value)}
                            className="w-8 h-8 border-2 border-gray-300 rounded cursor-pointer"
                            title="Warna Path"
                        />
                        <input
                            type="range"
                            min={1}
                            max={10}
                            value={penStrokeWidth}
                            onChange={e => setPenStrokeWidth(Number(e.target.value))}
                            className="w-24"
                            title="Ketebalan Path"
                        />
                        <span className="text-xs font-medium text-gray-700 min-w-[35px]">{penStrokeWidth}px</span>
                        
                        {/* Opacity Control */}
                        <div className="w-px h-8 bg-gray-300 mx-1"></div>
                        <label className="text-xs text-gray-600">Opacity:</label>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={penOpacity * 100}
                            onChange={e => setPenOpacity(Number(e.target.value) / 100)}
                            className="w-20"
                            title="Transparansi Path"
                        />
                        <span className="text-xs font-medium text-gray-700 min-w-[30px]">{Math.round(penOpacity * 100)}%</span>
                        
                        {/* Fill Mode Toggle */}
                        <div className="w-px h-8 bg-gray-300 mx-1"></div>
                        <button
                            onClick={() => setPenFillMode(penFillMode === 'fill' ? 'outline' : 'fill')}
                            className={`px-3 py-1 text-xs rounded transition ${
                                penFillMode === 'fill' 
                                    ? 'bg-orange-500 text-white hover:bg-orange-600' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            title={penFillMode === 'fill' ? 'Mode: Isi Warna' : 'Mode: Outline Saja'}
                        >
                            {penFillMode === 'fill' ? '■ Fill' : '□ Outline'}
                        </button>
                        
                        {penPoints.length > 1 && (
                            <>
                                <div className="w-px h-8 bg-gray-300 mx-1"></div>
                                <button
                                    onClick={() => {
                                        // Finish path without closing
                                        if (penPoints.length > 1) {
                                            const openPath = {
                                                id: 'path-' + Date.now(),
                                                type: 'path',
                                                points: penPoints,
                                                stroke: brushColor,
                                                strokeWidth: penStrokeWidth,
                                                closed: false,
                                                opacity: penOpacity,
                                            };
                                            setCanvasObjects(prev => [...prev, openPath]);
                                            setPenPoints([]);
                                            setPenPath(null);
                                        }
                                    }}
                                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition"
                                    title="Finish Path (Open)"
                                >
                                    Selesai
                                </button>
                                <button
                                    onClick={() => {
                                        // Cancel current path
                                        setPenPoints([]);
                                        setPenPath(null);
                                    }}
                                    className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                                    title="Cancel Path"
                                >
                                    Batal
                                </button>
                            </>
                        )}
                    </>
                )}
                
                {activeTool === 'rectangle' && (
                    <>
                        <div className="w-px h-8 bg-gray-300 mx-1"></div>
                        
                        {/* Fill Color */}
                        <label className="text-xs text-gray-600">Fill:</label>
                        <input
                            type="color"
                            value={rectangleFillColor}
                            onChange={e => setRectangleFillColor(e.target.value)}
                            className="w-8 h-8 border-2 border-gray-300 rounded cursor-pointer"
                            title="Warna Isi"
                        />
                        
                        {/* Stroke Color */}
                        <label className="text-xs text-gray-600">Stroke:</label>
                        <input
                            type="color"
                            value={rectangleStrokeColor}
                            onChange={e => setRectangleStrokeColor(e.target.value)}
                            className="w-8 h-8 border-2 border-gray-300 rounded cursor-pointer"
                            title="Warna Border"
                        />
                        
                        {/* Stroke Width */}
                        <input
                            type="range"
                            min={0}
                            max={10}
                            value={rectangleStrokeWidth}
                            onChange={e => setRectangleStrokeWidth(Number(e.target.value))}
                            className="w-20"
                            title="Ketebalan Border"
                        />
                        <span className="text-xs font-medium text-gray-700 min-w-[30px]">{rectangleStrokeWidth}px</span>
                        
                        {/* Opacity */}
                        <div className="w-px h-8 bg-gray-300 mx-1"></div>
                        <label className="text-xs text-gray-600">Opacity:</label>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={rectangleOpacity * 100}
                            onChange={e => setRectangleOpacity(Number(e.target.value) / 100)}
                            className="w-20"
                            title="Transparansi"
                        />
                        <span className="text-xs font-medium text-gray-700 min-w-[30px]">{Math.round(rectangleOpacity * 100)}%</span>
                        
                        {/* Fill Mode Toggle */}
                        <div className="w-px h-8 bg-gray-300 mx-1"></div>
                        <button
                            onClick={() => setRectangleFillMode(rectangleFillMode === 'fill' ? 'outline' : 'fill')}
                            className={`px-3 py-1 text-xs rounded transition ${
                                rectangleFillMode === 'fill' 
                                    ? 'bg-orange-500 text-white hover:bg-orange-600' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            title={rectangleFillMode === 'fill' ? 'Mode: Isi Warna' : 'Mode: Outline Saja'}
                        >
                            {rectangleFillMode === 'fill' ? '■ Fill' : '□ Outline'}
                        </button>
                    </>
                )}
                
                {activeTool === 'eraser' && (
                    <>
                        <div className="w-px h-8 bg-gray-300 mx-1"></div>
                        <input
                            type="range"
                            min={5}
                            max={60}
                            value={eraserWidth}
                            onChange={e => setEraserWidth(Number(e.target.value))}
                            className="w-24"
                            title="Ketebalan Eraser"
                        />
                        <span className="text-xs font-medium text-gray-700 min-w-[35px]">{eraserWidth}px</span>
                    </>
                )}
            </div>

            {/* Zoom Control */}
            <div className="absolute bottom-4 right-4 z-20 flex gap-2 items-center bg-white rounded-lg shadow-lg p-2 border">
                <button
                    onClick={() => {
                        const newScale = Math.max(0.1, stageScale - 0.1);
                        setStageScale(newScale);
                        const newStageX = (size.width - canvasWidth * newScale) / 2;
                        const newStageY = (size.height - canvasHeight * newScale) / 2;
                        setStagePos({ x: newStageX, y: newStageY });
                    }}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition"
                    title="Zoom Out"
                >
                    -
                </button>
                <span className="px-2 text-sm font-medium min-w-[60px] text-center">
                    {Math.round(stageScale * 100)}%
                </span>
                <button
                    onClick={() => {
                        const newScale = Math.min(4, stageScale + 0.1);
                        setStageScale(newScale);
                        const newStageX = (size.width - canvasWidth * newScale) / 2;
                        const newStageY = (size.height - canvasHeight * newScale) / 2;
                        setStagePos({ x: newStageX, y: newStageY });
                    }}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition"
                    title="Zoom In"
                >
                    +
                </button>
                <button
                    onClick={() => {
                        setStageScale(1);
                        const newStageX = (size.width - canvasWidth) / 2;
                        const newStageY = (size.height - canvasHeight) / 2;
                        setStagePos({ x: newStageX, y: newStageY });
                    }}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition"
                    title="Reset Zoom"
                >
                    Reset
                </button>
            </div>

            {/* Canvas Container - SELALU RENDER */}
            <div 
                ref={containerRef}
                className={
                    "w-full h-full " +
                    (activeTool === 'brush' ? "cursor-brush" :
                     activeTool === 'eraser' ? "cursor-eraser" : 
                     activeTool === 'pen' ? "cursor-pen" :
                     activeTool === 'rectangle' ? "cursor-rectangle" :
                     activeTool === 'circle' ? "cursor-circle" :
                     activeTool === 'triangle' ? "cursor-triangle" :
                     activeTool === 'pentagon' ? "cursor-pentagon" :
                     activeTool === 'line' ? "cursor-line" :
                     activeTool === 'move' ? "cursor-move-tool" :
                     "cursor-canting")
                }
                onDrop={handleContainerDrop}
                onDragOver={handleDragOver}
            >
                {size.width > 0 && size.height > 0 && (
                    <Stage
                        width={size.width}
                        height={size.height}
                        onMouseDown={checkDeselect}
                        onTouchStart={checkDeselect}
                        ref={stageRef}
                        scaleX={stageScale}
                        scaleY={stageScale}
                        x={stagePos.x}
                        y={stagePos.y}
                        onWheel={handleWheel}
                        draggable={false}
                    >
                        <Layer ref={layerRef}>
                            <Rect
                                x={0}
                                y={0}
                                width={canvasWidth}
                                height={canvasHeight}
                                fill="white"
                                shadowColor="black"
                                shadowBlur={20}
                                shadowOpacity={0.3}
                                shadowOffsetX={0}
                                shadowOffsetY={0}
                                listening={true}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            />
                            
                            {showGrid && (
                                <>
                                    {Array.from({ length: Math.ceil(canvasHeight / gridSize) + 1 }).map((_, i) => (
                                        <Line
                                            key={`h-${i}`}
                                            points={[0, i * gridSize, canvasWidth, i * gridSize]}
                                            stroke="#e5e7eb"
                                            strokeWidth={1}
                                            listening={false}
                                        />
                                    ))}
                                    {Array.from({ length: Math.ceil(canvasWidth / gridSize) + 1 }).map((_, i) => (
                                        <Line
                                            key={`v-${i}`}
                                            points={[i * gridSize, 0, i * gridSize, canvasHeight]}
                                            stroke="#e5e7eb"
                                            strokeWidth={1}
                                            listening={false}
                                        />
                                    ))}
                                </>
                            )}

                            <Group
                                ref={clipGroupRef}
                                clipFunc={(ctx) => {
                                    ctx.rect(0, 0, canvasWidth, canvasHeight);
                                }}
                            >
                                {canvasObjects.map((obj) => { // ✅ Ubah objects jadi canvasObjects
                                    if (obj.type === 'line') {
                                        return (
                                            <Line
                                                key={obj.id}
                                                points={obj.points}
                                                stroke={obj.stroke}
                                                strokeWidth={obj.strokeWidth}
                                                tension={0.5}
                                                lineCap="round"
                                                lineJoin="round"
                                                listening={false}
                                            />
                                        );
                                    }
                                    
                                    // Render pen tool path
                                    if (obj.type === 'path') {
                                        const flatPoints = obj.points.flatMap(p => [p.x, p.y]);
                                        return (
                                            <React.Fragment key={obj.id}>
                                                <Line
                                                    points={flatPoints}
                                                    stroke={obj.stroke}
                                                    strokeWidth={obj.strokeWidth}
                                                    fill={obj.closed ? obj.fill : undefined}
                                                    closed={obj.closed}
                                                    lineCap="round"
                                                    lineJoin="round"
                                                    opacity={obj.opacity || 1}
                                                    listening={false}
                                                />
                                            </React.Fragment>
                                        );
                                    }
                                    
                                    // Render shapes (rectangle, circle, triangle, pentagon, line)
                                    if (obj.type === 'rectangle') {
                                        return (
                                            <Rect
                                                key={obj.id}
                                                x={obj.x}
                                                y={obj.y}
                                                width={obj.width}
                                                height={obj.height}
                                                fill={obj.fill}
                                                stroke={obj.stroke}
                                                strokeWidth={obj.strokeWidth}
                                                opacity={obj.opacity || 1}
                                                listening={false}
                                            />
                                        );
                                    }
                                    
                                    if (obj.type === 'circle') {
                                        return (
                                            <Circle
                                                key={obj.id}
                                                x={obj.x + obj.width / 2}
                                                y={obj.y + obj.height / 2}
                                                radiusX={obj.width / 2}
                                                radiusY={obj.height / 2}
                                                fill={obj.fill}
                                                stroke={obj.stroke}
                                                strokeWidth={obj.strokeWidth}
                                                opacity={obj.opacity || 1}
                                                listening={false}
                                            />
                                        );
                                    }
                                    
                                    if (obj.type === 'triangle') {
                                        const centerX = obj.x + obj.width / 2;
                                        const points = [
                                            centerX, obj.y, // top
                                            obj.x + obj.width, obj.y + obj.height, // bottom right
                                            obj.x, obj.y + obj.height // bottom left
                                        ];
                                        return (
                                            <Line
                                                key={obj.id}
                                                points={points}
                                                closed={true}
                                                fill={obj.fill}
                                                stroke={obj.stroke}
                                                strokeWidth={obj.strokeWidth}
                                                opacity={obj.opacity || 1}
                                                lineJoin="round"
                                                listening={false}
                                            />
                                        );
                                    }
                                    
                                    if (obj.type === 'pentagon') {
                                        const cx = obj.x + obj.width / 2;
                                        const cy = obj.y + obj.height / 2;
                                        const rx = obj.width / 2;
                                        const ry = obj.height / 2;
                                        const points = [];
                                        for (let i = 0; i < 5; i++) {
                                            const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
                                            points.push(cx + rx * Math.cos(angle));
                                            points.push(cy + ry * Math.sin(angle));
                                        }
                                        return (
                                            <Line
                                                key={obj.id}
                                                points={points}
                                                closed={true}
                                                fill={obj.fill}
                                                stroke={obj.stroke}
                                                strokeWidth={obj.strokeWidth}
                                                opacity={obj.opacity || 1}
                                                lineJoin="round"
                                                listening={false}
                                            />
                                        );
                                    }
                                    
                                    if (obj.type === 'line') {
                                        return (
                                            <Line
                                                key={obj.id}
                                                points={[obj.x1, obj.y1, obj.x2, obj.y2]}
                                                stroke={obj.stroke}
                                                strokeWidth={obj.strokeWidth}
                                                opacity={obj.opacity || 1}
                                                lineCap="round"
                                                listening={false}
                                            />
                                        );
                                    }
                                    
                                    if (obj.type === 'image') {
                                        return (
                                            <MotifImage
                                                key={obj.id}
                                                shapeProps={obj}
                                                isSelected={obj.id === selectedId}
                                                onSelect={() => {
                                                    if (activeTool === 'move') {
                                                        setSelectedId(obj.id);
                                                    }
                                                }}
                                                onChange={(newAttrs) => {
                                                    setCanvasObjects((prev) => // ✅ Ubah setObjects jadi setCanvasObjects
                                                        prev.map((item) =>
                                                            item.id === obj.id ? newAttrs : item
                                                        )
                                                    );
                                                }}
                                                trRef={trRef}
                                                activeTool={activeTool}
                                            />
                                        );
                                    }
                                    
                                    return null;
                                })}
                                
                                {drawing && currentShape && currentShape.points && currentShape.points.length >= 2 && (
                                    <>
                                        {activeTool === 'brush' && (
                                            <Line
                                                points={currentShape.points}
                                                stroke={currentShape.stroke}
                                                strokeWidth={currentShape.strokeWidth}
                                                tension={0.5}
                                                lineCap="round"
                                                lineJoin="round"
                                                listening={false}
                                            />
                                        )}
                                        {activeTool === 'eraser' && (
                                            <Line
                                                points={currentShape.points}
                                                stroke="rgba(255,0,0,0.3)"
                                                strokeWidth={currentShape.eraserWidth}
                                                tension={0}
                                                lineCap="round"
                                                lineJoin="round"
                                                listening={false}
                                            />
                                        )}
                                    </>
                                )}
                            </Group>
                            
                            {/* Pen Tool Preview Path and Anchor Points */}
                            {activeTool === 'pen' && penPoints.length > 0 && (
                                <>
                                    {/* Preview Path */}
                                    {penPath && penPath.points.length > 1 && (
                                        <Line
                                            points={penPath.points.flatMap(p => [p.x, p.y])}
                                            stroke={penPath.stroke}
                                            strokeWidth={penPath.strokeWidth}
                                            dash={[5, 5]}
                                            lineCap="round"
                                            lineJoin="round"
                                            listening={false}
                                        />
                                    )}
                                    
                                    {/* Anchor Points */}
                                    {penPoints.map((point, index) => (
                                        <React.Fragment key={`anchor-${index}`}>
                                            {/* Anchor point circle */}
                                            <Circle
                                                x={point.x}
                                                y={point.y}
                                                radius={4}
                                                fill={index === 0 ? '#3B82F6' : '#FFFFFF'}
                                                stroke="#3B82F6"
                                                strokeWidth={2}
                                                listening={false}
                                            />
                                        </React.Fragment>
                                    ))}
                                    
                                    {/* Close path indicator (circle around first point) */}
                                    {penPoints.length > 2 && (
                                        <Circle
                                            x={penPoints[0].x}
                                            y={penPoints[0].y}
                                            radius={8}
                                            stroke="#3B82F6"
                                            strokeWidth={2}
                                            dash={[3, 3]}
                                            listening={false}
                                        />
                                    )}
                                </>
                            )}
                            
                            {/* Shape Preview untuk semua shape tools */}
                            {shapePreview && (
                                <>
                                    {shapePreview.type === 'rectangle' && (
                                        <Rect
                                            x={shapePreview.x}
                                            y={shapePreview.y}
                                            width={shapePreview.width}
                                            height={shapePreview.height}
                                            fill={shapeFillMode === 'fill' ? shapeFillColor : null}
                                            stroke={shapeStrokeColor}
                                            strokeWidth={shapeStrokeWidth}
                                            opacity={shapeOpacity * 0.7}
                                            dash={[5, 5]}
                                            listening={false}
                                        />
                                    )}
                                    
                                    {shapePreview.type === 'circle' && (
                                        <Circle
                                            x={shapePreview.x + shapePreview.width / 2}
                                            y={shapePreview.y + shapePreview.height / 2}
                                            radiusX={shapePreview.width / 2}
                                            radiusY={shapePreview.height / 2}
                                            fill={shapeFillMode === 'fill' ? shapeFillColor : null}
                                            stroke={shapeStrokeColor}
                                            strokeWidth={shapeStrokeWidth}
                                            opacity={shapeOpacity * 0.7}
                                            dash={[5, 5]}
                                            listening={false}
                                        />
                                    )}
                                    
                                    {shapePreview.type === 'triangle' && (
                                        <Line
                                            points={[
                                                shapePreview.x + shapePreview.width / 2, shapePreview.y,
                                                shapePreview.x + shapePreview.width, shapePreview.y + shapePreview.height,
                                                shapePreview.x, shapePreview.y + shapePreview.height
                                            ]}
                                            closed={true}
                                            fill={shapeFillMode === 'fill' ? shapeFillColor : null}
                                            stroke={shapeStrokeColor}
                                            strokeWidth={shapeStrokeWidth}
                                            opacity={shapeOpacity * 0.7}
                                            dash={[5, 5]}
                                            lineJoin="round"
                                            listening={false}
                                        />
                                    )}
                                    
                                    {shapePreview.type === 'pentagon' && (() => {
                                        const cx = shapePreview.x + shapePreview.width / 2;
                                        const cy = shapePreview.y + shapePreview.height / 2;
                                        const rx = shapePreview.width / 2;
                                        const ry = shapePreview.height / 2;
                                        const points = [];
                                        for (let i = 0; i < 5; i++) {
                                            const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
                                            points.push(cx + rx * Math.cos(angle));
                                            points.push(cy + ry * Math.sin(angle));
                                        }
                                        return (
                                            <Line
                                                points={points}
                                                closed={true}
                                                fill={shapeFillMode === 'fill' ? shapeFillColor : null}
                                                stroke={shapeStrokeColor}
                                                strokeWidth={shapeStrokeWidth}
                                                opacity={shapeOpacity * 0.7}
                                                dash={[5, 5]}
                                                lineJoin="round"
                                                listening={false}
                                            />
                                        );
                                    })()}
                                    
                                    {shapePreview.type === 'line' && (
                                        <Line
                                            points={[shapeStart.x, shapeStart.y, shapePreview.endX, shapePreview.endY]}
                                            stroke={shapeStrokeColor}
                                            strokeWidth={shapeStrokeWidth}
                                            opacity={shapeOpacity * 0.7}
                                            dash={[5, 5]}
                                            lineCap="round"
                                            listening={false}
                                        />
                                    )}
                                </>
                            )}
                            
                            {activeTool === 'move' && (
                                <Transformer 
                                    ref={trRef}
                                    rotateEnabled={true}
                                    keepRatio={false}
                                    enabledAnchors={[
                                        'top-left',
                                        'top-right',
                                        'bottom-left',
                                        'bottom-right',
                                        'top-center',
                                        'middle-right',
                                        'bottom-center',
                                        'middle-left',
                                    ]}
                                    borderStroke="#4A90E2"
                                    borderStrokeWidth={2}
                                    anchorSize={10}
                                    anchorStroke="#4A90E2"
                                    anchorFill="white"
                                    anchorStrokeWidth={2}
                                    anchorCornerRadius={50}
                                />
                            )}
                        </Layer>
                    </Stage>
                )}
            </div>
        </div>
    );
}