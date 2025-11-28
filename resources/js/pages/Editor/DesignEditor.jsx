import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Download, Menu, X, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Save, Eye, ChevronDown, Undo, Redo, Shirt, ImagePlus } from 'lucide-react';
import MockupViewer3D from '@/components/Editor/MockupViewer3D';
import MotifLibrary from '@/components/Editor/MotifLibrary';
import CanvasArea from '@/components/Editor/CanvasArea';
import PropertiesToolbar from '@/components/Editor/PropertiesToolbar';
import LayerPanel from '@/components/Editor/LayerPanel';
import { nanoid } from 'nanoid';
import { debounce } from 'lodash';

function downloadURI(uri, name) {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export default function DesignEditor({ initialDesign }) {
    const { url } = usePage();
    
    // UI State
    const [showLeftPanel, setShowLeftPanel] = useState(true);
    const [showRightPanel, setShowRightPanel] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    
    // ✅ FIX: Parse initialDesign dengan benar
    useEffect(() => {
        console.log('========== DEBUG INITIAL DESIGN ==========');
        console.log('Raw initialDesign:', initialDesign);
        console.log('Type:', typeof initialDesign);
        console.log('canvas_width:', initialDesign?.canvas_width);
        console.log('canvas_height:', initialDesign?.canvas_height);
        console.log('==========================================');
    }, [initialDesign]);

    // Detect mobile screen
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setShowLeftPanel(false);
                setShowRightPanel(false);
            }
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const urlParams = new URLSearchParams(url.split('?')[1]);
    
    // ✅ FIX: Responsive canvas size untuk mobile
    const defaultSize = (() => {
        const isMobileView = window.innerWidth < 768;
        
        // Mode EDIT - Ambil dari initialDesign
        if (initialDesign && initialDesign.id) {
            let width = parseInt(initialDesign.canvas_width) || 800;
            let height = parseInt(initialDesign.canvas_height) || 600;
            
            // Scale down untuk mobile
            if (isMobileView && width > 600) {
                const scale = 600 / width;
                width = 600;
                height = Math.round(height * scale);
            }
            
            console.log('🔵 EDIT MODE - Loading existing design');
            console.log('Design ID:', initialDesign.id);
            console.log('Canvas Width (DB):', initialDesign.canvas_width, '→', width);
            console.log('Canvas Height (DB):', initialDesign.canvas_height, '→', height);
            
            return { width, height };
        }
        
        // Mode CREATE - Ambil dari URL params
        let width = parseInt(urlParams.get('width')) || 800;
        let height = parseInt(urlParams.get('height')) || 600;
        
        // Scale down untuk mobile
        if (isMobileView && width > 600) {
            const scale = 600 / width;
            width = 600;
            height = Math.round(height * scale);
        }
        
        console.log('🟢 CREATE MODE - New design');
        console.log('Canvas Width (URL):', urlParams.get('width'), '→', width);
        console.log('Canvas Height (URL):', urlParams.get('height'), '→', height);
        console.log('Mobile View:', isMobileView);
        
        return { width, height };
    })();

    console.log('✅ FINAL defaultSize:', defaultSize);

    // Parse canvas_data dengan benar
    const parseCanvasData = (data) => {
        if (!data) return [];
        
        let parsed = [];
        if (Array.isArray(data)) {
            parsed = data;
        } else if (typeof data === 'string') {
            try {
                parsed = JSON.parse(data);
            } catch (e) {
                console.error('Failed to parse canvas_data:', e);
                return [];
            }
        }

        // ✅ FIX: Normalisasi path gambar
        return parsed.map(obj => {
            if (obj.imageUrl) {
                // Jika path relatif, tambahkan /storage/
                if (!obj.imageUrl.startsWith('/') && !obj.imageUrl.startsWith('http')) {
                    obj.imageUrl = '/storage/' + obj.imageUrl;
                }
            }
            // Support backward compatibility dengan 'src'
            if (obj.src && !obj.imageUrl) {
                obj.imageUrl = obj.src.startsWith('/') ? obj.src : '/storage/' + obj.src;
            }
            
            console.log('📦 Loaded object:', { id: obj.id, type: obj.type, imageUrl: obj.imageUrl });
            
            return obj;
        });
    };

    // State utama aplikasi editor - LOAD dari initialDesign
    const [canvasObjects, setCanvasObjects] = useState(() => {
        const parsed = parseCanvasData(initialDesign?.canvas_data);
        console.log('🎨 Loading canvas objects:', parsed.length, 'items');
        return Array.isArray(parsed) ? parsed : []; // ✅ Pastikan selalu array
    });
    
    // Undo/Redo History
    const [history, setHistory] = useState([]);
    const [historyStep, setHistoryStep] = useState(-1);
    const [isLoadingCanvas, setIsLoadingCanvas] = useState(true);
    
    const [selectedId, setSelectedId] = useState(null);
    const [designName, setDesignName] = useState(initialDesign?.title || 'Desain Batik Baru');
    const [isSaving, setIsSaving] = useState(false);
    
    // State untuk motifs
    const [motifs, setMotifs] = useState([]);
    const [loadingMotifs, setLoadingMotifs] = useState(true);
    const [uploadingMotif, setUploadingMotif] = useState(false); // ✅ Tambahkan state ini

    // Tool states
    const [activeTool, setActiveTool] = useState('move');
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentTool, setCurrentTool] = useState('move');
    
    // Brush/Drawing states
    const [brushColor, setBrushColor] = useState('#BA682A');
    const [brushWidth, setBrushWidth] = useState(6);
    const [eraserWidth, setEraserWidth] = useState(20);
    const [activeBrush, setActiveBrush] = useState({
        color: '#BA682A',
        size: 6,
        opacity: 1
    });
    
    // Other states
    const [showGrid, setShowGrid] = useState(true);
    const [snapToGrid, setSnapToGrid] = useState(true);
    const [pointer, setPointer] = useState({ x: 0, y: 0 });
    const [autosaveStatus, setAutosaveStatus] = useState('idle');

    const stageRef = useRef();
    const [show3DModal, setShow3DModal] = useState(false);
    const [patternFor3D, setPatternFor3D] = useState('');

    // Load motifs dari API saat komponen mount (dengan delay untuk mobile)
    useEffect(() => {
        // Delay fetching di mobile untuk prioritaskan render canvas
        const timeoutId = setTimeout(() => {
            fetchMotifs();
        }, isMobile ? 1000 : 0);
        
        return () => clearTimeout(timeoutId);
    }, [isMobile]);

    // Fetch motifs dari server
    const fetchMotifs = async () => {
        try {
            console.log('=== FETCHING MOTIFS ===');
            setLoadingMotifs(true);

            // Fetch global motifs
            const globalUrl = '/api/motifs/editor'; // ✅ Langsung pakai URL
            console.log('Fetching global motifs from:', globalUrl);

            const globalResponse = await fetch(globalUrl, {
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                }
            });

            console.log('Global response status:', globalResponse.status);

            if (!globalResponse.ok) {
                throw new Error(`Global motifs fetch failed: ${globalResponse.status}`);
            }

            const globalData = await globalResponse.json();
            console.log('Global motifs data:', globalData);
            console.log('Global motifs count:', globalData?.motifs?.length || 0);

            let allMotifs = globalData?.motifs || [];

            // Fetch user motifs
            try {
                const userUrl = '/api/user-motifs'; // ✅ Langsung pakai URL
                console.log('Fetching personal motifs from:', userUrl);
                
                const userResponse = await fetch(userUrl, {
                    headers: {
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                    }
                });

                console.log('Personal response status:', userResponse.status);

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    console.log('Personal motifs data:', userData);
                    console.log('Personal motifs count:', userData?.motifs?.length || 0);

                    const personalMotifs = userData?.motifs || [];
                    allMotifs = [...allMotifs, ...personalMotifs];
                }
            } catch (userError) {
                console.warn('Failed to fetch user motifs:', userError);
                // Continue with global motifs only
            }

            console.log('=== MOTIFS LOADED ===');
            console.log('Total motifs:', allMotifs.length);

            if (allMotifs.length > 0) {
                console.log('First motif sample:', allMotifs[0]);
            }

            setMotifs(allMotifs);

        } catch (error) {
            console.error('=== ERROR FETCHING MOTIFS ===');
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            setMotifs([]);
        } finally {
            setLoadingMotifs(false);
            console.log('=== FETCH COMPLETE ===');
        }
    };

    // Upload motif user
    // Di bagian handleUploadMotif, ubah seperti ini:
