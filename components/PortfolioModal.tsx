
import React from 'react';
import { PortfolioItem } from '../types';
import { X, ExternalLink, Download } from 'lucide-react';

interface PortfolioModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const renderContent = () => {
    switch (item.type) {
      case 'PDF':
        return (
          <div className="w-full h-[70vh] rounded-lg overflow-hidden border border-slate-200">
            <iframe 
              src={`${item.url}#toolbar=0`} 
              className="w-full h-full"
              title={item.title}
            />
          </div>
        );
      case 'YouTube':
        const ytId = getYouTubeId(item.url);
        return (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        );
      case 'Image':
        return (
          <div className="w-full flex justify-center bg-slate-100 rounded-lg p-4 overflow-hidden">
            <img src={item.url} alt={item.title} className="max-w-full max-h-[70vh] rounded shadow-lg object-contain" />
          </div>
        );
      case 'Video':
        return (
          <div className="w-full bg-black rounded-lg overflow-hidden">
            <video src={item.url} controls autoPlay className="w-full max-h-[70vh]">
              Your browser does not support the video tag.
            </video>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded tracking-wider">
                {item.category}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400 text-xs font-medium">
                {new Date(item.createdAt).toLocaleDateString('th-TH')}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">{item.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="mb-6">
            {renderContent()}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">รายละเอียดผลงาน</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {item.description}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 rounded-b-2xl border-t border-slate-100 flex items-center justify-end gap-3">
           <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
           >
             <ExternalLink className="w-4 h-4" />
             เปิดในแท็บใหม่
           </a>
           {item.type !== 'YouTube' && (
             <a 
              href={item.url} 
              download
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md shadow-blue-200 transition-all"
             >
               <Download className="w-4 h-4" />
               ดาวน์โหลดไฟล์
             </a>
           )}
        </div>
      </div>
    </div>
  );
};

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default PortfolioModal;
