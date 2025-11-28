import React from 'react';
import { TrendItem } from '../types';

interface TrendCardProps {
  item: TrendItem;
}

const TrendCard: React.FC<TrendCardProps> = ({ item }) => {
  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-3">
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          {item.platform || 'Web'}
        </span>
        <div className="flex gap-1">
            {/* Decorative dots */}
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
        {item.title}
      </h3>
      
      <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
        {item.summary}
      </p>
      
      <div className="flex flex-wrap gap-2 mt-auto">
        {item.tags.map((tag, idx) => (
          <span key={idx} className="inline-flex items-center text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TrendCard;