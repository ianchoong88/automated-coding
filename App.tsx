
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ImageUpload } from './components/ImageUpload';
import { ContactEditor } from './components/ContactEditor';
import { ContactInfo, GraphicBox } from './types';
import { extractContactFromImages } from './services/geminiService';

export const cropImage = (base64: string, box: GraphicBox): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('');

      const x = (box.xmin / 1000) * img.width;
      const y = (box.ymin / 1000) * img.height;
      const w = ((box.xmax - box.xmin) / 1000) * img.width;
      const h = ((box.ymax - box.ymin) / 1000) * img.height;

      if (w <= 0 || h <= 0) return resolve('');

      const scale = Math.min(400 / Math.max(w, h), 1);
      canvas.width = w * scale;
      canvas.height = h * scale;

      ctx.drawImage(img, x, y, w, h, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = base64;
  });
};

const App: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ContactInfo | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleProcessImages = async (images: string[]) => {
    setIsProcessing(true);
    setError(null);
    setPreviewImages(images);
    
    try {
      const data = await extractContactFromImages(images);
      
      if (data.logoBox && images[data.logoBox.imageIndex]) {
        data.logo = await cropImage(images[data.logoBox.imageIndex], data.logoBox);
      }
      if (data.photoBox && images[data.photoBox.imageIndex]) {
        data.photo = await cropImage(images[data.photoBox.imageIndex], data.photoBox);
      }

      setExtractedData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to extract data. Please try clearer photos.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setExtractedData(null);
    setPreviewImages([]);
    setError(null);
  };

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-700">
        {!extractedData && !isProcessing && (
          <ImageUpload onProcessImages={handleProcessImages} />
        )}

        {isProcessing && (
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-slate-100 flex flex-col items-center justify-center space-y-8 text-center">
            <div className="flex -space-x-4">
              {previewImages.slice(0, 3).map((img, i) => (
                <img 
                  key={i}
                  src={img} 
                  alt="Processing" 
                  className={`w-32 h-20 object-cover rounded-xl shadow-lg border-2 border-white grayscale blur-[1px] opacity-60 transform ${i === 1 ? 'rotate-3 translate-y-2' : i === 2 ? '-rotate-3' : ''}`}
                />
              ))}
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-800">Synthesizing Contact...</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                Gemini is merging text and graphics from {previewImages.length} {previewImages.length === 1 ? 'photo' : 'photos'}.
              </p>
            </div>
            <div className="w-64 bg-slate-100 rounded-full h-2 overflow-hidden relative">
              <div className="bg-blue-600 h-full w-1/3 absolute animate-shimmer"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="flex-1 font-medium">{error}</p>
            <button 
              onClick={handleReset}
              className="text-sm font-bold underline hover:no-underline"
            >
              Try Again
            </button>
          </div>
        )}

        {extractedData && !isProcessing && (
          <ContactEditor 
            initialData={extractedData} 
            sourceImages={previewImages}
            onReset={handleReset} 
          />
        )}

        {!extractedData && !isProcessing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-slate-200">
            <div className="text-center p-4">
              <div className="text-blue-600 mb-3 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-800">Graphics Extraction</h4>
              <p className="text-sm text-slate-500 mt-1">Automatic cropping of logos and portrait photos.</p>
            </div>
            <div className="text-center p-4">
              <div className="text-blue-600 mb-3 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-800">Smart Merge</h4>
              <p className="text-sm text-slate-500 mt-1">AI automatically combines data from all images.</p>
            </div>
            <div className="text-center p-4">
              <div className="text-blue-600 mb-3 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-800">Rich vCard</h4>
              <p className="text-sm text-slate-500 mt-1">Export contacts with embedded profile images.</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
