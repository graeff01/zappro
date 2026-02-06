/**
 * Componente de Histórico de Análises
 */

import React from 'react';
import { Calendar } from 'lucide-react';
import { HISTORY_CONFIG } from '../constants';

/**
 * Histórico de análises realizadas
 * @param {Object} props
 * @param {Array} props.history - Lista de análises anteriores
 */
const AnalysisHistory = ({ history }) => {
  if (!history || history.length === 0) {
    return null;
  }

  const displayHistory = history.slice(0, HISTORY_CONFIG.DISPLAY_ITEMS);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2" />
        Histórico de Análises
      </h3>
      <div className="grid md:grid-cols-2 gap-3">
        {displayHistory.map((item, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-semibold text-gray-700">{item.data}</span>
              <span className="text-xs text-gray-500">{item.hora}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Ativos:</span>
                <p className="font-semibold">{item.totalPatrocinados}</p>
              </div>
              <div>
                <span className="text-gray-500">Contatos:</span>
                <p className="font-semibold">{item.totalContatos}</p>
              </div>
              <div>
                <span className="text-gray-500">Conv:</span>
                <p className="font-semibold">{item.taxaConversaoGeral}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisHistory;
