import { useState, useEffect } from 'react';
import { RotateCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ApiStatus {
  name: string;
  url: string;
  key: string;
  model: string;
}

interface ApiStatusInfo {
  success: boolean;
  currentApi: ApiStatus;
  status: string;
  totalEndpoints: number;
}

export default function ApiRotator() {
  const [status, setStatus] = useState<ApiStatusInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/api-status');
        const data = await response.json();
        if (data.success) {
          setStatus(data);
        } else {
          setError(data.error || 'Failed to load API status');
        }
      } catch (err) {
        setError('API status endpoint not available');
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRotate = async () => {
    try {
      const response = await fetch('/api/api-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rotate' }),
      });
      const data = await response.json();
      if (data.success) {
        setStatus(data);
      }
    } catch (err) {
      setError('Failed to rotate API');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mx-4">
        <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-yellow-500">Loading API status...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg mx-4">
        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
        <span className="text-xs text-red-500">{error}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 px-4 pb-4">
      <div className="flex items-center justify-between bg-gray-500/5 border border-gray-500/10 rounded-lg p-3">
        <div className="flex items-center gap-3">
          <div className={`
            w-2.5 h-2.5 rounded-full
            ${status?.currentApi?.url ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}
          `} />
          <div>
            <div className="text-xs font-bold text-gray-300">API Status</div>
            <div className="text-[11px] text-gray-500">
              {status?.status || 'Unknown'}
            </div>
          </div>
        </div>
        <button
          onClick={handleRotate}
          className="p-2 hover:bg-gray-500/10 rounded-lg transition-colors"
          title="Rotate to next API"
        >
          <RotateCw className={`w-4 h-4 ${status?.totalEndpoints && status.totalEndpoints > 1 ? 'text-amber-500' : 'text-gray-600'}`} />
        </button>
      </div>
      {status?.currentApi && (
        <div className="bg-gray-500/3 rounded border border-gray-500/10 p-2 text-[10px] text-gray-500 font-mono overflow-x-auto">
          <div>URL: {status.currentApi.url}</div>
          <div>Model: {status.currentApi.model}</div>
          <div>Endpoint: {status.currentApi.name}</div>
        </div>
      )}
    </div>
  );
}