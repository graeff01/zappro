# ⚡ Guia Rápido - ZapPro Analyzer v2.0

## 🚀 Para Começar

### 1. Instalar dependências
```bash
npm install
```

### 2. Rodar em desenvolvimento
```bash
npm run dev
```

### 3. Abrir no navegador
```
http://localhost:5173
```

---

## 📁 Estrutura do Projeto

```
src/
├── components/      ← UI Components
├── hooks/          ← Custom Hooks
├── utils/          ← Helper Functions
├── constants/      ← App Constants
└── App.jsx         ← Main App (refatorado)
```

---

## 🎯 Como Usar a Aplicação

### Passo 1: Upload do Relatório ZAP (Obrigatório)
1. Clique no card "1. Relatório ZAP"
2. Selecione o arquivo Excel (.xlsx ou .xls)
3. Aguarde o processamento
4. Análise será gerada automaticamente

### Passo 2: Upload Relatório Leads (Opcional)
1. Clique no card "2. Relatório Leads"
2. Selecione o arquivo Excel
3. Dados de leads orgânicos serão integrados

### Passo 3: Upload Estoque (Opcional)
1. Clique no card "3. Estoque"
2. Selecione o arquivo Excel
3. Dados de dias em estoque serão adicionados

### Passo 4: Visualizar Análise
- Estatísticas gerais (cards no topo)
- Gráficos (pizza e barras)
- Plano de ação semanal
- Tabela completa de imóveis
- Insights estratégicos

### Passo 5: Exportar Relatório
1. Clique em "Exportar Relatório Excel"
2. Arquivo será baixado automaticamente
3. Contém resumo + todos os imóveis

### Passo 6: Nova Análise
1. Clique em "Fazer Nova Análise"
2. Volta para tela de upload
3. Histórico é preservado

---

## ⚙️ Configurações

### Ajustar Critérios de Classificação
1. Clique em "Configurações"
2. Altere os valores:
   - **Contatos para Alta Performance:** Mínimo para categoria A
   - **Contatos para Média Performance:** Mínimo para categoria B
   - **Dias sem atualização:** Alerta de desatualização
3. Análise recalcula automaticamente

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Verificar estrutura
ls -R src/
```

---

## 📊 Entendendo a Análise

### Categorias de Performance
- **🟢 TOP Performance (A):** ≥10 contatos (padrão)
- **🟡 Performance Média (B):** 3-9 contatos (padrão)
- **🔴 Baixa Performance (C):** <3 contatos

### Indicadores na Tabela
- **Tempo no Ar:** Dias desde criação do anúncio
- **Dias s/ Atualizar:**
  - 🟢 Verde: ≤15 dias
  - 🟡 Amarelo: 16-30 dias
  - 🔴 Vermelho: >30 dias
- **Fotos:**
  - 🟢 Verde: ≥15 fotos
  - 🟡 Amarelo: 10-14 fotos
  - 🔴 Vermelho: <10 fotos

---

## 🐛 Resolução de Problemas

### Erro ao fazer upload
- **Causa:** Arquivo inválido ou corrompido
- **Solução:** Verifique se é .xlsx ou .xls válido

### Análise não aparece
- **Causa:** Relatório ZAP não foi enviado
- **Solução:** Upload do relatório ZAP é obrigatório

### Campos faltando na tabela
- **Causa:** Relatórios opcionais não foram enviados
- **Solução:** Leads e Estoque são opcionais

### Build com erro
- **Causa:** Dependências não instaladas
- **Solução:** Execute `npm install`

---

## 📚 Documentação Completa

- **MELHORIAS.md** - Documentação técnica detalhada
- **TESTES.md** - Guia completo de testes
- **RESUMO_MELHORIAS.md** - Resumo executivo

---

## ✅ Checklist Rápido

- [ ] npm install
- [ ] npm run dev
- [ ] Acessar localhost:5173
- [ ] Upload relatório ZAP
- [ ] Verificar análise
- [ ] Exportar relatório
- [ ] Testar nova análise

---

## 🆘 Precisa de Ajuda?

1. Consulte `MELHORIAS.md` para detalhes técnicos
2. Veja `TESTES.md` para guia de testes
3. Verifique o console do navegador (F12)
4. Revise o código original em `src/App.original.jsx`

---

## 🎯 Principais Melhorias

- ✅ Código organizado em módulos
- ✅ Componentes reutilizáveis
- ✅ Hooks customizados
- ✅ Validações robustas
- ✅ Performance otimizada
- ✅ 100% funcionalidades preservadas

---

**Versão:** 2.0.0 (Refatorada)
**Status:** ✅ Pronto para uso
**Build:** ✅ Sucesso
