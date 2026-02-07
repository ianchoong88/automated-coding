
import React, { useState, useRef, useEffect } from 'react';
import { ContactInfo } from '../types';
import { downloadVCard } from '../utils/vCardGenerator';

interface ContactEditorProps {
  initialData: ContactInfo;
  sourceImages: string[];
  onReset: () => void;
}

type GraphicType = 'photo' | 'logo';

export const ContactEditor: React.FC<ContactEditorProps> = ({ initialData, sourceImages, onReset }) => {
  const [contact, setContact] = useState<ContactInfo>(initialData);
  const [editingGraphic, setEditingGraphic] = useState<GraphicType | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContact(prev => ({ ...prev, [name]: value }));
  };

  const handleDownload = () => {
    downloadVCard(contact);
  };

  const handleSaveGraphic = (type: GraphicType, base64: string) => {
    setContact(prev => ({ ...prev, [type]: base64 }));
    setEditingGraphic(null);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
      <div className="bg-slate-900 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer" onClick={() => setEditingGraphic('photo')}>
            {contact.photo ? (
              <img src={contact.photo} className="w-14 h-14 rounded-full border-2 border-blue-500 object-cover" alt="Profile" />
            ) : (
              <div className="w-14 h-14 rounded-full border-2 border-slate-700 bg-slate-800 flex items-center justify-center text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Extracted Details</h2>
            <p className="text-slate-400 text-sm">Review text and graphics before saving</p>
          </div>
        </div>
        <button 
          onClick={onReset}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Full Name</span>
              <input 
                type="text" 
                name="fullName"
                value={contact.fullName || ''} 
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:ring-blue-500 focus:border-blue-500" 
              />
            </label>
            <div className="block">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-slate-700">Company / Organization</span>
                <div className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setEditingGraphic('logo')}>
                  {contact.logo ? (
                    <img src={contact.logo} className="h-8 object-contain rounded border border-slate-100 p-0.5" alt="Logo" />
                  ) : (
                    <span className="text-[10px] uppercase font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Add Logo</span>
                  )}
                </div>
              </div>
              <input 
                type="text" 
                name="organization"
                value={contact.organization || ''} 
                onChange={handleChange}
                className="block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Job Title</span>
              <input 
                type="text" 
                name="jobTitle"
                value={contact.jobTitle || ''} 
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:ring-blue-500 focus:border-blue-500" 
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Email Address</span>
              <input 
                type="email" 
                name="email"
                value={contact.email || ''} 
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:ring-blue-500 focus:border-blue-500" 
              />
            </label>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Phone (Work)</span>
              <input 
                type="text" 
                name="phone"
                value={contact.phone || ''} 
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:ring-blue-500 focus:border-blue-500" 
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Mobile Number</span>
              <input 
                type="text" 
                name="mobile"
                value={contact.mobile || ''} 
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:ring-blue-500 focus:border-blue-500" 
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Website</span>
              <input 
                type="text" 
                name="website"
                value={contact.website || ''} 
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:ring-blue-500 focus:border-blue-500" 
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Address</span>
              <input 
                type="text" 
                name="address"
                value={contact.address || ''} 
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 focus:ring-blue-500 focus:border-blue-500" 
              />
            </label>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleDownload}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download vCard (.vcf)
          </button>
          <button 
            onClick={onReset}
            className="sm:w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 px-8 rounded-2xl transition-all"
          >
            Scan Another
          </button>
        </div>
      </div>

      {editingGraphic && (
        <GraphicAdjuster 
          type={editingGraphic} 
          images={sourceImages} 
          onSave={(base64) => handleSaveGraphic(editingGraphic, base64)} 
          onClose={() => setEditingGraphic(null)} 
        />
      )}
    </div>
  );
};

interface GraphicAdjusterProps {
  type: GraphicType;
  images: string[];
  onSave: (base64: string) => void;
  onClose: () => void;
}

const GraphicAdjuster: React.FC<GraphicAdjusterProps> = ({ type, images, onSave, onClose }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      // Reset zoom/offset on image change
      const targetDim = 400;
      const minScale = targetDim / Math.min(img.width, img.height);
      setZoom(minScale);
      setOffset({ x: 0, y: 0 });
      draw();
    };
    img.src = images[selectedIdx];
  }, [selectedIdx]);

  useEffect(() => {
    draw();
  }, [zoom, offset]);

  const draw = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const drawWidth = img.width * zoom;
    const drawHeight = img.height * zoom;
    
    // Draw centered with offsets
    const x = (canvas.width - drawWidth) / 2 + offset.x;
    const y = (canvas.height - drawHeight) / 2 + offset.y;
    
    ctx.drawImage(img, x, y, drawWidth, drawHeight);

    // If type is photo, we show a circle mask overlay in preview
    // But actual saved image will be rectangular (vCard standard)
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    const pos = getPos(e);
    lastPos.current = pos;
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;
    const pos = getPos(e);
    const dx = pos.x - lastPos.current.x;
    const dy = pos.y - lastPos.current.y;
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    lastPos.current = pos;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX, y: clientY };
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL('image/jpeg', 0.85));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Adjust {type}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>

        <div className="bg-slate-50 p-6 flex flex-col items-center">
          <div className="relative cursor-move overflow-hidden bg-slate-200 shadow-inner rounded-3xl"
               onMouseDown={handleMouseDown}
               onMouseMove={handleMouseMove}
               onMouseUp={handleMouseUp}
               onMouseLeave={handleMouseUp}
               onTouchStart={handleMouseDown}
               onTouchMove={handleMouseMove}
               onTouchEnd={handleMouseUp}
          >
            <canvas ref={canvasRef} width={300} height={300} className="max-w-full" />
            {/* Mask Overlay */}
            <div className={`absolute inset-0 pointer-events-none border-[30px] border-slate-50/80 ${type === 'photo' ? 'rounded-full' : ''}`}></div>
          </div>
          
          <div className="w-full mt-6 space-y-4">
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black text-slate-400 uppercase">Zoom</span>
               <input 
                type="range" 
                min="0.1" 
                max="3" 
                step="0.01" 
                value={zoom} 
                onChange={(e) => setZoom(parseFloat(e.target.value))} 
                className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
               />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase block">Choose Source Image</span>
              <div className="flex gap-2 overflow-x-auto py-2">
                {images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedIdx(i)}
                    className={`shrink-0 w-16 h-12 rounded-lg border-2 transition-all overflow-hidden ${selectedIdx === i ? 'border-blue-500 scale-105 shadow-md' : 'border-transparent opacity-60'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white flex gap-4">
          <button 
            onClick={handleApply}
            className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
          >
            Apply Changes
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-slate-100 text-slate-500 font-bold py-3 rounded-2xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
