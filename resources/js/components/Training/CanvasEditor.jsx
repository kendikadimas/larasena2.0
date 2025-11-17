import { useRef, useEffect, useState } from 'react';
import { Brush, Eraser, Palette, Undo2, Redo2, Download, Trash2, ZoomIn, ZoomOut, Grid3x3, Save, Image as ImageIcon } from 'lucide-react';

export default function CanvasEditor({ canvasData, availableMotifs, onSave, initialCanvasWork }) {
    const canvasRef = useRef(null);
    const [ctx, setCtx] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentTool, setCurrentTool] = useState('brush');
    const [brushSize, setBrushSize] = useState(5);
    const [brushColor, setBrushColor] = useState('#000000');
    const [brushOpacity, setBrushOpacity] = useState(1);
    const [history, setHistory] = useState([]);
    const [historyStep, setHistoryStep] = useState(-1);
    const [showGrid, setShowGrid] = useState(canvasData?.grid?.enabled || false);
    const [zoom, setZoom] = useState(1);
    const [draggedMotif, setDraggedMotif] = useState(null);

    // Batik color palette
    const batikColors = [
        '#000000', // Black
        '#8B4513', // Saddle Brown
        '#D2691E', // Chocolate
        '#BA682A', // Larasena Brown
        '#F4A460', // Sandy Brown
        '#FFFFE0', // Light Yellow
        '#FFFFFF', // White
        '#4A90E2', // Blue
        '#E74C3C', // Red
        '#2ECC71', // Green
    ];

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        setCtx(context);

        // Set canvas size
        const size = canvasData?.canvas_size || { width: 800, height: 600 };
        canvas.width = size.width;
        canvas.height = size.height;

        // Set background
        context.fillStyle = canvasData?.background || '#FFFFFF';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Load initial work if exists
        if (initialCanvasWork?.canvas_state) {
            const img = new Image();
            img.onload = () => {
                context.drawImage(img, 0, 0);
                saveToHistory();
            };
            img.src = initialCanvasWork.canvas_state;
        } else {
            saveToHistory();
        }

        // Draw grid if enabled
        if (showGrid) {
            drawGrid(context, canvas);
        }
    }, []);

    const drawGrid = (context, canvas) => {
        const gridSize = canvasData?.grid?.size || 50;
        const gridColor = canvasData?.grid?.color || '#CCCCCC';
        
        context.save();
        context.strokeStyle = gridColor;
        context.lineWidth = 0.5;
        context.globalAlpha = 0.3;

        // Vertical lines
        for (let x = 0; x <= canvas.width; x += gridSize) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, canvas.height);
            context.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= canvas.height; y += gridSize) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(canvas.width, y);
            context.stroke();
        }

        context.restore();
    };

    const saveToHistory = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dataUrl = canvas.toDataURL();
        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(dataUrl);
        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);
    };

    const startDrawing = (e) => {
        if (!ctx) return;
        setIsDrawing(true);

        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;

        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e) => {
        if (!isDrawing || !ctx) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;

        ctx.globalAlpha = brushOpacity;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (currentTool === 'brush') {
            ctx.strokeStyle = brushColor;
            ctx.globalCompositeOperation = 'source-over';
        } else if (currentTool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
        }

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            ctx?.closePath();
            saveToHistory();
        }
    };

    const undo = () => {
        if (historyStep > 0) {
            const newStep = historyStep - 1;
            setHistoryStep(newStep);
            loadFromHistory(newStep);
        }
    };

    const redo = () => {
        if (historyStep < history.length - 1) {
            const newStep = historyStep + 1;
            setHistoryStep(newStep);
            loadFromHistory(newStep);
        }
    };

    const loadFromHistory = (step) => {
        const canvas = canvasRef.current;
        if (!canvas || !ctx) return;

        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = history[step];
    };

    const clearCanvas = () => {
        if (!ctx || !canvasRef.current) return;
        
        if (confirm('Yakin ingin menghapus semua gambar?')) {
            const canvas = canvasRef.current;
            ctx.fillStyle = canvasData?.background || '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            if (showGrid) drawGrid(ctx, canvas);
            saveToHistory();
        }
    };

    const downloadCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = 'batik-artwork.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const canvasState = canvas.toDataURL();
        onSave({ canvas_state: canvasState });
    };

    const toggleGrid = () => {
        setShowGrid(!showGrid);
        if (!showGrid) {
            drawGrid(ctx, canvasRef.current);
        } else {
            loadFromHistory(historyStep);
        }
    };

    // Handle motif drag and drop
    const handleMotifDragStart = (motif) => {
        setDraggedMotif(motif);
    };

    const handleCanvasDrop = (e) => {
        e.preventDefault();
        if (!draggedMotif || !ctx) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;

        // Load and draw motif image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            // Draw with reasonable size (max 200px width/height)
            const maxSize = 200;
            let width = img.width;
            let height = img.height;
            
            if (width > maxSize || height > maxSize) {
                const ratio = Math.min(maxSize / width, maxSize / height);
                width *= ratio;
                height *= ratio;
            }

            ctx.drawImage(img, x - width/2, y - height/2, width, height);
            saveToHistory();
            setDraggedMotif(null);
        };
        img.src = draggedMotif.image_url || draggedMotif.file_path;
    };

    const handleCanvasDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-4 items-center justify-between border-b pb-4">
                {/* Tools */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentTool('brush')}
                        className={`p-3 rounded-xl transition-all ${
                            currentTool === 'brush'
                                ? 'bg-[#BA682A] text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title="Brush"
                    >
                        <Brush className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setCurrentTool('eraser')}
                        className={`p-3 rounded-xl transition-all ${
                            currentTool === 'eraser'
                                ? 'bg-[#BA682A] text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title="Eraser"
                    >
                        <Eraser className="w-5 h-5" />
                    </button>
                    <button
                        onClick={toggleGrid}
                        className={`p-3 rounded-xl transition-all ${
                            showGrid
                                ? 'bg-[#BA682A] text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title="Grid"
                    >
                        <Grid3x3 className="w-5 h-5" />
                    </button>
                </div>

                {/* History */}
                <div className="flex gap-2">
                    <button
                        onClick={undo}
                        disabled={historyStep <= 0}
                        className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        title="Undo"
                    >
                        <Undo2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={redo}
                        disabled={historyStep >= history.length - 1}
                        className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        title="Redo"
                    >
                        <Redo2 className="w-5 h-5" />
                    </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={clearCanvas}
                        className="p-3 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                        title="Clear Canvas"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={downloadCanvas}
                        className="p-3 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all"
                        title="Download"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#BA682A] to-[#D2691E] text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                        title="Save Progress"
                    >
                        <Save className="w-5 h-5" />
                        Simpan
                    </button>
                </div>
            </div>

            {/* Brush Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-4">
                {/* Brush Size */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Ukuran: {brushSize}px
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="50"
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="w-full accent-[#BA682A]"
                    />
                </div>

                {/* Brush Opacity */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Opacity: {Math.round(brushOpacity * 100)}%
                    </label>
                    <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={brushOpacity}
                        onChange={(e) => setBrushOpacity(Number(e.target.value))}
                        className="w-full accent-[#BA682A]"
                    />
                </div>

                {/* Color Palette */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Warna
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {batikColors.map((color) => (
                            <button
                                key={color}
                                onClick={() => setBrushColor(color)}
                                className={`w-8 h-8 rounded-lg transition-all ${
                                    brushColor === color ? 'ring-4 ring-[#BA682A] scale-110' : 'hover:scale-105'
                                }`}
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                        <input
                            type="color"
                            value={brushColor}
                            onChange={(e) => setBrushColor(e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer"
                            title="Custom Color"
                        />
                    </div>
                </div>
            </div>

            {/* Canvas */}
            <div className="relative bg-gray-100 rounded-xl overflow-hidden" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onDrop={handleCanvasDrop}
                    onDragOver={handleCanvasDragOver}
                    className="cursor-crosshair bg-white shadow-inner"
                    style={{ display: 'block', maxWidth: '100%' }}
                />
            </div>

            {/* Available Motifs Panel */}
            {availableMotifs && availableMotifs.length > 0 && (
                <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-3">
                        <ImageIcon className="w-5 h-5 text-[#BA682A]" />
                        <h3 className="font-semibold text-gray-800">Motif Tersedia</h3>
                        <span className="text-sm text-gray-500">
                            (Drag & drop ke canvas)
                        </span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {availableMotifs.map((motif) => (
                            <div
                                key={motif.id}
                                draggable
                                onDragStart={() => handleMotifDragStart(motif)}
                                className="relative group cursor-move rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#BA682A] transition-all hover:shadow-md"
                                title={`Drag ${motif.name} ke canvas`}
                            >
                                <div className="aspect-square bg-white">
                                    {motif.image_url ? (
                                        <img
                                            src={motif.image_url}
                                            alt={motif.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <ImageIcon className="w-8 h-8 text-gray-300" />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                    <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium">
                                        Drag
                                    </span>
                                </div>
                                <div className="p-1 bg-white">
                                    <div className="text-xs font-medium text-gray-800 truncate text-center">
                                        {motif.name}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 italic">
                        💡 Tip: Klik dan drag motif ke canvas untuk menambahkannya ke desain Anda
                    </p>
                </div>
            )}

            {/* Instructions */}
            {canvasData?.instructions && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Instruksi
                    </h4>
                    <p className="text-sm text-amber-800">{canvasData.instructions}</p>
                </div>
            )}
        </div>
    );
}
