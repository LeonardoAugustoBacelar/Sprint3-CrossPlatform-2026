# Documento de Testes Manuais — Sprint 3

**Projeto:** Motiva — Aplicativo de Registro de Ocorrências
**Sprint:** 3 — Protótipo Funcional Completo
**Data de execução:** 21/09/2026
**Ambiente:** Expo Web (React Native Web) sobre Chromium, viewport 414 × 896 (proporção de celular)
**Versão testada:** protótipo com camada de mock assíncrona e cenários simulados

> **Observação sobre o ambiente.** A bateria abaixo foi executada na build web do próprio
> projeto (`pnpm dev`, mesmo código-fonte das telas nativas), porque é o ambiente em que foi
> possível percorrer os fluxos de forma controlada e repetível. Os fluxos devem ser
> reexecutados no emulador Android antes da gravação do vídeo; a coluna *Resultado obtido*
> deve ser atualizada caso algum comportamento difira. Os pontos em que o comportamento
> nativo e o web comprovadamente divergem estão registrados na seção *Defeitos encontrados*.

---

## 1. Resumo da execução

| Total de casos | Passou | Falhou | Bloqueado |
|---------------:|-------:|-------:|----------:|
| 8 | 8 | 0 | 0 |

Erros de console registrados durante a execução: **nenhum**.
Nenhum travamento de tela, crash ou navegação interrompida foi observado.

Os 8 casos cobrem os 5 fluxos principais exigidos pela Sprint (listagem, cadastro,
detalhe, edição e exclusão) mais 3 fluxos complementares (busca/filtro, alternância de
situação e simulação de cenários de dados).

---

## 2. Casos de teste

### CT-01 — Abertura do app e carregamento da lista

| Campo | Conteúdo |
|---|---|
| **Cenário testado** | Abrir o aplicativo com a base simulada no cenário de sucesso e aguardar o carregamento da listagem. |
| **Resultado esperado** | Exibir o indicador de carregamento e, em seguida, os 8 registros mockados, cada um com descrição, local, nível de risco, situação e data formatada em pt-BR. |
| **Resultado obtido** | Indicador de carregamento exibido por aproximadamente 0,6 s; 8 cards renderizados; cabeçalho exibiu "8 registros · 5 em aberto". Datas exibidas corretamente (ex.: 10/06/2026). |
| **Status** | ✅ Passou |

### CT-02 — Busca textual e filtro por nível de risco

| Campo | Conteúdo |
|---|---|
| **Cenário testado** | Buscar por "pedagio" (sem acento), filtrar por risco Alto, provocar uma busca sem correspondência e limpar os filtros. |
| **Resultado esperado** | A busca deve ignorar acentuação; o filtro Alto deve reduzir a lista a 3 registros; uma busca sem correspondência deve exibir o estado "Nenhum resultado encontrado" com ação de limpar; limpar deve restaurar os 8 registros. |
| **Resultado obtido** | Busca "pedagio" retornou 1 resultado ("Praça de Pedágio - Cabine 4"), confirmando a normalização de acentos. Filtro Alto retornou 3 registros. Busca "zzzz" exibiu o estado vazio de busca. Botão "Limpar filtros" restaurou os 8 registros. |
| **Status** | ✅ Passou |

### CT-03 — Cadastro de nova ocorrência

| Campo | Conteúdo |
|---|---|
| **Cenário testado** | Abrir o formulário pelo botão flutuante, tentar salvar vazio, informar data futura, preencher os campos corretamente e salvar. |
| **Resultado esperado** | O envio vazio deve ser bloqueado com mensagens por campo; data futura deve ser recusada; a máscara deve converter dígitos em AAAA-MM-DD; após salvar, o app deve voltar à lista com o novo registro visível. |
| **Resultado obtido** | Envio vazio bloqueado com "Descrição é obrigatória" e "Local é obrigatório". Data "20991231" recusada com "A data não pode ser futura". Máscara converteu "20260615" em "2026-06-15". Após salvar, a lista passou a exibir 9 registros com a nova ocorrência no topo. |
| **Status** | ✅ Passou |

### CT-04 — Visualização do detalhe e edição

