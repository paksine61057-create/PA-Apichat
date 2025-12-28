
import React from 'react';
import { PortfolioItem } from '../types';
import { FileText, Youtube, Image as ImageIcon, Video, Calendar, Tag, ExternalLink } from 'lucide-react';

interface PortfolioCardProps {
  item: PortfolioItem;
  onClick: (item: PortfolioItem) => void;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ item, onClick }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'PDF': return <FileText className="w-5 h-5 text-red-500" />;
      case 'YouTube': return <Youtube className="w-5 h-5 text-red-600" />;
      case 'Image': return <ImageIcon className="w-5 h-5 text-blue-500" />;
      case 'Video': return <Video className="w-5 h-5 text-purple-500" />;
      default: return <Tag className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div 
      onClick={() => onClick(item)}
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 overflow-hidden cursor-pointer flex flex-col h-full"
    >
      <div className="relative h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
        {item.type === 'Image' ? (
          <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : item.type === 'YouTube' ? (
          <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
             <img src={`https://img.youtube.com/vi/${getYouTubeId(item.url)}/0.jpg`} alt={item.title} className="w-full h-full object-cover opacity-60" />
             <Youtube className="absolute w-12 h-12 text-white opacity-80" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {getIcon()}
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{item.type}</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-slate-700 rounded-full shadow-sm border border-slate-100">
            {item.category}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-800 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
          {item.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-grow">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <div className="flex items-center text-slate-400 text-xs gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(item.createdAt).toLocaleDateString('th-TH')}</span>
          </div>
          <div className="flex items-center text-blue-500 text-xs font-bold gap-1 group-hover:translate-x-1 transition-transform">
            <span>ดูรายละเอียด</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper to extract YouTube ID
function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default PortfolioCard;
