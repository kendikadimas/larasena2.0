import React from 'react';
import { Image as ImageIcon, Brush as BrushIcon, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, ChevronsUp } from 'lucide-react';

export default function LayerPanel({ objects = [], selectedId, onSelect, onClear, onMoveUp, onMoveDown, onBringToFront }) {
    if (!objects || objects.length === 0) {
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">Layers</h3>
                </div>
                <div className="text-center py-8 text-gray-400 text-sm">
                    Belum ada layer
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">Layers ({objects.length})</h3>
                <button 
                    onClick={onClear}
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                    title="Clear All"
                >
                    <Trash2 size={14} />
                    Clear
                </button>
            </div>
            
            <div className="space-y-1 max-h-64 overflow-y-auto">
                {objects.map((obj, index) => {
                    // Safely get dimensions dengan fallback
                    const width = typeof obj.width === 'number' && !isNaN(obj.width) ? Math.round(obj.width) : 0;
                    const height = typeof obj.height === 'number' && !isNaN(obj.height) ? Math.round(obj.height) : 0;
                    
                    return (
                        <div 
                            key={obj.id} 
                            className={`flex items-center gap-2 px-3 py-2 rounded transition ${
                                selectedId === obj.id 
                                    ? 'bg-[#F5E7D8] border-l-2 border-[#BA682A]' 
                                    : 'bg-white hover:bg-gray-50'
                            }`}
                        >
                            {/* Icon berdasarkan tipe */}
                            <div onClick={() => onSelect(obj.id)} className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer">
                                {obj.tool === 'brush' || obj.tool === 'pencil' ? (
                                    <BrushIcon className="w-4 h-4 text-[#BA682A] flex-shrink-0" />
                                ) : obj.type === 'path' ? (
                                    <svg className="w-4 h-4 text-[#BA682A] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M12 4L18 10L12 22L6 10L12 4Z" strokeWidth="2"/>
                                    </svg>
                                ) : obj.type === 'rectangle' ? (
                                    <svg className="w-4 h-4 text-[#BA682A] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <rect x="4" y="6" width="16" height="12" rx="1" strokeWidth="2"/>
                                    </svg>
                                ) : (
                                    <ImageIcon className="w-4 h-4 text-[#BA682A] flex-shrink-0" />
                                )}
                                
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-700 truncate">
                                        {obj.name || `Layer ${index + 1}`}
                                    </div>
                                    {/* Tampilkan dimensi hanya untuk image, bukan brush strokes */}
                                    {obj.type === 'image' && width > 0 && height > 0 && (
                                        <div className="text-xs text-gray-400">
                                            {width} × {height} px
                                        </div>
                                    )}
                                    {(obj.tool === 'brush' || obj.tool === 'pencil') && (
                                        <div className="text-xs text-gray-400">
                                            Brush Stroke
                                        </div>
                                    )}
                                    {obj.type === 'path' && (
                                        <div className="text-xs text-gray-400">
                                            {obj.closed ? 'Shape' : 'Path'} • {obj.opacity ? Math.round(obj.opacity * 100) : 100}%
                                        </div>
                                    )}
                                    {obj.type === 'rectangle' && (
                                        <div className="text-xs text-gray-400">
                                            Rectangle • {obj.opacity ? Math.round(obj.opacity * 100) : 100}%
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Layer Controls */}
                            <div className="flex gap-1 flex-shrink-0">
                                <button
                                    onClick={() => onBringToFront && onBringToFront(obj.id)}
                                    className="p-1 hover:bg-orange-100 rounded transition"
                                    title="Pindah ke Paling Atas"
                                >
                                    <ChevronsUp size={14} className="text-gray-600" />
                                </button>
                                <button
                                    onClick={() => onMoveUp && onMoveUp(obj.id)}
                                    disabled={index === objects.length - 1}
                                    className="p-1 hover:bg-gray-200 rounded transition disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Pindah Atas"
                                >
                                    <ChevronUp size={14} className="text-gray-600" />
                                </button>
                                <button
                                    onClick={() => onMoveDown && onMoveDown(obj.id)}
                                    disabled={index === 0}
                                    className="p-1 hover:bg-gray-200 rounded transition disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Pindah Bawah"
                                >
                                    <ChevronDown size={14} className="text-gray-600" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}