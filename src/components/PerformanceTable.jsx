/**
 * Componente de Tabela de Performance de Imóveis
 */

import React from 'react';
import { FileSpreadsheet, Clock, Camera, AlertCircle } from 'lucide-react';
import { formatDaysToReadable } from '../utils/dateUtils';
import { UPDATE_THRESHOLDS, PHOTO_THRESHOLDS } from '../constants';

/**
 * Tabela de performance de imóveis
 * @param {Object} props
 * @param {Array} props.properties - Lista de imóveis
 * @param {Object} props.criterios - Critérios de classificação
 * @param {boolean} props.showLeads - Mostrar coluna de leads
 */
const PerformanceTable = ({ properties, criterios, showLeads = false }) => {
  /**
   * Determina a classe CSS baseada nos dias sem atualização
   */
  const getUpdateStatusClass = (days) => {
    if (days === null) return 'text-gray-400';
    if (days > UPDATE_THRESHOLDS.CRITICAL) return 'bg-red-100 text-red-700';
    if (days > UPDATE_THRESHOLDS.WARNING) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  /**
   * Determina a classe CSS baseada no número de fotos
   */
  const getPhotoStatusClass = (photos) => {
    if (photos >= PHOTO_THRESHOLDS.EXCELLENT) return 'text-green-600';
    if (photos >= PHOTO_THRESHOLDS.GOOD) return 'text-yellow-600';
    return 'text-red-600';
  };

  /**
   * Determina a classe CSS baseada no número de contatos
   */
  const getContactStatusClass = (contacts) => {
    if (contacts >= criterios.contatosAlto) return 'text-green-600';
    if (contacts >= criterios.contatosMedio) return 'text-yellow-600';
    return 'text-red-600';
  };

  /**
   * Determina a classe CSS baseada nos leads orgânicos
   */
  const getLeadsStatusClass = (leads) => {
    if (leads >= 5) return 'text-green-600';
    if (leads >= 2) return 'text-blue-600';
    return 'text-gray-400';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FileSpreadsheet className="w-6 h-6 text-indigo-600 mr-2" />
        Todos os Imóveis Patrocinados ({properties.length})
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Lista completa ordenada por performance - do melhor ao pior
      </p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Código</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Endereço</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Tempo no Ar ZAP</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Dias s/ Atualizar VISTA</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Fotos</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Views</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Contatos</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Tax. Conv.</th>
              {showLeads && (
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Leads Delivery.</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {properties.map((imovel, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${imovel.categoriaCor}`}>
                    {imovel.categoria}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{imovel.codigo}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{imovel.endereco}</td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                    <Clock className="w-4 h-4 text-blue-500" />
                    {formatDaysToReadable(imovel.diasDesdeAnuncio)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {imovel.diasSemAtualizacao !== null ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getUpdateStatusClass(imovel.diasSemAtualizacao)}`}>
                      {imovel.diasSemAtualizacao} dias
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center gap-1 text-sm font-medium ${getPhotoStatusClass(imovel.fotos)}`}>
                    <Camera className="w-4 h-4" />
                    {imovel.fotos}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-900">{imovel.views}</td>
                <td className="px-4 py-3 text-sm text-right">
                  <span className={`font-semibold ${getContactStatusClass(imovel.contatos)}`}>
                    {imovel.contatos}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-600">{imovel.taxaConversao}%</td>
                {showLeads && (
                  <td className="px-4 py-3 text-center">
                    <span className={`font-bold ${getLeadsStatusClass(imovel.leadsOrganicos)}`}>
                      {imovel.leadsOrganicos || 0}
                    </span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legenda */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm font-semibold text-gray-700 mb-3">Legenda:</p>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-blue-500" />
            <span><strong>Tempo no Ar:</strong> Dias desde criação do anúncio (ZAP)</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <AlertCircle className="w-4 h-4 text-orange-500" />
            <span><strong>Dias s/ Atualizar:</strong> Verde ≤15 | Amarelo ≤30 | Vermelho &gt;30</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Camera className="w-4 h-4" />
            <span><strong>Fotos:</strong> Verde ≥15 | Amarelo ≥10 | Vermelho &lt;10</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTable;
