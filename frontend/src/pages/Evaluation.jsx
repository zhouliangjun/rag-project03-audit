import React, { useState, useEffect } from 'react';
import nvidiaImage from '../assets/Nvidia.png'; // 导入NVIDIA图片

const Evaluation = () => {
  const [file, setFile] = useState(null);
  const [collection, setCollection] = useState('');
  const [collections, setCollections] = useState([]);
  const [results, setResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [topK, setTopK] = useState(10);
  const [threshold, setThreshold] = useState(0.7);

  // 加载collections列表
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('http://localhost:8001/collections?provider=milvus');
        const data = await response.json();
        setCollections(data.collections);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchCollections();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file || !collection) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('collection_id', collection);
    formData.append('top_k', topK);
    formData.append('threshold', threshold);

    try {
      const response = await fetch('http://localhost:8001/evaluate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error during evaluation:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">评估</h2>
      
      <div className="grid grid-cols-12 gap-6">
        {/* 左侧面板 - 控制区 */}
        <div className="col-span-3 space-y-4">
          <div className="p-4 border rounded-lg bg-white shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">CSV文件</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">集合</label>
                <select
                  value={collection}
                  onChange={(e) => setCollection(e.target.value)}
                  className="block w-full p-2 border rounded"
                >
                  <option value="">选择集合...</option>
                  {collections.map(coll => (
                    <option key={coll.id} value={coll.id}>
                      {coll.name} ({coll.count} 文档)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Top K 结果数</label>
                <input
                  type="number"
                  value={topK}
                  onChange={(e) => setTopK(parseInt(e.target.value))}
                  min="1"
                  max="20"
                  className="block w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  相似度阈值: {threshold}
                </label>
                <input
                  type="range"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  min="0"
                  max="1"
                  step="0.1"
                  className="block w-full"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isProcessing || !file || !collection}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isProcessing ? '处理中...' : '评估'}
              </button>
            </div>
          </div>
        </div>

        {/* 右侧面板 - 结果区 */}
        <div className="col-span-9">
          {results && results.average_scores && (
            <div className="space-y-4">
              {/* 统计摘要 */}
              <div className="p-4 border rounded-lg bg-white shadow-sm">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold">统计摘要</h3>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600">平均命中分数</div>
                    <div className="text-xl font-bold">
                      {(results.average_scores.score_hit * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">已找到页面中正确页面的比例</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600">平均查找分数</div>
                    <div className="text-xl font-bold">
                      {(results.average_scores.score_find * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">已找到正确页面的比例</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-sm text-gray-600">总查询数</div>
                    <div className="text-xl font-bold">{results.total_queries}</div>
                  </div>
                </div>
              </div>

              {/* 详细结果 */}
              {results.results && results.results.length > 0 && (
                <div className="border rounded-lg bg-white shadow-sm">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-3">详细结果</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">要求</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">预期页码</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">找到页码</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">命中分数</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">查找分数</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">合规状态</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {results.results.map((result, idx) => (
                            <tr key={idx}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.id}</td>
                              <td className="px-6 py-4 text-sm text-gray-500">{result.requirement}</td>
                              <td className="px-6 py-4 text-sm text-gray-500">{result.expected_pages.join(', ')}</td>
                              <td className="px-6 py-4 text-sm text-gray-500">{result.found_pages.join(', ')}</td>
                              <td className="px-6 py-4 text-sm text-gray-500">{(result.score_hit * 100).toFixed(1)}%</td>
                              <td className="px-6 py-4 text-sm text-gray-500">{(result.score_find * 100).toFixed(1)}%</td>
                              <td className="px-6 py-4 text-sm text-gray-500">{result.compliance_status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {isProcessing && (
            <div className="text-center p-4">
              <div className="text-lg text-gray-600">正在处理评估...</div>
            </div>
          )}

          {!results && !isProcessing && (
            <div className="text-center p-4 border rounded-lg bg-white shadow-sm">
              <div className="mb-4">
                <img 
                  src={nvidiaImage}
                  alt="NVIDIA可持续发展报告" 
                  className="w-full max-h-[350px] object-contain rounded-lg shadow-sm"
                />
              </div>
              <div className="text-lg text-gray-600">
                上传CSV文件并配置评估参数以开始评估。
              </div>
              <div className="mt-2 text-sm text-gray-500">
                CSV文件格式需包含以下列：ID、Disclosure Requirement、Corresponding Text、Page Number、Compliance Status
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Evaluation; 