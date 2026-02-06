/**
 * Componente de Painel de Configurações
 */

import React from 'react';

/**
 * Painel de configurações de critérios
 * @param {Object} props
 * @param {Object} props.criterios - Critérios atuais
 * @param {Function} props.onCriteriosChange - Callback ao alterar critérios
 */
const SettingsPanel = ({ criterios, onCriteriosChange }) => {
  const handleChange = (field, value) => {
    onCriteriosChange({
      ...criterios,
      [field]: parseInt(value) || 0
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Critérios de Classificação</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contatos para Alta Performance (A)
          </label>
          <input
            type="number"
            value={criterios.contatosAlto}
            onChange={(e) => handleChange('contatosAlto', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contatos para Média Performance (B)
          </label>
          <input
            type="number"
            value={criterios.contatosMedio}
            onChange={(e) => handleChange('contatosMedio', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dias sem atualização (alerta)
          </label>
          <input
            type="number"
            value={criterios.diasSemAtualizacao}
            onChange={(e) => handleChange('diasSemAtualizacao', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            min="1"
          />
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-3">
        Ajuste os critérios conforme sua estratégia de negócio
      </p>
    </div>
  );
};

export default SettingsPanel;
