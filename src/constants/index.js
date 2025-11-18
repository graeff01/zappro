/**
 * Constantes centralizadas da aplicação ZapPro Analyzer
 */

// Cores para gráficos
export const CHART_COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

// Critérios padrão de classificação
export const DEFAULT_CRITERIOS = {
  contatosAlto: 10,
  contatosMedio: 3,
  diasSemAtualizacao: 30
};

// Limites de fotos para classificação
export const PHOTO_THRESHOLDS = {
  EXCELLENT: 15,
  GOOD: 10,
  MINIMUM: 1
};

// Limites de dias sem atualização
export const UPDATE_THRESHOLDS = {
  CRITICAL: 30,
  WARNING: 15,
  OK: 0
};

// Categorias de performance
export const PERFORMANCE_CATEGORIES = {
  TOP: {
    label: 'TOP Performance',
    color: 'bg-green-600',
    priority: 1
  },
  MEDIUM: {
    label: 'Performance Média',
    color: 'bg-yellow-500',
    priority: 2
  },
  LOW: {
    label: 'Baixa Performance',
    color: 'bg-red-600',
    priority: 3
  }
};

// Tipos de arquivo aceitos
export const ACCEPTED_FILE_TYPES = '.xlsx,.xls';

// Campos esperados nas planilhas
export const EXPECTED_FIELDS = {
  ZAP_REPORT: [
    'Tipo do anúncio',
    'Status do anúncio',
    'Total de visualizações',
    'Total de contatos',
    'Código do Imóvel',
    'Endereço',
    'Bairro',
    'Criação',
    'Última atualização',
    'Número de fotos',
    'Tipo do imóvel',
    'Valor de Venda'
  ],
  LEADS_REPORT: [
    'COD IMOVEL',
    'LEAD'
  ],
  ESTOQUE_REPORT: [
    'CÓDIGO',
    'DIAS EM ESTOQUE'
  ]
};

// Status de anúncios
export const AD_STATUS = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo'
};

// Tipos de anúncios
export const AD_TYPES = {
  STANDARD: 'Padrão'
};

// Configurações de histórico
export const HISTORY_CONFIG = {
  MAX_ITEMS: 10,
  DISPLAY_ITEMS: 4
};

// Mensagens de erro
export const ERROR_MESSAGES = {
  FILE_PROCESSING: 'Erro ao processar arquivo. Verifique se o formato está correto.',
  INVALID_DATA: 'Dados inválidos encontrados na planilha.',
  MISSING_FIELDS: 'Campos obrigatórios não encontrados na planilha.',
  GENERIC: 'Ocorreu um erro inesperado. Tente novamente.'
};

// Mensagens de sucesso
export const SUCCESS_MESSAGES = {
  FILE_LOADED: 'Arquivo carregado com sucesso!',
  REPORT_EXPORTED: 'Relatório exportado com sucesso!'
};

// Configurações de conversão de tempo
export const TIME_CONVERSION = {
  DAYS_IN_MONTH: 30,
  DAYS_IN_YEAR: 365,
  MS_IN_DAY: 86400000
};

// Data de epoch do Excel (para conversão de datas seriais)
export const EXCEL_EPOCH = new Date(1899, 11, 30);
