
import React, { useRef, useEffect, useState } from 'react';

interface CameraModalProps {
  onCaptureAll: (base64Images: string[]) => void;
  onClose: () => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ onCaptureAll, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isReady, setIsReady] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [error, setError] = useState<{title: string, message: string} | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    async function setupCamera() {
      if (!window.isSecureContext) {
        setError({
          title: "Insecure Context",
          message: "Camera access requires HTTPS or localhost."
        });
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: { ideal: 'environment' }, // Prefer back camera for business cards
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          } 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setIsReady(true);
          };
        }
      } catch (err: any) {
        console.error("Camera access error:", err);
        setError({
          title: "Permission Denied",
          message: "Could not access camera. Please check your browser settings and permissions."
        });
      }
    }
    setupCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current && isReady) {
      // Shutter effect
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 150);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImages(prev => [...prev, dataUrl]);
      }
    }
  };

  const handleDone = () => {
    stopCamera();
    onCaptureAll(capturedImages);
  };

  const handleCancel = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/98 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full h-full sm:h-auto sm:max-w-3xl bg-slate-900 sm:rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
        
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/50 z-10">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isReady ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
            <h3 className="text-slate-200 font-bold text-sm tracking-tight uppercase tracking-widest">Scanning Session</h3>
          </div>
          <button 
            onClick={handleCancel} 
            className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Viewport */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="text-center p-10 max-w-sm space-y-4">
              <h4 className="text-white font-bold text-lg">{error.title}</h4>
              <p className="text-slate-400 text-sm">{error.message}</p>
              <button onClick={handleCancel} className="mt-4 px-6 py-2 bg-slate-800 text-white rounded-full">Close</button>
            </div>
          ) : (
            <>
              {!isReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 z-10 bg-slate-900">
                  <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-tighter">Warming up sensor...</p>
                </div>
              )}
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className={`w-full h-full object-cover ${isReady ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
              />
              
              {/* Shutter Flash Overlay */}
              {isFlashing && <div className="absolute inset-0 bg-white z-20 animate-out fade-out duration-150"></div>}

              {/* Guides */}
              <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
                <div className="w-[85%] sm:w-[70%] aspect-[1.586/1] border-2 border-white/30 rounded-3xl shadow-[0_0_0_100vw_rgba(0,0,0,0.5)]">
                  <div className="absolute -top-10 left-0 right-0 text-center">
                    <span className="bg-white/10 backdrop-blur text-white text-[10px] uppercase font-black px-4 py-1.5 rounded-full tracking-widest border border-white/20">
                      Align Card Face
                    </span>
                  </div>
                </div>
              </div>

              {/* Captured Reel */}
              {capturedImages.length > 0 && (
                <div className="absolute bottom-6 left-6 right-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide z-10">
                  {capturedImages.map((img, i) => (
                    <div key={i} className="relative shrink-0 w-16 h-10 rounded-lg overflow-hidden border-2 border-blue-500 shadow-xl animate-in slide-in-from-bottom-2">
                      <img src={img} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                        <span className="text-[8px] font-black text-white">{i + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Controls */}
        <div className="p-8 sm:p-10 flex items-center justify-between bg-slate-900 border-t border-slate-800">
          <div className="w-20 hidden sm:block">
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-tight">
               Captured:<br/><span className="text-slate-200 text-lg">{capturedImages.length}</span>
             </p>
          </div>

          <button
            disabled={!isReady}
            onClick={takePhoto}
            className={`group relative w-20 h-20 rounded-full border-4 border-slate-700 p-1 transition-all ${isReady ? 'hover:scale-105 active:scale-90' : 'opacity-30 cursor-not-allowed'}`}
          >
            <div className={`w-full h-full rounded-full flex items-center justify-center transition-colors ${isReady ? 'bg-white group-hover:bg-blue-50' : 'bg-slate-800'}`}>
               <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isReady ? 'bg-blue-600' : 'bg-slate-700'}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                 </svg>
               </div>
            </div>
          </button>

          <div className="w-24 flex justify-end">
            <button
              onClick={handleDone}
              disabled={capturedImages.length === 0}
              className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${capturedImages.length > 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
            >
              Done
            </button>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
