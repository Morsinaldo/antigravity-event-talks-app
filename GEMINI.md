# Contexto de Desenvolvimento - TripOrchestrator

Este arquivo descreve o estado atual do projeto e todas as melhorias e correções que foram implementadas para orientar o próximo agente.

## 📌 Estado Atual
* **Branch Ativa**: `codex/secure-adk-travel-planner`
* **Status**: Todos os fluxos estão 100% corrigidos, estáveis e testados.

---

## 🛠️ Modificações Realizadas

### 1. Ajustes e Restrições de Busca nos Agentes (`trip_planner/agent.py`)
* Os prompts de sistema de todos os agentes especialistas (`location_agent`, `logistics_agent`, `cuisine_agent`, `events_agent` e `media_enrichment_agent`) foram reconfigurados para:
  - Enforcar o planejamento prévio e preciso da intenção de busca antes de realizar qualquer query.
  - Limitar estritamente o número de buscas (teto máximo de 3 chamadas por sessão).
  - Proibir expressamente o uso da Wikipedia para buscar nomes de pousadas/hotéis e pratos típicos (exigindo ferramentas especializadas como Google Places ou blogs de viagem).

### 2. Correção do Bug de Visualização do Histórico (`templates/index.html`)
* **Problema**: O carregamento de viagens salvas falhava e exibia "Erro de conexão ao carregar viagem" devido a um erro de referência do Leaflet JS (`L is not defined`) ao renderizar o mapa de rota.
* **Correção**: Adicionadas as referências CDN do Leaflet v1.9.4 (estilos CSS no `<head>` e script JS no rodapé) em `templates/index.html`. O histórico e mapa agora renderizam perfeitamente.

### 3. Exibição Detalhada no Console Stream (`trip_planner/agent.py`)
* As ferramentas do MCP foram instrumentadas nos hooks `_before_tool` e `_after_tool` para exibir logs ricos em tempo real no console de progresso da interface:
  - Formato: `[Nome do agente] -> [Skill de execução] -> [Tarefa sendo executada]`
  - Exibe a tarefa amigável em português (ex: buscando detalhes, clima, imagens ou pesquisando no Bing) e a duração em milissegundos após a conclusão.

### 4. Correção das Alucinações de Pousadas e Restaurantes (`trip_planner/mcp_server.py`)
* **Problema**: O servidor MCP rodava em um sub-processo Python isolado que não carregava o arquivo `.env`. Por isso, as requisições ao Google Places falhavam por falta de API Key (`PLACES_API_KEY=None`), fazendo os agentes alucinarem coordenadas e sites fictícios.
* **Correção**: Importado e executado o `load_dotenv()` no início do `mcp_server.py` para garantir que o sub-processo carregue a chave de API corretamente.

### 5. Correção do Clima Inoperante (`trip_planner/mcp_server.py`)
* **Problema**: O Open-Meteo Geocoding falhava caso o destino contivesse o sufixo do estado (ex: `"São Miguel do Gostoso, RN"`).
* **Correção**: Sanitizada a string de destino na função `fetch_destination_weather` para extrair apenas a cidade antes da vírgula.

---

## 🧪 Status das Validações
* **Testes do Backend (Python)**: `pytest` executado e todos os **48 testes passaram** com sucesso.
* **Testes do Frontend (Node.js)**: `node --test` executado e todos os **10 testes passaram** com sucesso.

## 🚀 Próximos Passos recomendados
1. Iniciar o servidor local usando:
   ```bash
   python app.py
   ```
2. Realizar testes livres no navegador em **http://127.0.0.1:5001** e acompanhar o Console Stream.