const handleUploadMotif = async (file) => {
    try {
        console.log('=== UPLOADING MOTIF ===');
        console.log('File:', file);
        
        setUploadingMotif(true);

        if (!file) {
            throw new Error('File tidak valid');
        }

        const motifName = prompt('Masukkan nama motif:', file.name.replace(/\.[^/.]+$/, ''));
        
        if (!motifName) {
            setUploadingMotif(false);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', motifName);
        formData.append('description', 'Motif pribadi');
        formData.append('category', 'Personal');

        console.log('FormData entries:');
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        // ✅ FIX: Ambil CSRF token dengan cara yang benar
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
        
        console.log('CSRF Token:', csrfToken ? 'Found' : 'Missing');
        console.log('Uploading to: /api/user-motifs');

        // Upload ke server
        const response = await fetch('/api/user-motifs', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'X-Requested-With': 'XMLHttpRequest', // ✅ Tambahkan ini
                'Accept': 'application/json',
            },
            body: formData,
            credentials: 'same-origin', // ✅ Tambahkan ini
        });

        console.log('Upload response status:', response.status);
        console.log('Upload response headers:', {
            contentType: response.headers.get('content-type'),
            status: response.status,
            statusText: response.statusText
        });

        // ✅ Cek apakah response adalah JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Response is not JSON:', text.substring(0, 500));
            throw new Error(`Server mengembalikan HTML (${response.status}). Mungkin session expired atau CSRF token tidak valid.`);
        }

        const result = await response.json();
        console.log('Upload response data:', result);

        if (!response.ok) {
            throw new Error(result.message || `Upload failed: ${response.status}`);
        }

        if (result.success && result.motif) {
            setMotifs(prevMotifs => [...prevMotifs, result.motif]);
            alert('Motif berhasil diunggah!');
            await fetchMotifs();
        } else {
            throw new Error(result.message || 'Response tidak valid');
        }

    } catch (error) {
        console.error('=== UPLOAD ERROR ===');
        console.error('Error:', error);
        console.error('Error message:', error.message);
        
        // ✅ Tampilkan error yang lebih jelas
        let errorMessage = error.message;
        if (error.message.includes('Unexpected token')) {
            errorMessage = 'Session expired atau CSRF token tidak valid. Silakan refresh halaman.';
        }
        
        alert('Terjadi kesalahan saat mengunggah motif: ' + errorMessage);
    } finally {
        setUploadingMotif(false);
    }
};

    // Fungsi untuk menyimpan desain ke database
    const handleSave = async () => {
        if (!stageRef.current) return;

        try {
            setIsSaving(true);

            // Generate thumbnail
            const layer = stageRef.current.findOne('Layer');
            const tempStage = new window.Konva.Stage({
                container: document.createElement('div'),
                width: defaultSize.width,
                height: defaultSize.height,
            });

            const tempLayer = new window.Konva.Layer();
            tempStage.add(tempLayer);

            layer.getChildren().forEach((node) => {
                if (node.getClassName() === 'Transformer') return;
                if (node.getAttr('listening') === false && node.getClassName() === 'Line') return;
                
                const clone = node.clone();
                tempLayer.add(clone);
            });

            tempLayer.batchDraw();

            const thumbnail = tempStage.toDataURL({
                x: 0,
                y: 0,
                width: defaultSize.width,
                height: defaultSize.height,
                mimeType: 'image/jpeg',
                quality: 0.8,
                pixelRatio: 1
            });

            tempStage.destroy();

            const payload = {
                title: designName,
                description: 'Desain batik custom',
                canvas_data: canvasObjects,
                canvas_width: defaultSize.width,
                canvas_height: defaultSize.height,
                thumbnail: thumbnail,
            };

            console.log('=== SAVING DESIGN ===');
            console.log('Payload:', payload);
            console.log('Canvas Width:', payload.canvas_width);
            console.log('Canvas Height:', payload.canvas_height);
            console.log('Canvas Data count:', payload.canvas_data.length);

            if (initialDesign?.id) {
                console.log('Updating design ID:', initialDesign.id);
                await router.put(`/designs/${initialDesign.id}`, payload, {
                    preserveState: false,
                    preserveScroll: false,
                    onSuccess: () => {
                        setIsSaving(false); // ✅ FIX
                        alert('Desain berhasil disimpan!');
                    },
                    onError: (errors) => {
                        console.error('Save errors:', errors);
                        setIsSaving(false); // ✅ FIX
                        alert('Gagal menyimpan: ' + Object.values(errors).join(', '));
                    }
                });
            } else {
                console.log('Creating new design');
                await router.post('/designs', payload, {
                    preserveState: false,
                    preserveScroll: false,
                    onSuccess: () => {
                        setIsSaving(false); // ✅ FIX
                        alert('Desain berhasil disimpan!');
                    },
                    onError: (errors) => {
                        console.error('Save errors:', errors);
                        setIsSaving(false); // ✅ FIX
                        alert('Gagal menyimpan: ' + Object.values(errors).join(', '));
                    }
                });
            }
        } catch (error) {
            console.error('Error saving design:', error);
            console.error('Error details:', error.response?.data);
            setIsSaving(false); // ✅ FIX
            alert('Gagal menyimpan desain: ' + (error.response?.data?.message || error.message));
        }
    };

    // Fungsi untuk membersihkan semua objek dari canvas
    const handleClearCanvas = () => {
        if (window.confirm('Apakah Anda yakin ingin menghapus semua motif dari canvas?')) {
            setCanvasObjects([]);
            setSelectedId(null);
        }
    };

    // Layer management functions
    const handleMoveLayerUp = (id) => {
        const index = canvasObjects.findIndex(obj => obj.id === id);
        if (index < canvasObjects.length - 1) {
            const newObjects = [...canvasObjects];
            [newObjects[index], newObjects[index + 1]] = [newObjects[index + 1], newObjects[index]];
            setCanvasObjects(newObjects);
        }
    };

    const handleMoveLayerDown = (id) => {
        const index = canvasObjects.findIndex(obj => obj.id === id);
        if (index > 0) {
            const newObjects = [...canvasObjects];
            [newObjects[index], newObjects[index - 1]] = [newObjects[index - 1], newObjects[index]];
            setCanvasObjects(newObjects);
        }
    };

    const handleBringToFront = (id) => {
        const index = canvasObjects.findIndex(obj => obj.id === id);
        if (index !== -1 && index < canvasObjects.length - 1) {
            const newObjects = [...canvasObjects];
            const [item] = newObjects.splice(index, 1);
            newObjects.push(item);
            setCanvasObjects(newObjects);
        }
    };

    // Tambahkan state
    const [exporting3D, setExporting3D] = useState(false);

    const handleShow3D = async () => {
        if (!stageRef.current) return;

        try {
            setExporting3D(true); // ✅ Show loading

            const stage = stageRef.current;
            const layer = stage.findOne('Layer');
            
            if (!layer) {
                console.error('Layer not found');
                return;
            }

            // ✅ FIX: Tunggu semua image ter-load penuh
            const imageNodes = layer.find('Image');
            const imageLoadPromises = [];

            imageNodes.forEach(node => {
                const image = node.image();
                if (image && !image.complete) {
                    // Image belum ter-load penuh
                    imageLoadPromises.push(
                        new Promise((resolve) => {
                            image.onload = () => resolve();
                            image.onerror = () => resolve(); // Tetap resolve meskipun error
                        })
                    );
                }
            });

            // Tunggu semua image selesai load
            if (imageLoadPromises.length > 0) {
                console.log('⏳ Waiting for', imageLoadPromises.length, 'images to load...');
                await Promise.all(imageLoadPromises);
                console.log('✅ All images loaded');
            }

            // Re-draw layer untuk memastikan semua image ter-render
            layer.batchDraw();

            // Tunggu sebentar untuk memastikan render selesai
            await new Promise(resolve => setTimeout(resolve, 100));

            // Buat stage baru temporary hanya untuk export
            const tempStage = new window.Konva.Stage({
                container: document.createElement('div'),
                width: defaultSize.width,
                height: defaultSize.height,
            });

            const tempLayer = new window.Konva.Layer();
            tempStage.add(tempLayer);

            // Clone semua objek dari layer asli ke temp layer
            layer.getChildren().forEach((node) => {
                // Skip transformer dan grid
                if (node.getClassName() === 'Transformer') return;
                if (node.getAttr('listening') === false && node.getClassName() === 'Line') return;
                
                const clone = node.clone();
                tempLayer.add(clone);
            });

            tempLayer.batchDraw();

            // ✅ Tunggu sebentar lagi untuk memastikan clone ter-render
            await new Promise(resolve => setTimeout(resolve, 100));

            // Export hanya area canvas putih dengan pixelRatio lebih tinggi
            const patternDataURL = tempStage.toDataURL({
                x: 0,
                y: 0,
                width: defaultSize.width,
                height: defaultSize.height,
                mimeType: 'image/png',
                quality: 1,
                pixelRatio: 2 // Higher quality
            });

            // Cleanup
            tempStage.destroy();

            console.log('=== EXPORTING PATTERN FOR 3D ===');
            console.log('Canvas size:', defaultSize.width, 'x', defaultSize.height);
            console.log('Pattern data URL length:', patternDataURL.length);

            setPatternFor3D(patternDataURL);
            setShow3DModal(true);
        } catch (error) {
            console.error('Error exporting to 3D:', error);
            alert('Gagal export ke 3D: ' + error.message);
        } finally {
            setExporting3D(false); // ✅ Hide loading
        }
    };

    // Fungsi untuk memperbarui properti objek dari toolbar
    const updateObjectProperties = (id, newAttrs) => {
        const newObjects = canvasObjects.slice();
        const objIndex = newObjects.findIndex(obj => obj.id === id);
        if (objIndex !== -1) {
            newObjects[objIndex] = { ...newObjects[objIndex], ...newAttrs };
            updateCanvasObjects(newObjects);
        }
    };

    const handleDrop = useCallback(
        (event) => {
            event.preventDefault();

            const transfer = event?.nativeEvent?.dataTransfer;
            if (!transfer) return;

            const motifPayload = transfer.getData('application/json');
            if (!motifPayload) return;

            let motifData;
            try {
                motifData = JSON.parse(motifPayload);
            } catch (error) {
                console.warn('Invalid motif payload dropped', error);
                return;
            }

            if (!motifData?.preview_image_path && !motifData?.file_path) return;

            const newObject = {
                id: nanoid(),
                type: 'image',
                name: motifData.name ?? 'Motif',
                imageUrl: motifData.preview_image_path ?? motifData.file_path,
                x: pointer.x - 100,
                y: pointer.y - 100,
                width: motifData.width ?? 200,
                height: motifData.height ?? 200,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
                opacity: 1,
                draggable: true,
            };

            updateCanvasObjects((prev) => [...prev, newObject]);
            setSelectedId(newObject.id);
        },
        [pointer, canvasObjects]
    );

    // Initialize history with initial canvas state
    useEffect(() => {
        if (canvasObjects.length >= 0 && history.length === 0) {
            setHistory([canvasObjects]);
            setHistoryStep(0);
        }
        
        // Canvas loaded
        setTimeout(() => setIsLoadingCanvas(false), 500);
    }, []);

    // Save to history when canvas changes
    const saveToHistory = useCallback((newObjects) => {
        setHistory(prev => {
            const newHistory = prev.slice(0, historyStep + 1);
            newHistory.push(newObjects);
            // Limit history to 50 steps
            if (newHistory.length > 50) {
                newHistory.shift();
                return newHistory;
            }
            return newHistory;
        });
        setHistoryStep(prev => Math.min(prev + 1, 49));
    }, [historyStep]);

    // Undo function
    const handleUndo = useCallback(() => {
        if (historyStep > 0) {
            setHistoryStep(prev => prev - 1);
            setCanvasObjects(history[historyStep - 1]);
            setSelectedId(null);
        }
    }, [historyStep, history]);

    // Redo function
    const handleRedo = useCallback(() => {
        if (historyStep < history.length - 1) {
            setHistoryStep(prev => prev + 1);
            setCanvasObjects(history[historyStep + 1]);
            setSelectedId(null);
        }
    }, [historyStep, history]);

    // Wrapper untuk setCanvasObjects yang auto-save ke history
    const updateCanvasObjects = useCallback((updater) => {
        setCanvasObjects(prev => {
            const newObjects = typeof updater === 'function' ? updater(prev) : updater;
            saveToHistory(newObjects);
            return newObjects;
        });
    }, [saveToHistory]);

    // Hook untuk menangani semua shortcut keyboard
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            // Undo
            if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                handleUndo();
                return;
            }

            // Redo
            if (e.ctrlKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                handleRedo();
                return;
            }

            // Hapus Motif
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
                updateCanvasObjects(canvasObjects.filter(obj => obj.id !== selectedId));
                setSelectedId(null);
            }
            
            // Simpan Desain
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                handleSave();
            }

            if (!selectedId) return;

            const selectedIndex = canvasObjects.findIndex(obj => obj.id === selectedId);
            const selectedObject = canvasObjects[selectedIndex];

            // Duplikasi Motif
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                const newObject = {
                    ...selectedObject,
                    id: nanoid(),
                    x: selectedObject.x + 15,
                    y: selectedObject.y + 15,
                };
                updateCanvasObjects(prev => [...prev, newObject]);
                setSelectedId(newObject.id);
            }

            // Layer Ordering
            if (e.ctrlKey && (e.key === '[' || e.key === ']')) {
                e.preventDefault();
                const newObjects = [...canvasObjects];
                
                if (e.key === '[' && selectedIndex > 0) {
                    [newObjects[selectedIndex], newObjects[selectedIndex - 1]] = [newObjects[selectedIndex - 1], newObjects[selectedIndex]];
                    updateCanvasObjects(newObjects);
                }

                if (e.key === ']' && selectedIndex < newObjects.length - 1) {
                    [newObjects[selectedIndex], newObjects[selectedIndex + 1]] = [newObjects[selectedIndex + 1], newObjects[selectedIndex]];
                    updateCanvasObjects(newObjects);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [canvasObjects, selectedId, handleUndo, handleRedo, updateCanvasObjects]);

    // Mendapatkan objek yang dipilih berdasarkan ID
    const selectedObject = canvasObjects.find(obj => obj.id === selectedId);

    // Sinkronkan activeBrush dengan state brush
    useEffect(() => {
        setActiveBrush({
            color: brushColor,
            size: brushWidth,
            opacity: 1
        });
    }, [brushColor, brushWidth]);

    // Sinkronkan currentTool dengan activeTool
    useEffect(() => {
        setCurrentTool(activeTool);
    }, [activeTool]);

    // Tambahkan state untuk dropdown download
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);

    // Tambahkan fungsi download (setelah handleSave)
    const handleDownload = (format) => {
        if (!stageRef.current) return;

        const stage = stageRef.current;
        const layer = stage.findOne('Layer');
        
        if (!layer) {
            alert('Canvas tidak ditemukan');
            return;
        }

        // Buat stage temporary untuk export
        const tempStage = new window.Konva.Stage({
            container: document.createElement('div'),
            width: defaultSize.width,
            height: defaultSize.height,
        });

        const tempLayer = new window.Konva.Layer();
        tempStage.add(tempLayer);

        // Clone semua objek
        layer.getChildren().forEach((node) => {
            if (node.getClassName() === 'Transformer') return;
            if (node.getAttr('listening') === false && node.getClassName() === 'Line') return;
            
            const clone = node.clone();
            tempLayer.add(clone);
        });

        tempLayer.batchDraw();

        const fileName = `${designName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}`;

        try {
            if (format === 'png') {
                // Export sebagai PNG (Lossless, Support Transparansi)
                const dataURL = tempStage.toDataURL({
                    mimeType: 'image/png',
                    quality: 1,
                    pixelRatio: 3 // ✅ Higher quality untuk print
                });
                downloadURI(dataURL, `${fileName}.png`);
            } else if (format === 'jpg') {
                // Export sebagai JPG (Kompres, Background Putih)
                const dataURL = tempStage.toDataURL({
                    mimeType: 'image/jpeg',
                    quality: 0.95,
                    pixelRatio: 3 // ✅ Higher quality
                });
                downloadURI(dataURL, `${fileName}.jpg`);
            }

            console.log(`✅ Download ${format.toUpperCase()} berhasil:`, fileName);
            setShowDownloadMenu(false);
            
        } catch (error) {
            console.error('Error downloading:', error);
            alert('Gagal mengunduh desain: ' + error.message);
        } finally {
            tempStage.destroy();
        }
    };

    // Tambahkan setelah useEffect yang sudah ada
