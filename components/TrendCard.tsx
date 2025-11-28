import React from 'react';
import { TrendItem } from '../types';

interface TrendCardProps {
  item: TrendItem;
}

const TrendCard: React.FC<TrendCardProps> = ({ item }) => {
  // Use the provided URL, or fallback to a Google Search of the title
  const targetUrl = item.url && item.url.startsWith('http') 
    ? item.url 
    : `https://www.google.com/search?q=${encodeURIComponent(item.title)}`;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 z-10 relative">
          {item.platform || 'Web'}
        </span>
        <div className="flex gap-1">
            {/* Decorative dots */}
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
        <a 
          href={targetUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="focus:outline-none"
        >
          {/* Absolute inset covers the whole relative parent container, making the card clickable */}
          <span className="absolute inset-0" aria-hidden="true" />
          {item.title}
        </a>
      </h3>
      
      <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
        {item.summary}
      </p>
      
      <div className="flex flex-wrap gap-2 mt-auto relative z-10">
        {item.tags.map((tag, idx) => (
          <span key={idx} className="inline-flex items-center text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            #{tag}
          </span>
        ))}
      </div>
      
      {/* Visual cue for external link on hover */}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </div>
  );
};

export default TrendCard;