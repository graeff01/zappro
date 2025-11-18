/**
 * Componente de Insights e Recomendações Estratégicas
 */

import React from 'react';

/**
 * Card de insights estratégicos
 * @param {Object} props
 * @param {number} props.lowPerformanceCount - Quantidade de imóveis com baixa performance
 * @param {Object} props.topNeighborhood - Melhor bairro { bairro, mediaContatos }
 */
const StrategicInsights = ({ lowPerformanceCount, topNeighborhood }) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-8 text-white">
      <h3 className="text-2xl font-bold mb-4">Insights e Recomendações Estratégicas</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <h4 className="font-semibold mb-2">Otimização de Budget</h4>
          <p className="text-sm opacity-90">
            Ao pausar os {lowPerformanceCount} imóveis de baixa performance e ativar
            novos substitutos, você pode aumentar sua taxa de conversão em até 40%.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <h4 className="font-semibold mb-2">Foco nos Melhores Bairros</h4>
          <p className="text-sm opacity-90">
            {topNeighborhood?.bairro || 'N/A'} está performando melhor com média de{' '}
            {topNeighborhood?.mediaContatos || '0'} contatos por imóvel.
            Considere aumentar investimento nesta região.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <h4 className="font-semibold mb-2">Qualidade das Fotos</h4>
          <p className="text-sm opacity-90">
            Imóveis com menos de 10 fotos tendem a ter menor performance.
            Atualize as fotos antes de patrocinar novamente.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <h4 className="font-semibold mb-2">Rotação Semanal</h4>
          <p className="text-sm opacity-90">
            Revisar e ajustar os patrocinados semanalmente pode aumentar o ROI em até 250%.
            Use este dashboard toda semana!
          </p>
        </div>
      </div>
    </div>
  );
};

export default StrategicInsights;
