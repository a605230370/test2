import React, { useState, useCallback } from 'react';
import Layout from './components/Layout';
import TrendCard from './components/TrendCard';
import { fetchTrends } from './services/geminiService';
import { Category, Region, TrendItem, GroundingSource, CATEGORIES, REGIONS } from './types';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('tech');
  const [activeRegion, setActiveRegion] = useState<Region>('china');
  const [customKeywords, setCustomKeywords] = useState<string>('');
  const [items, setItems] = useState<TrendItem[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setItems([]);
    setSources([]);
    
    try {
      const result = await fetchTrends(activeCategory, activeRegion, customKeywords);
      setItems(result.trends);
      setSources(result.sources);
      setHasSearched(true);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch trends. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, activeRegion, customKeywords]);

  return (
    <Layout>
      {/* Control Panel */}
      <div className="mb-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col md:flex-row gap-6">
            
            <div className="space-y-5 flex-1">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">监控领域 (Category)</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`
                        flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                        ${activeCategory === cat.id 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-105' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'}
                      `}
                    >
                      <span>{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">数据源区域 (Region)</label>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map((reg) => (
                    <button
                      key={reg.id}
                      onClick={() => setActiveRegion(reg.id)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${activeRegion === reg.id 
                          ? 'bg-slate-800 text-white shadow-sm' 
                          : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}
                      `}
                    >
                      <span className="text-base">{reg.icon}</span>
                      {reg.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                  关键词定制 (Custom Keywords - Optional)
                </label>
                <input
                  type="text"
                  value={customKeywords}
                  onChange={(e) => setCustomKeywords(e.target.value)}
                  placeholder="输入特定公司、技术或话题 (例如: OpenAI, Sora, 自动驾驶)..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex flex-col justify-end md:w-56">
              <button
                onClick={handleFetch}
                disabled={isLoading}
                className={`
                  w-full h-14 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-3 transition-all
                  ${isLoading 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-200 hover:shadow-xl active:scale-95'}
                `}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>智能扫描中...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>获取今日热点</span>
                  </>
                )}
              </button>
              <p className="text-center text-xs text-slate-400 mt-2">
                由 Google Gemini Search Grounding 驱动
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Area */}
      <div className="space-y-8">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-center">
            {error}
          </div>
        )}

        {!hasSearched && !isLoading && !error && (
          <div className="text-center py-20 text-slate-400">
            <div className="mb-4 text-6xl opacity-20">📡</div>
            <h2 className="text-xl font-medium text-slate-600 mb-2">准备就绪</h2>
            <p>配置监控参数，点击"获取今日热点"生成您的专属 AI 日报</p>
          </div>
        )}

        {hasSearched && items.length === 0 && !isLoading && !error && (
            <div className="text-center py-20 text-slate-400">
                <p>未能找到相关数据，请尝试更换关键词或稍后重试。</p>
            </div>
        )}

        {/* Sources Bar */}
        {sources.length > 0 && (
          <div className="bg-slate-900 text-slate-300 rounded-xl p-4 overflow-hidden relative">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              已验证信息源 (Verified Sources)
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
                >
                  {source.title.length > 20 ? source.title.substring(0, 20) + '...' : source.title}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <TrendCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default App;