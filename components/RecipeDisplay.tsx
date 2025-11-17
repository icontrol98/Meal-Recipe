
import React, { useMemo } from 'react';
import type { IngredientInfo } from '../types';
import { AlertIcon } from './icons/AlertIcon';
import LoadingSpinner from './LoadingSpinner';

interface RecipeDisplayProps {
  recipeText: string;
  onFetchIngredientInfo: (ingredientsText: string) => void;
  ingredientInfo: IngredientInfo[] | null;
  isIngredientLoading: boolean;
  ingredientError: string;
}

const IngredientInfoDisplay: React.FC<{
  info: IngredientInfo[] | null;
  isLoading: boolean;
  error: string;
}> = ({ info, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="text-center p-4">
        <LoadingSpinner />
        <p className="mt-2 text-gray-600">실시간 재료 정보를 분석 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4">
        <strong className="font-bold">오류:</strong>
        <span className="block sm:inline ml-2">{error}</span>
      </div>
    );
  }

  if (!info) {
    return null;
  }

  const getStatusColor = (status: IngredientInfo['status']) => {
    switch (status) {
      case '원활': return 'bg-green-100 text-green-800';
      case '보통': return 'bg-yellow-100 text-yellow-800';
      case '부족': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mt-6">
       <h4 className="text-lg font-semibold text-gray-800 mb-2">🛒 AI 재료 수급 및 가격 분석</h4>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">재료명</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">예상 가격</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수급 현황</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">비고</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {info.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.price}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{item.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ 
  recipeText, 
  onFetchIngredientInfo,
  ingredientInfo,
  isIngredientLoading,
  ingredientError,
}) => {
  const { lines, allergens, ingredients } = useMemo(() => {
    const allLines = recipeText.split('\n').filter(line => line.trim() !== '');
    let allergenLine = '';
    let ingredientLines: string[] = [];
    let inIngredientSection = false;

    const filteredLines = allLines.filter(line => {
      if (line.trim().startsWith('⚠️ 알레르기 정보:')) {
        allergenLine = line;
        return false;
      }
      return true;
    });

    for (const line of filteredLines) {
        if (line.trim().startsWith('🛒 재료')) {
            inIngredientSection = true;
        } else if (inIngredientSection && (line.trim().startsWith('🧑‍🍳') || line.trim().startsWith('💡') || line.trim().startsWith('[메인 메뉴 레시피'))) {
            inIngredientSection = false;
        } else if (inIngredientSection && line.trim().startsWith('- ')) {
            ingredientLines.push(line.trim().substring(2));
        }
    }

    const allergens = allergenLine ? allergenLine.replace('⚠️ 알레르기 정보:', '').trim().split(',').map(a => a.trim()).filter(Boolean) : [];
    
    return { lines: filteredLines, allergens, ingredients: ingredientLines.join('\n') };
  }, [recipeText]);

  const handleFetchClick = () => {
    if (ingredients) {
      onFetchIngredientInfo(ingredients);
    }
  };

  const renderLine = (line: string, index: React.Key) => {
    line = line.trim();
    if (line.startsWith('🗓️')) {
      return <h2 key={index} className="text-2xl font-bold text-gray-800 mb-4">{line}</h2>;
    }
    if (line.startsWith('🍽️') || line.startsWith('🍲') || line.startsWith('🍚') || line.startsWith('🥬') || line.startsWith('🥗') || line.startsWith('🥤')) {
      return <p key={index} className="text-lg text-gray-700 mb-2">{line}</p>;
    }
    if (line.startsWith('[메인 메뉴 레시피')) {
      return <h3 key={index} className="text-xl font-bold text-blue-600 mt-6 mb-4 pt-4 border-t border-gray-200">{line.replace(/\[|\]/g, '')}</h3>;
    }
    if (line.startsWith('🔍') || line.startsWith('🥘') || line.startsWith('✨') || line.startsWith('📊') || line.startsWith('🛒') || line.startsWith('🧑‍🍳') || line.startsWith('💡')) {
      const parts = line.split(':');
      const title = parts[0];
      const content = parts.slice(1).join(':').trim();
      return (
        <div key={index} className="mt-5">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">{title}</h4>
          {content && <p className="text-gray-600 pl-2">{content}</p>}
        </div>
      );
    }
     if (line.startsWith('- ') || line.match(/^\d+\.\s/)) {
      return <li key={index} className="text-gray-600 list-inside ml-2">{line.replace(/^- |^\d+\.\s/, '')}</li>;
    }
    
    return <p key={index} className="text-gray-600 mb-1">{line}</p>;
  };

  return (
    <div className="prose max-w-none">
      {allergens.length > 0 && (
        <div className="p-3 mb-4 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg not-prose">
            <h4 className="font-bold text-orange-800 flex items-center"><AlertIcon />알레르기 주의 정보</h4>
            <div className="flex flex-wrap gap-2 mt-2">
                {allergens.map(allergen => (
                    <span key={allergen} className="px-2.5 py-1 text-sm font-medium text-orange-800 bg-orange-100 rounded-full">
                        {allergen}
                    </span>
                ))}
            </div>
        </div>
      )}

      {lines.map((line, index) => {
        const isListItem = line.trim().startsWith('- ') || line.trim().match(/^\d+\.\s/);
        const prevLineIsListItem = index > 0 && (lines[index - 1].trim().startsWith('- ') || lines[index - 1].trim().match(/^\d+\.\s/));
        
        if (isListItem && !prevLineIsListItem) {
          const listType = line.trim().startsWith('- ') ? 'ul' : 'ol';
          const listItems = [];
          for (let i = index; i < lines.length; i++) {
            const currentLine = lines[i].trim();
            if ( (listType === 'ul' && currentLine.startsWith('- ')) || (listType === 'ol' && currentLine.match(/^\d+\.\s/)) ) {
              listItems.push(currentLine);
            } else {
              break;
            }
          }
          const ListComponent = listType as React.ElementType;
          return (
            <ListComponent key={index} className={`mt-2 space-y-1 ${listType === 'ul' ? 'list-disc' : 'list-decimal'} list-inside pl-4`}>
              {listItems.map((item, itemIndex) => renderLine(item, `list-${index}-${itemIndex}`))}
            </ListComponent>
          );
        }

        if (isListItem && prevLineIsListItem) {
          return null;
        }
        
        return renderLine(line, index);
      })}

      {ingredients && (
         <div className="mt-8 pt-6 border-t border-gray-200 not-prose">
           <button
             onClick={handleFetchClick}
             disabled={isIngredientLoading}
             className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
           >
             🛒 실시간 재료 정보 조회 (AI 분석)
           </button>
           <IngredientInfoDisplay 
            info={ingredientInfo}
            isLoading={isIngredientLoading}
            error={ingredientError}
           />
         </div>
      )}
    </div>
  );
};

export default RecipeDisplay;
