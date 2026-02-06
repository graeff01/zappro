/**
 * Componente de Card para Upload de Arquivos
 */

import React from 'react';
import { Upload } from 'lucide-react';

/**
 * Card de upload de arquivo
 * @param {Object} props
 * @param {string} props.title - Título do card
 * @param {string} props.description - Descrição do tipo de arquivo
 * @param {Function} props.onUpload - Função callback ao fazer upload
 * @param {boolean} props.loading - Estado de carregamento
 * @param {Object} props.data - Dados carregados (opcional)
 * @param {string} props.icon - Componente do ícone
 * @param {string} props.borderColor - Cor da borda
 * @param {string} props.iconColor - Cor do ícone
 * @param {string} props.loadingColor - Cor do loading
 * @param {string} props.successColor - Cor do sucesso
 */
const FileUploadCard = ({
  title,
  description,
  onUpload,
  loading,
  data,
  icon: Icon,
  borderColor = 'border-indigo-300 hover:border-indigo-500',
  iconColor = 'text-indigo-500',
  loadingColor = 'border-indigo-600',
  successColor = 'bg-indigo-50 text-indigo-800'
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className={`w-6 h-6 ${iconColor}`} />}
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>

      <label className={`flex flex-col items-center justify-center border-4 border-dashed ${borderColor} rounded-xl p-8 cursor-pointer transition-all`}>
        <Upload className={`w-16 h-16 ${iconColor} mb-3`} />
        <span className="text-lg font-semibold text-gray-700 mb-2">
          {title}
        </span>
        <span className="text-sm text-gray-500 text-center">
          {description}
        </span>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={onUpload}
          className="hidden"
        />
      </label>

      {loading && (
        <div className="mt-4 text-center">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-4 ${loadingColor} mx-auto`}></div>
          <p className="text-sm text-gray-600 mt-2">Processando...</p>
        </div>
      )}

      {data && !loading && (
        <div className={`mt-4 ${successColor} rounded-lg p-3`}>
          <p className="text-sm font-semibold">
            ✓ {data.length} {data.length === 1 ? 'imóvel carregado' : 'imóveis carregados'}
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUploadCard;