| Campo | Conteúdo |
|---|---|
| **Cenário testado** | Abrir o detalhe de uma ocorrência, acionar "Editar", alterar a descrição e salvar. |
| **Resultado esperado** | O detalhe deve exibir todos os campos do registro; o formulário de edição deve abrir preenchido; após salvar, o app deve voltar ao detalhe com o texto atualizado. |
| **Resultado obtido** | Detalhe exibiu ID (#009), descrição, local, data formatada (15/06/2026), nível de risco e situação. Formulário abriu com os valores preenchidos e o título "Editar Ocorrência". Após salvar, retornou ao detalhe com a descrição atualizada. |
| **Status** | ✅ Passou |

### CT-05 — Alternância da situação da ocorrência

| Campo | Conteúdo |
|---|---|
| **Cenário testado** | Na tela de detalhe, acionar "Marcar como resolvida". |
| **Resultado esperado** | O selo de situação deve passar de "Aberta" para "Resolvida" e o botão deve passar a oferecer a reabertura. |
| **Resultado obtido** | Selo alterado para "Resolvida" e botão alterado para "Reabrir ocorrência". A alteração também se reflete no card da listagem. |
| **Status** | ✅ Passou |

### CT-06 — Exclusão com diálogo de confirmação

| Campo | Conteúdo |
|---|---|
| **Cenário testado** | Acionar "Excluir", cancelar o diálogo, acionar novamente e confirmar. |
| **Resultado esperado** | O diálogo deve aparecer sobre a tela; "Cancelar" deve fechá-lo sem excluir; "Excluir" deve remover o registro e retornar à listagem. |
| **Resultado obtido** | Diálogo exibido com overlay escurecido. "Cancelar" fechou sem excluir. Após confirmar, o app retornou à listagem com 8 registros e o item removido deixou de aparecer. |
| **Status** | ✅ Passou |

### CT-07 — Simulação dos cenários de dados (vazio, erro e lento)

| Campo | Conteúdo |
|---|---|
| **Cenário testado** | Pelo painel "Simulação de cenários", alternar entre lista vazia, erro de conexão (incluindo "Tentar novamente") e carregamento lento. |
| **Resultado esperado** | Cada cenário deve exibir seu próprio estado de tela; o erro deve trazer a mensagem de falha e a ação de repetir; o cenário lento deve exibir o indicador de carregamento; ao voltar ao cenário de sucesso, a lista deve ser restaurada. |
| **Resultado obtido** | Cenário "Lista vazia" exibiu "Nenhuma ocorrência registrada" com ação de registrar. Cenário "Erro" exibiu "Falha ao carregar as ocorrências" com a mensagem "Não foi possível conectar ao servidor…"; o botão "Tentar novamente" refez a chamada e manteve o erro, como esperado enquanto o cenário estiver ativo. Cenário "Lento" exibiu o indicador por ~2,5 s e depois os 8 registros. |
| **Status** | ✅ Passou |

### CT-08 — Cancelamento de cadastro e rolagem da lista completa

| Campo | Conteúdo |
|---|---|
| **Cenário testado** | Preencher parcialmente o formulário, cancelar, e rolar a listagem até o último registro. |
| **Resultado esperado** | O cancelamento deve descartar o rascunho sem gravar; a lista deve rolar até o último item sem cortar registros. |
| **Resultado obtido** | O rascunho não foi gravado e a lista permaneceu com 8 registros. A rolagem exibiu o último item ("Extintor com carga vencida no posto de apoio"). |
| **Status** | ✅ Passou |

---

## 3. Defeitos encontrados durante os testes

Os defeitos abaixo foram identificados na execução desta Sprint e **corrigidos antes da
entrega**. Estão documentados porque explicam decisões de código e porque afetavam
diretamente o que o avaliador veria na demonstração.

| # | Defeito | Impacto observado | Correção aplicada |
|---|---|---|---|
| D-01 | O `tailwind.config.js` não incluía `./src` na lista de arquivos varridos, e é em `src/` que ficam todas as telas. | As classes usadas apenas em `src/` não eram geradas: cards sem fundo, selos de risco sem cor e botão de exclusão sem vermelho. | Glob `./src/**/*.{js,ts,tsx}` adicionado à configuração. |
| D-02 | O template desativa globalmente o mapeamento de `className` em `Pressable` (`remapProps(Pressable, { className: false })` em `lib/_core/nativewind-pressable.ts`, para impedir que a className engula o `onPress`). | Todo componente que estilizava um `Pressable` por `className` ficava sem estilo — botões, chips de filtro e botão flutuante apareciam como texto solto. | Os componentes passaram a usar `Pressable` apenas para o toque, com a aparência em uma `View` interna. |
| D-03 | A exclusão usava `Alert.alert`, que não renderiza botões no React Native Web. | No navegador, o botão "Excluir" não produzia efeito algum. | Substituído pelo componente `ConfirmDialog`, baseado em `Modal`, que funciona igual em Android, iOS e web. |
| D-04 | As datas eram convertidas com `new Date("AAAA-MM-DD")`, que interpreta a string como UTC. | Em fuso negativo (Brasil, UTC−3), a data exibida era um dia anterior à cadastrada. | Conversão passou a ser feita por manipulação de string em `src/utils/data.ts`. |
| D-05 | A listagem usava `FlatList` com `scrollEnabled={false}` dentro de um container sem rolagem. | A partir de cerca de 7 registros, a lista era cortada e não havia como rolar — justamente o que acontece ao cadastrar itens durante a demonstração. | A `FlatList` passou a ocupar a área disponível com rolagem própria e *pull-to-refresh*. |
| D-06 | O campo de data aceitava texto livre. | Digitar "10/06/2026" gerava "Invalid Date" no card e no detalhe. | Máscara progressiva de dígitos e validação de data existente e não futura. |
| D-07 | O botão flutuante mantinha um `transform` fixo, promovendo uma camada de composição. | Um quadrado branco aparecia atrás do botão circular. | O `transform` passou a ser aplicado somente durante o toque. |

---

## 4. Pendências conhecidas (entrada para a Sprint 4)

Itens que **não** funcionam nesta entrega e que são assumidos abertamente:

1. **Sem persistência.** Os dados vivem em memória: fechar o app restaura a base mockada. O `@react-native-async-storage/async-storage` já está no projeto, mas não é usado.
2. **Sem API real.** Toda a camada de dados é simulada em `src/services/ocorrenciasApi.ts`. A troca por chamadas HTTP não exige alteração nas telas, mas ainda não foi feita.
3. **Sem autenticação.** Não há login, perfis ou controle de acesso.
4. **Campo de data sem seletor nativo.** A entrada é por digitação com máscara; falta um *date picker*.
5. **Navegação por estado local.** O `AppNavigator` usa `useState` em vez do expo-router, o que impede *deep link* e botão físico de voltar no Android.
6. **Barra de abas com uma única aba.** A navegação inferior existe mas só tem "Home".
7. **Sem anexo de fotos.** O registro de ocorrência não permite evidência fotográfica.
8. **Testes executados em ambiente web.** Falta a reexecução completa no emulador Android e em dispositivo físico.
9. **Sem testes automatizados.** Não há suíte de testes de componente ou de integração no projeto.
