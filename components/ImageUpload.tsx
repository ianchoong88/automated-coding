
import React, { useRef, useState, useEffect } from 'react';
import { CameraModal } from './CameraModal';

interface ImageUploadProps {
  onProcessImages: (images: string[]) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onProcessImages }) => {
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [pendingImages, setPendingImages] = useState<string[]>([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const promises = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(promises).then(newImages => {
        setPendingImages(prev => [...prev, ...newImages]);
      });
    }
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPendingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCameraAction = () => {
    if (isMobile) {
      cameraInputRef.current?.click();
    } else {
      setShowCameraModal(true);
    }
  };

  const handleCaptureAll = (images: string[]) => {
    setPendingImages(prev => [...prev, ...images]);
    setShowCameraModal(false); // Camera is stopped inside CameraModal and unmounted here
  };

  return (
    <div className="space-y-8">
      {/* Pending Images List */}
      {pendingImages.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-4 px-2">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Captured Sides</h4>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-bold">{pendingImages.length} images</span>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {pendingImages.map((img, idx) => (
              <div key={idx} className="relative group w-24 h-24 sm:w-32 sm:h-32">
                <img 
                  src={img} 
                  alt={`Side ${idx + 1}`} 
                  className="w-full h-full object-cover rounded-2xl border-2 border-slate-100 shadow-sm transition-transform group-hover:scale-[1.02]"
                />
                <button 
                  onClick={() => removePhoto(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
            
            <button 
              onClick={handleCameraAction}
              className="w-24 h-24 sm:w-32 sm:h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-tighter">Add More</span>
            </button>
          </div>
          
          <div className="mt-8">
            <button
              onClick={() => onProcessImages(pendingImages)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-8 rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Extract Contact Details
            </button>
          </div>
        </div>
      )}

      {pendingImages.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleCameraAction}
            className="group relative flex flex-col items-center justify-center p-12 bg-white border-2 border-slate-200 rounded-3xl transition-all hover:border-blue-500 hover:shadow-xl hover:shadow-blue-100 active:scale-[0.98]"
          >
            <div className="mb-4 p-5 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">{isMobile ? 'Take Photo' : 'Scan Card'}</h3>
            <p className="text-slate-500 text-center mt-2 max-w-[200px] text-sm leading-relaxed">Fast extraction from front and back photos</p>
          </button>

          <button
            onClick={() => galleryInputRef.current?.click()}
            className="group relative flex flex-col items-center justify-center p-12 bg-white border-2 border-slate-200 rounded-3xl transition-all hover:border-blue-500 hover:shadow-xl hover:shadow-blue-100 active:scale-[0.98]"
          >
            <div className="mb-4 p-5 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Upload Files</h3>
            <p className="text-slate-500 text-center mt-2 max-w-[200px] text-sm leading-relaxed">Import card images from your gallery</p>
          </button>
        </div>
      )}

      {/* Hidden inputs */}
      <input 
        type="file" 
        ref={cameraInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden" 
      />
      <input 
        type="file" 
        ref={galleryInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden" 
      />

      <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
        <div className="h-px bg-slate-200 flex-1"></div>
        <span>Multi-Side Input Enabled</span>
        <div className="h-px bg-slate-200 flex-1"></div>
      </div>

      {showCameraModal && (
        <CameraModal 
          onCaptureAll={handleCaptureAll} 
          onClose={() => setShowCameraModal(false)} 
        />
      )}
    </div>
  );
};
