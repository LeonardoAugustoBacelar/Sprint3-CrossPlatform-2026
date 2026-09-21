# Roteiro do vídeo de demonstração — Sprint 3

**Duração alvo:** 2min50s (limite de 3 minutos)
**Ambiente:** emulador Android ou dispositivo físico, com o app já aberto na Home
**Gravação:** tela do emulador, narração por cima

## Antes de gravar

1. Rodar `pnpm install` e `pnpm dev` com o emulador já aberto.
2. Abrir o app e deixar a lista carregada no cenário **Sucesso**.
3. Fechar o painel "Simulação de cenários" (ele é aberto durante a gravação).
4. Conferir que não há avisos vermelhos de erro na tela.
5. Gravar em uma tomada só; se errar, recomeçar — corte no meio chama atenção para o erro.

---

## Roteiro

### 0:00 – 0:15 · Abertura

> "Este é o Motiva, aplicativo de registro de ocorrências de risco, desenvolvido em React
> Native com Expo. Na Sprint 3 entregamos o protótipo funcional completo, com todos os
> fluxos navegáveis sobre uma camada de dados simulada."

Tela: Home carregada, com a lista visível.

### 0:15 – 0:45 · Listagem, busca e filtro

> "A tela inicial lista as ocorrências com nível de risco, situação e data. A busca ignora
> acentuação — procurando por 'pedagio' sem acento, o registro acentuado aparece. Os chips
> filtram por nível de risco e mostram a contagem de cada faixa."

Ações: rolar a lista até o último item · digitar `pedagio` na busca · limpar · tocar no
chip **Alto** · voltar para **Todos**.

### 0:45 – 1:20 · Cadastro com validação

> "O botão flutuante abre o cadastro. Salvando vazio, o formulário aponta cada campo
> obrigatório. A data tem máscara: digitamos só os números. Uma data futura é recusada.
> Com os dados corretos, o registro entra na lista."

Ações: tocar no **+** · tocar em **Salvar** com tudo vazio (mostrar os erros) · preencher
descrição e local · escolher risco **Alto** · digitar uma data futura e tentar salvar
(mostrar a recusa) · corrigir para uma data válida · **Salvar** · mostrar o item na lista.

### 1:20 – 1:50 · Detalhe, edição e tratativa

> "Tocando no card, abrimos o detalhe com todos os campos. Daqui dá para editar — o
> formulário já vem preenchido — e para marcar a ocorrência como resolvida."

Ações: tocar no card recém-criado · **Editar** · alterar a descrição · **Salvar
alterações** · **Marcar como resolvida** (mostrar o selo mudando).

### 1:50 – 2:10 · Exclusão com confirmação

> "A exclusão pede confirmação em um diálogo próprio, que funciona igual no Android, no iOS
> e no navegador."

Ações: **Excluir** · **Cancelar** (mostrar que nada acontece) · **Excluir** de novo ·
confirmar · voltar para a lista.

### 2:10 – 2:45 · Cenários de dados simulados

> "A camada de mock cobre os cenários completos da solução. Neste painel trocamos o
> comportamento da API simulada: lista vazia, erro de conexão — com mensagem e opção de
> tentar novamente — e resposta lenta, que exercita o estado de carregamento."

Ações: abrir **Simulação de cenários** · **Lista vazia** (mostrar o estado) · **Erro**
(mostrar a mensagem e tocar em **Tentar novamente**) · **Lento** (mostrar o indicador de
carregamento) · voltar para **Sucesso**.

### 2:45 – 2:55 · Fechamento

> "Para a Sprint 4 ficam a persistência local com AsyncStorage, a troca do mock pela API
> real e a migração da navegação para o expo-router. As pendências estão documentadas no
> README e no documento de testes."

---

## Checklist de publicação

- [ ] Vídeo com no máximo 3 minutos
- [ ] Subido no YouTube como **não listado**
- [ ] Link testado em uma janela anônima
- [ ] Link colado no README e no arquivo `.txt` de entrega
