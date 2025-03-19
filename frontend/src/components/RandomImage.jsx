import React from 'react';
import nvidiaImage from '../assets/Nvidia.png'; // 导入NVIDIA图片

const RandomImage = ({ message }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-500 p-6">
      <img 
        src={nvidiaImage} 
        alt="NVIDIA可持续发展报告" 
        className="w-full max-h-[400px] object-contain mb-4 rounded-lg shadow-md"
      />
      <p className="text-center font-medium">{message}</p>
      <p className="text-xs text-center mt-2 text-gray-400">文档合规检查系统 - 专注于可持续发展报告审计</p>
    </div>
  );
};

export default RandomImage; 