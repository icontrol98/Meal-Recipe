
import React, { useState, useCallback } from 'react';
import type { FormData, IngredientInfo } from './types';
import { generateMealPlan, generateIngredientInfo } from './services/geminiService';
import Header from './components/Header';
import PlannerForm from './components/PlannerForm';
import RecipeDisplay from './components/RecipeDisplay';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [recipe, setRecipe] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const [ingredientInfo, setIngredientInfo] = useState<IngredientInfo[] | null>(null);
  const [isIngredientLoading, setIsIngredientLoading] = useState<boolean>(false);
  const [ingredientError, setIngredientError] = useState<string>('');


  const handleGeneratePlan = useCallback(async (formData: FormData) => {
    setIsLoading(true);
    setError('');
    setRecipe('');
    setIngredientInfo(null);
    setIngredientError('');
    try {
      const result = await generateMealPlan(formData);
      setRecipe(result);
    } catch (e) {
      if (e instanceof Error) {
        setError(`레시피 생성 중 오류가 발생했습니다: ${e.message}`);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFetchIngredientInfo = useCallback(async (ingredientsText: string) => {
    setIsIngredientLoading(true);
    setIngredientError('');
    setIngredientInfo(null);
    try {
        const result = await generateIngredientInfo(ingredientsText);
        setIngredientInfo(result);
    } catch (e) {
        if (e instanceof Error) {
            setIngredientError(`재료 정보 조회 중 오류가 발생했습니다: ${e.message}`);
        } else {
            setIngredientError('알 수 없는 오류로 재료 정보 조회에 실패했습니다.');
        }
    } finally {
        setIsIngredientLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
          <div className="lg:pr-4">
            <PlannerForm onSubmit={handleGeneratePlan} isLoading={isLoading} />
          </div>
          <div className="mt-8 lg:mt-0 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 min-h-[600px] flex flex-col">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <LoadingSpinner />
                <p className="mt-4 text-lg font-medium text-gray-600">AI가 최고의 식단을 만들고 있어요...</p>
                <p className="text-sm text-gray-500">잠시만 기다려 주세요.</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full text-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                  <strong className="font-bold">오류 발생!</strong>
                  <span className="block sm:inline ml-2">{error}</span>
                </div>
              </div>
            ) : recipe ? (
              <RecipeDisplay 
                recipeText={recipe} 
                onFetchIngredientInfo={handleFetchIngredientInfo}
                ingredientInfo={ingredientInfo}
                isIngredientLoading={isIngredientLoading}
                ingredientError={ingredientError}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="mt-4 text-xl font-semibold">AI 급식 플래너</h2>
                <p className="mt-2 max-w-sm">왼쪽 양식을 작성하고 '식단 생성하기' 버튼을 누르면 AI가 맞춤 식단과 레시피를 제안해 드립니다.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
