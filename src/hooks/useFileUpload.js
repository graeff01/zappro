/**
 * Hook customizado para gerenciar upload de arquivos Excel
 */

import { useState, useCallback } from 'react';
import { readExcelFile } from '../utils/excelUtils';

/**
 * Hook para gerenciar upload e processamento de arquivos Excel
 * @param {Function} onSuccess - Callback executado ao sucesso
 * @param {Function} onError - Callback executado em caso de erro
 * @returns {Object} { data, loading, error, handleUpload, resetData }
 */
export const useFileUpload = (onSuccess, onError) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = useCallback(async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const jsonData = await readExcelFile(file);
      setData(jsonData);

      if (onSuccess) {
        onSuccess(jsonData);
      }
    } catch (err) {
      console.error('Erro ao fazer upload:', err);
      setError(err.message);

      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [onSuccess, onError]);

  const resetData = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    handleUpload,
    resetData
  };
};
