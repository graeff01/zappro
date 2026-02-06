/**
 * Componente de Card para exibir estatísticas
 */

import React from 'react';

/**
 * Card de estatística
 * @param {Object} props
 * @param {string} props.label - Label da estatística
 * @param {string|number} props.value - Valor da estatística
 * @param {string} props.subtitle - Subtítulo opcional
 * @param {Object} props.icon - Componente do ícone
 * @param {string} props.iconColor - Cor do ícone
 */
const StatCard = ({ label, value, subtitle, icon: Icon, iconColor = 'text-blue-500' }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
      </div>
      <p className="text-3xl font-bold text-gray-800">
        {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
      </p>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
};

export default StatCard;