useEffect(() => {
    const handleClickOutside = (event) => {
        if (showDownloadMenu && !event.target.closest('.relative')) {
            setShowDownloadMenu(false);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
}, [showDownloadMenu]);

    return (
        <>
            <Head title="Editor Desain Batik" />
            <div className="flex flex-col h-screen bg-gray-50 font-sans">
                {/* Modern Header */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                    <div className="flex items-center justify-between px-3 md:px-6 py-3">
                        {/* Left Section */}
                        <div className="flex items-center gap-2 md:gap-3">
                            <Link 
                                href="/dashboard"
                                className="flex items-center justify-center w-9 h-9 hover:bg-gray-100 rounded-lg transition"
                                title="Kembali"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-700" />
                            </Link>
                            
                            <div className="hidden md:flex items-center gap-2 pl-2 border-l">
                                <input
                                    type="text"
                                    value={designName}
                                    onChange={(e) => setDesignName(e.target.value)}
                                    className="text-sm font-semibold text-gray-900 bg-transparent border-none outline-none focus:bg-gray-50 px-2 py-1 rounded transition max-w-[200px]"
                                    placeholder="Nama desain"
                                />
                                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                                    {defaultSize.width} × {defaultSize.height}
                                </span>
                            </div>
                        </div>

                        {/* Center Section - Mobile Title */}
                        <div className="md:hidden flex-1 text-center">
                            <input
                                type="text"
                                value={designName}
                                onChange={(e) => setDesignName(e.target.value)}
                                className="text-sm font-semibold text-gray-900 bg-transparent border-none outline-none focus:bg-gray-50 px-2 py-1 rounded transition text-center w-full"
                                placeholder="Nama desain"
                            />
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-1 md:gap-2">
                            {/* Panel Toggles - Desktop Only */}
                            <div className="hidden lg:flex items-center gap-1 mr-2">
                                <button
                                    onClick={() => setShowLeftPanel(!showLeftPanel)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                                    title={showLeftPanel ? "Sembunyikan Panel Motif" : "Tampilkan Panel Motif"}
                                >
                                    {showLeftPanel ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => setShowRightPanel(!showRightPanel)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                                    title={showRightPanel ? "Sembunyikan Panel Properties" : "Tampilkan Panel Properties"}
                                >
                                    {showRightPanel ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Undo/Redo Buttons */}
                            <div className="hidden md:flex items-center gap-1 mr-2 border-r pr-2">
                                <button
                                    onClick={handleUndo}
                                    disabled={historyStep <= 0}
                                    className={`p-2 rounded-lg transition ${
                                        historyStep <= 0 
                                            ? 'text-gray-300 cursor-not-allowed' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                    title="Undo (Ctrl+Z)"
                                >
                                    <Undo className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleRedo}
                                    disabled={historyStep >= history.length - 1}
                                    className={`p-2 rounded-lg transition ${
                                        historyStep >= history.length - 1
                                            ? 'text-gray-300 cursor-not-allowed' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                    title="Redo (Ctrl+Y)"
                                >
                                    <Redo className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="hidden md:flex items-center gap-2">
                                {/* Download Dropdown */}
                                <div className="relative">
                                    <button 
                                        onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition text-sm font-medium"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span className="hidden lg:inline">Unduh</span>
                                        <ChevronDown className="w-3 h-3" />
                                    </button>
                                    
                                    {showDownloadMenu && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                                            <button
                                                onClick={() => handleDownload('png')}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition rounded-t-lg"
                                            >
                                                <div className="font-semibold text-gray-800 text-sm">PNG</div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    Kualitas tinggi, transparansi
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => handleDownload('jpg')}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition rounded-b-lg border-t"
                                            >
                                                <div className="font-semibold text-gray-800 text-sm">JPG</div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    File lebih kecil
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button 
                                    onClick={handleShow3D}
                                    disabled={exporting3D}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition text-sm font-medium ${
                                        exporting3D 
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                                    title="Preview pada Produk 3D"
                                >
                                    {exporting3D ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="hidden lg:inline">Loading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Shirt className="w-4 h-4" />
                                            <span className="hidden lg:inline">Preview</span>
                                        </>
                                    )}
                                </button>
                                
                                <button 
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition text-sm font-medium ${
                                        isSaving ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#D2691E] hover:bg-[#BA682A] text-white'
                                    }`}
                                >
                                    <Save className="w-4 h-4" />
                                    <span className="hidden lg:inline">{isSaving ? 'Menyimpan...' : 'Simpan'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </header>

                {/* Mobile Info Bar - Fixed below header, above sidebar/tools */}
                {isMobile && (
                    <div className="fixed top-16 left-0 right-0 z-50 bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between text-xs">
                        <span className="text-gray-600 font-medium">{defaultSize.width} × {defaultSize.height}px</span>
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`px-3 py-1.5 rounded-lg font-medium transition ${
                                isSaving 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-[#D2691E] text-white hover:bg-[#BA682A]'
                            }`}
                        >
                            {isSaving ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                )}

                {/* Loading Screen for Mobile */}
                {isLoadingCanvas && isMobile && (
                    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-[#D2691E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600 font-medium">Memuat Canvas...</p>
                            <p className="text-sm text-gray-400 mt-1">Mohon tunggu sebentar</p>
                        </div>
                    </div>
                )}
                
                {/* Main Content - Responsive Layout */}
                <div className="flex-1 flex overflow-hidden relative">
                    {/* Mobile Sidebar - Always Visible on Left */}
                    {isMobile ? (
                        <aside className="fixed left-0 bottom-0 w-16 bg-white border-r border-gray-200 flex flex-col items-center py-3 gap-3 z-40" style={{ top: '104px' }}>
                            {/* Tab Buttons */}
                            <button
                                onClick={() => {
                                    if (showLeftPanel) {
                                        setShowLeftPanel(false);
                                    } else {
                                        setShowLeftPanel(true);
                                        setShowRightPanel(false);
                                    }
                                }}
                                className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg transition ${
                                    showLeftPanel ? 'bg-[#D2691E] text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                title="Motif"
                            >
                                <ImagePlus className="w-5 h-5" />
                                <span className="text-[9px] mt-0.5">Motif</span>
                            </button>
                            
                            <button
                                onClick={() => {
                                    if (showRightPanel) {
                                        setShowRightPanel(false);
                                    } else {
                                        setShowRightPanel(true);
                                        setShowLeftPanel(false);
                                    }
                                }}
                                className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg transition ${
                                    showRightPanel ? 'bg-[#D2691E] text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                title="Posisi"
                            >
                                <Menu className="w-5 h-5" />
                                <span className="text-[9px] mt-0.5">Posisi</span>
                            </button>
                        </aside>
                    ) : null}

                    {/* Desktop LEFT SIDEBAR - Pustaka Motif */}
                    {!isMobile && (
                        <aside className={`
                            ${showLeftPanel ? 'translate-x-0' : '-translate-x-full'}
                            relative w-64 lg:w-72 bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-transform duration-300
                        `}>
                            {/* Panel Header */}
                            <div className="flex items-center justify-between p-3 border-b bg-gray-50">
                                <h3 className="text-sm font-semibold text-gray-900">Pustaka Motif</h3>
                                <button
                                    onClick={() => setShowLeftPanel(false)}
                                    className="p-1.5 hover:bg-gray-200 rounded-lg transition"
                                >
                                    <X className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                            
                            <div className="p-3 flex-1 overflow-y-auto">
                                <MotifLibrary 
                                    motifs={motifs} 
                                    loading={loadingMotifs}
                                    uploading={uploadingMotif}
                                    onRefresh={fetchMotifs}
                                    onUpload={handleUploadMotif}
                                />
                            </div>
                        </aside>
                    )}

                    {/* Mobile Panel - Motif Library */}
                    {isMobile && showLeftPanel && (
                        <aside className="fixed left-16 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col overflow-hidden z-30 shadow-xl transition-transform duration-300" style={{ top: '104px' }}>
                            <div className="flex items-center justify-between p-3 border-b bg-gray-50">
                                <h3 className="text-sm font-semibold text-gray-900">Pustaka Motif</h3>
                                <button
                                    onClick={() => setShowLeftPanel(false)}
                                    className="p-1.5 hover:bg-gray-200 rounded-lg transition"
                                >
                                    <X className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                            
                            <div className="p-3 flex-1 overflow-y-auto">
                                <MotifLibrary 
                                    motifs={motifs} 
                                    loading={loadingMotifs}
                                    uploading={uploadingMotif}
                                    onRefresh={fetchMotifs}
                                    onUpload={handleUploadMotif}
                                />
                            </div>
                        </aside>
                    )}
                    
                    {/* CENTER - Canvas Area */}
                    <div className={`flex-1 flex flex-col bg-gray-50 min-w-0 ${isMobile ? 'ml-16' : ''}`}>
                        <div className="flex-1 p-2 md:p-4 overflow-auto">
                            <CanvasArea 
                                canvasObjects={canvasObjects || []}
                                setCanvasObjects={setCanvasObjects}
                                selectedId={selectedId}
                                setSelectedId={setSelectedId}
                                stageRef={stageRef}
                                pointer={pointer}
                                setPointer={setPointer}
                                activeBrush={activeBrush}
                                isDrawing={isDrawing}
                                setIsDrawing={setIsDrawing}
                                currentTool={currentTool}
                                showGrid={showGrid}
                                snapToGrid={snapToGrid}
                                onDrop={handleDrop}
                                defaultSize={defaultSize}
                                brushColor={brushColor}
                                setBrushColor={setBrushColor}
                                brushWidth={brushWidth}
                                setBrushWidth={setBrushWidth}
                                eraserWidth={eraserWidth}
                                setEraserWidth={setEraserWidth}
                                activeTool={activeTool}
                                setActiveTool={setActiveTool}
                                isMobile={isMobile}
                                handleUndo={handleUndo}
                                handleRedo={handleRedo}
                                historyStep={historyStep}
                                historyLength={history.length}
                            />
                        </div>
                    </div>
                    
                    {/* RIGHT SIDEBAR - Properties & Layers (Collapsible on Desktop, Side Panel on Mobile) */}
                    {isMobile ? (
                        /* Mobile: Side Panel from Left */
                        showRightPanel && (
                            <aside className="fixed left-16 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col overflow-hidden z-30 shadow-xl transition-transform duration-300" style={{ top: '104px' }}>
                                <div className="flex items-center justify-between p-3 border-b bg-gray-50">
                                    <h3 className="text-sm font-semibold text-gray-900">Posisi & Layer</h3>
                                    <button
                                        onClick={() => setShowRightPanel(false)}
                                        className="p-1.5 hover:bg-gray-200 rounded-lg transition"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="p-3 flex-1 overflow-y-auto space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                        <PropertiesToolbar 
                                            selectedObject={selectedObject}
                                            onUpdate={updateObjectProperties}
                                        />
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                        <LayerPanel 
                                            objects={canvasObjects}
                                            selectedId={selectedId}
                                            onSelect={setSelectedId}
                                            onClear={handleClearCanvas}
                                            onMoveUp={handleMoveLayerUp}
                                            onMoveDown={handleMoveLayerDown}
                                            onBringToFront={handleBringToFront}
                                        />
                                    </div>
                                </div>
                            </aside>
                        )
                    ) : (
                        /* Desktop: Right Sidebar */
                        <aside className={`
                            ${showRightPanel ? 'translate-x-0 w-64 lg:w-72' : 'translate-x-full w-0'}
                            bg-white border-l border-gray-200 flex flex-col overflow-hidden transition-all duration-300
                        `}>
                            {showRightPanel && (
                                <>
                                    <div className="flex items-center justify-between p-3 border-b bg-gray-50">
                                        <h3 className="text-sm font-semibold text-gray-900">Properties</h3>
                                        <button
                                            onClick={() => setShowRightPanel(false)}
                                            className="p-1.5 hover:bg-gray-200 rounded-lg transition"
                                        >
                                            <X className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>
                                    <div className="p-3 flex-1 overflow-y-auto space-y-4">
                                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                            <PropertiesToolbar 
                                                selectedObject={selectedObject}
                                                onUpdate={updateObjectProperties}
                                            />
                                        </div>
                                        
                                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                            <LayerPanel 
                                                objects={canvasObjects}
                                                selectedId={selectedId}
                                                onSelect={setSelectedId}
                                                onClear={handleClearCanvas}
                                                onMoveUp={handleMoveLayerUp}
                                                onMoveDown={handleMoveLayerDown}
                                                onBringToFront={handleBringToFront}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </aside>
                    )}

                    {/* Mobile FAB - Toggle Right Panel */}
                    {isMobile && selectedObject && !showRightPanel && (
                        <button
                            onClick={() => setShowRightPanel(true)}
                            className="fixed right-4 bottom-4 z-20 w-12 h-12 bg-[#D2691E] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#BA682A] transition"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    )}
                </div>
                
                {/* 3D Preview Modal - tetap sama */}
                {show3DModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-bold text-[#BA682A]">3D Product Preview</h3>
                                <button
                                    onClick={() => setShow3DModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <MockupViewer3D 
                                    patternUrl={patternFor3D} // ✅ UBAH: patternImage → patternUrl
                                    canvasWidth={defaultSize.width}
                                    canvasHeight={defaultSize.height}
                                />
                            </div>
                            
                            <div className="flex justify-end gap-3 mt-6">
                                <button 
                                    onClick={() => setShow3DModal(false)} 
                                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition font-semibold"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}