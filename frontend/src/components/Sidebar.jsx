// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const links = [
    { to: "/load-file", text: "加载文件" },
    { to: "/chunk-file", text: "文件分块" },
    { to: "/parse-file", text: "文件解析" },
    { to: "/embedding", text: "文件嵌入" },
    { to: "/indexing", text: "向量数据库索引" },
    { to: "/search", text: "相似度搜索" },
    { to: "/generation", text: "生成" },
    { to: "/evaluation", text: "评估" }
  ];

  return (
    <div className="w-64 bg-gray-800 h-screen fixed left-0 top-0">
      <div className="p-4">
        <div className="bg-white rounded-lg p-3 mb-2">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/4388/4388286.png" 
            alt="合规检查系统Logo" 
            className="w-16 h-16 mx-auto mb-2"
          />
          <h1 className="text-center text-gray-800 font-bold text-lg">ESG合规审计系统</h1>
          <p className="text-center text-gray-500 text-xs">可持续发展报告检查工具</p>
        </div>
      </div>
      <nav>
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`block px-4 py-3 text-gray-300 hover:bg-gray-700 ${
              location.pathname === link.to ? 'bg-gray-700' : ''
            }`}
          >
            {link.text}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;