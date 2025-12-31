import { useState, useEffect } from 'react';
import { Activity, X } from 'lucide-react';

export default function PerformanceMonitor() {
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState({
    fps: 60,
    memory: 0,
    bundleTime: 0,
    renderTime: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate metrics (in real app, get from performance API)
      setMetrics({
        fps: Math.floor(55 + Math.random() * 10),
        memory: Math.floor(20 + Math.random() * 30),
        bundleTime: Math.floor(100 + Math.random() * 200),
        renderTime: Math.floor(10 + Math.random() * 20),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 bottom-52 p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-lg transition-colors z-40"
        title="Performance Monitor"
      >
        <Activity className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed right-4 bottom-52 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-40">
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Performance
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="p-3 space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">FPS</span>
            <span className={`font-mono ${metrics.fps >= 55 ? 'text-green-400' : 'text-yellow-400'}`}>
              {metrics.fps}
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${metrics.fps >= 55 ? 'bg-green-500' : 'bg-yellow-500'}`}
              style={{ width: `${(metrics.fps / 60) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Memory</span>
            <span className="text-blue-400 font-mono">{metrics.memory} MB</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${(metrics.memory / 100) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Bundle Time</span>
            <span className="text-purple-400 font-mono">{metrics.bundleTime}ms</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all"
              style={{ width: `${(metrics.bundleTime / 500) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Render Time</span>
            <span className="text-orange-400 font-mono">{metrics.renderTime}ms</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all"
              style={{ width: `${(metrics.renderTime / 50) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
