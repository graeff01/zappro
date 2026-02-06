/**
 * Componente de Plano de Ação Semanal
 */

import React from 'react';

/**
 * Card de plano de ação semanal
 * @param {Object} props
 * @param {number} props.topCount - Quantidade de top performers
 * @param {number} props.mediumCount - Quantidade de performance média
 * @param {number} props.lowCount - Quantidade de baixa performance
 */
const ActionPlan = ({ topCount, mediumCount, lowCount }) => {
  const potentialOptimization = lowCount * 4;

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
      <h2 className="text-2xl font-bold mb-4">Plano de Ação desta Semana</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <p className="text-sm opacity-90 mb-1">Manter Ativos</p>
          <p className="text-3xl font-bold">{topCount}</p>
          <p className="text-xs opacity-75 mt-1">Alta performance - Continue investindo</p>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <p className="text-sm opacity-90 mb-1">Monitorar Próxima Semana</p>
          <p className="text-3xl font-bold">{mediumCount}</p>
          <p className="text-xs opacity-75 mt-1">Performance média - Avaliar em 7 dias</p>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <p className="text-sm opacity-90 mb-1">Pausar Agora</p>
          <p className="text-3xl font-bold">{lowCount}</p>
          <p className="text-xs opacity-75 mt-1">Baixa performance - Substituir urgente</p>
        </div>
      </div>
      <div className="mt-4 bg-white/10 backdrop-blur rounded-lg p-4">
        <p className="text-sm opacity-90">Potencial de Otimização:</p>
        <p className="text-2xl font-bold mt-1">
          +{potentialOptimization} contatos/mês
        </p>
        <p className="text-xs opacity-75 mt-1">
          Substituindo por imóveis com performance média de 4 contatos/mês
        </p>
      </div>
    </div>
  );
};

export default ActionPlan;
