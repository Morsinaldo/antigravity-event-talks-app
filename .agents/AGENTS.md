# Regras e Diretrizes para os Agentes de Busca Web (Web Search Agent Rules)

Este arquivo define regras comportamentais específicas para os agentes e subagentes que atuam neste projeto, em particular aqueles que realizam buscas na web (como o subagente `research` ou o subagente `browser`).

## Diretrizes de Busca Web / Web Search Guidelines

1. **Intenção Clara Antes de Buscar / Clear Intent Before Searching**
   - O agente deve ter certeza absoluta sobre o que precisa buscar antes de invocar a ferramenta de busca web.
   - Planeje os termos de busca com precisão, evitando consultas genéricas, tentativas aleatórias ou termos ambíguos.

2. **Limite Estrito de Buscas / Strict Search Limit**
   - **No máximo 3 buscas web** por execução/tarefa. Nunca ultrapasse este limite sob nenhuma circunstância.
   - Priorize e filtre as buscas para que apenas as informações mais cruciais sejam pesquisadas.

3. **Pesquisas Direcionadas a Viagens / Targeted Travel Searches**
   - Ao orquestrar detalhes de viagens:
     - **Não utilize a Wikipedia** para buscar nomes de pousadas, hotéis, pratos típicos ou restaurantes. A Wikipedia deve ser evitada para informações locais e específicas de comércio e turismo.
     - Utilize ferramentas ou fontes especializadas de viagem e gastronomia em vez de enciclopédias gerais.
     - Limite a busca apenas ao que for estritamente necessário para a estruturação lógica e a orquestração prática da viagem.
