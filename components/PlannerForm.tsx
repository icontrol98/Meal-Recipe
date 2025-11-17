
import React, { useState } from 'react';
import type { FormData } from '../types';
import { MENU_TYPES, DAYS_OF_WEEK, ALLERGENS } from '../constants';
import { SparklesIcon } from './icons/SparklesIcon';

interface PlannerFormProps {
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
}

const PlannerForm: React.FC<PlannerFormProps> = ({ onSubmit, isLoading }) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [day, setDay] = useState<string>(DAYS_OF_WEEK[new Date().getDay() -1] || DAYS_OF_WEEK[0]);
  const [menuType, setMenuType] = useState<string>('한식');
  const [ingredientConstraints, setIngredientConstraints] = useState<string>('');
  const [allergens, setAllergens] = useState<string[]>([]);
  const [nutritionGoals, setNutritionGoals] = useState<string>('1식당 칼로리 700kcal 내외, 단백질 30g 이상, 나트륨 800mg 이하');
  const [previousMenus, setPreviousMenus] = useState<string>('');

  const handleAllergenChange = (allergen: string) => {
    setAllergens(prev =>
      prev.includes(allergen)
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date,
      day,
      menuType,
      ingredientConstraints,
      allergens,
      nutritionGoals,
      previousMenus,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
      <div>
        <h2 className="text-xl font-bold text-gray-900">식단 조건 입력</h2>
        <p className="mt-1 text-sm text-gray-600">AI에게 필요한 정보를 알려주세요.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">날짜</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="day" className="block text-sm font-medium text-gray-700">요일</label>
          <select
            id="day"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="menuType" className="block text-sm font-medium text-gray-700">메인 메뉴 희망 유형</label>
        <select
          id="menuType"
          value={menuType}
          onChange={(e) => setMenuType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {MENU_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="ingredientConstraints" className="block text-sm font-medium text-gray-700">주요 식재료 제한/포함</label>
        <textarea
          id="ingredientConstraints"
          rows={2}
          value={ingredientConstraints}
          onChange={(e) => setIngredientConstraints(e.target.value)}
          placeholder="예: 돼지고기 사용 금지, 제철 채소 활용"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">알레르기 유발 식재료 제한</label>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ALLERGENS.map(allergen => (
            <div key={allergen} className="flex items-center">
              <input
                id={allergen}
                type="checkbox"
                checked={allergens.includes(allergen)}
                onChange={() => handleAllergenChange(allergen)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={allergen} className="ml-2 block text-sm text-gray-900">{allergen}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="nutritionGoals" className="block text-sm font-medium text-gray-700">영양 기준</label>
        <textarea
          id="nutritionGoals"
          rows={2}
          value={nutritionGoals}
          onChange={(e) => setNutritionGoals(e.target.value)}
          placeholder="예: 1식당 칼로리 700kcal 내외, 단백질 30g 이상"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="previousMenus" className="block text-sm font-medium text-gray-700">이전 식단 데이터 (중복 방지용)</label>
        <textarea
          id="previousMenus"
          rows={2}
          value={previousMenus}
          onChange={(e) => setPreviousMenus(e.target.value)}
          placeholder="최근 3~5일간의 메인 메뉴를 입력해주세요. 예: (월) 닭갈비, (화) 돈까스"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          <SparklesIcon />
          {isLoading ? '생성 중...' : '식단 생성하기'}
        </button>
      </div>
    </form>
  );
};

export default PlannerForm;
