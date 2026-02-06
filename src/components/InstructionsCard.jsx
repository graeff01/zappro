/**
 * Componente de Card de Instruções
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Card com instruções de uso
 */
const InstructionsCard = () => {
  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
      <div className="flex items-start gap-3">
        <div className="bg-blue-500 text-white p-2 rounded-lg">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-blue-900 mb-2">💡 Como usar:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li><strong>1.</strong> Faça upload do <strong>Relatório ZAP</strong> (obrigatório)</li>
            <li><strong>2.</strong> Adicione o <strong>Relatório de Leads</strong> para ver leads orgânicos</li>
            <li><strong>3.</strong> Adicione o <strong>Estoque</strong> para análise completa de timing</li>
          </ol>
          <p className="text-xs text-blue-600 mt-2">
            Quanto mais dados, melhor a análise! 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstructionsCard;
