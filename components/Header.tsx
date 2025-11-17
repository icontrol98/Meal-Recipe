
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-5 md:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          <span className="text-blue-600">AI</span> 스마트 초등학교 급식 플래너
        </h1>
        <p className="mt-1 text-gray-500">
          초등학교 영양사를 위한 AI 기반 맞춤 식단 및 레시피 제안 서비스
        </p>
      </div>
    </header>
  );
};

export default Header;
