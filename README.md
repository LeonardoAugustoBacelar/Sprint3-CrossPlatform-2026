# Motiva — Aplicativo de Registro de Ocorrências

Aplicativo mobile em **React Native + Expo + TypeScript + NativeWind** para registro,
acompanhamento e tratativa de ocorrências de risco em ambientes de trabalho e em
operações de campo.

**Sprint 3 — Protótipo Funcional Completo.** Todos os fluxos previstos estão implementados
e navegáveis sobre uma camada de dados simulada que cobre sucesso, erro, lista vazia e
carregamento lento.

**Stack:** React Native 0.81 · Expo SDK 54 · React 19 · TypeScript 5.9 · NativeWind 4

---

## Índice

- [Como rodar](#como-rodar)
- [O que o app faz](#o-que-o-app-faz)
- [Status das funcionalidades](#status-das-funcionalidades)
- [Como os dados estão mockados](#como-os-dados-estão-mockados)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Decisões técnicas da Sprint 3](#decisões-técnicas-da-sprint-3)
- [Testes](#testes)
- [Pendências identificadas](#pendências-identificadas)
- [Plano de ajustes para a Sprint 4](#plano-de-ajustes-para-a-sprint-4)
- [Participantes](#participantes)

---

## Como rodar

**Pré-requisitos:** Node.js 18+, pnpm e um emulador Android/iOS ou o app Expo Go.

```bash
pnpm install     # instala as dependências
pnpm dev         # sobe o Metro (e o servidor de apoio do template)
```

Com o Metro no ar:

- `a` no terminal abre no emulador Android
- `i` abre no simulador iOS
- ler o QR Code com o Expo Go abre em dispositivo físico
- o app também roda no navegador, útil para inspeção rápida

Comandos auxiliares: `pnpm check` (typecheck), `pnpm lint`, `pnpm android`, `pnpm ios`.

---

## O que o app faz

### Lista de ocorrências (Home)

Listagem completa com contagem no cabeçalho, busca textual, filtro por nível de risco e
rolagem com *pull-to-refresh*. Cada card traz descrição, local, nível de risco, situação e
data. A tela trata cinco situações distintas: carregando, erro de carga, base vazia, busca
sem resultado e lista preenchida.

### Cadastro e edição

O mesmo formulário atende aos dois fluxos. Valida descrição (mínimo de 10 caracteres),
local, e data — que usa máscara progressiva e recusa datas inexistentes ou futuras.
Enquanto salva, o botão exibe estado de carregamento; se a gravação falhar, um aviso de
erro aparece no topo e os dados digitados são preservados.

### Detalhe e tratativa

Exibe o registro completo e concentra as ações: editar, alternar a situação entre *aberta*
e *resolvida*, e excluir. A exclusão passa por um diálogo de confirmação próprio.

### Simulação de cenários

Painel na Home que troca o comportamento da API simulada em tempo de execução, para
demonstrar os estados que dados estáticos nunca produziriam. Ver a seção seguinte.

---

## Status das funcionalidades

| Funcionalidade | Status | Observação |
|---|---|---|
| Listagem de ocorrências | ✅ Completo | Com contagem, rolagem e *pull-to-refresh* |
| Estado de carregamento | ✅ Completo | Indicador na carga inicial e na troca de cenário |
| Estado de erro com nova tentativa | ✅ Completo | Mensagem da API simulada e botão "Tentar novamente" |
| Estado de lista vazia | ✅ Completo | Distinto do estado de busca sem resultado |
| Busca textual | ✅ Completo | Por descrição e local, ignorando acentuação |
| Filtro por nível de risco | ✅ Completo | Chips com contagem por faixa |
| Cadastro de ocorrência | ✅ Completo | Com validação por campo e máscara de data |
| Edição de ocorrência | ✅ Completo | Formulário reaproveitado, já preenchido |
| Exclusão com confirmação | ✅ Completo | Diálogo próprio, funciona em Android, iOS e web |
| Alternar situação (aberta/resolvida) | ✅ Completo | Refletido na listagem |
| Detalhe da ocorrência | ✅ Completo | Todos os campos, com selos de risco e situação |
| Simulação de cenários de mock | ✅ Completo | Sucesso, lista vazia, erro e carregamento lento |
| Tema claro/escuro | ✅ Completo | Cores resolvidas por tema, inclusive nos selos |

---

## Como os dados estão mockados

A aplicação **não acessa `src/data/` diretamente**. Toda leitura e escrita passa por
`src/services/ocorrenciasApi.ts`, que se comporta como um backend: funções assíncronas,
com latência e possibilidade de falha. Quando a API real existir, basta trocar o corpo
dessas funções por chamadas HTTP — nenhuma tela precisa ser alterada.

```
src/data/mockOcorrencias.ts     base inicial (8 registros)
        ↓
src/services/ocorrenciasApi.ts  API simulada: latência, erros e cenários
        ↓
src/context/AppContext.tsx      estado global, carregamento e erro
        ↓
src/screens/*                   telas (não conhecem o serviço)
```

### Operações disponíveis

| Função | Equivale a | Comportamento |
|---|---|---|
| `listarOcorrencias()` | `GET /ocorrencias` | Devolve a lista ordenada por data decrescente |
| `criarOcorrencia(dados)` | `POST /ocorrencias` | Gera o id e grava com situação "aberta" |
| `atualizarOcorrencia(id, dados)` | `PUT /ocorrencias/:id` | Atualiza os campos editáveis |
| `removerOcorrencia(id)` | `DELETE /ocorrencias/:id` | Remove o registro |
| `alternarStatusOcorrencia(id)` | `PATCH /ocorrencias/:id/status` | Alterna entre aberta e resolvida |

### Cenários simulados

O painel **"Simulação de cenários"**, na Home, troca o comportamento da API em tempo de
execução. É o que torna demonstráveis os estados que uma base estática nunca produziria:

| Cenário | O que simula | Estado exercitado |
|---|---|---|
| **Sucesso** | Resposta normal em ~0,6 s | Lista preenchida |
| **Lista vazia** | Base sem nenhum registro | Estado vazio com chamada para ação |
| **Erro** | Falha de conexão em **todas** as operações | Erro de carga, erro ao salvar e erro ao excluir |
| **Lento** | Resposta em ~2,5 s | Indicador de carregamento |

Trocar de cenário reinicia a base simulada, o que também serve para voltar ao estado
inicial durante uma demonstração.

---

## Estrutura do projeto

```
motiva-app/
├── src/
│   ├── screens/
│   │   ├── AppNavigator.tsx       navegação condicional entre as telas
│   │   ├── HomeScreen.tsx         listagem, busca, filtro e estados
│   │   ├── FormularioScreen.tsx   cadastro e edição (mesma tela)
│   │   └── DetalheScreen.tsx      detalhe e ações sobre o registro
│   ├── components/
│   │   ├── Button.tsx             botão com variantes e estado de carregamento
│   │   ├── FormField.tsx          campo de formulário com rótulo, apoio e erro
│   │   ├── OcorrenciaCard.tsx     card da listagem
│   │   ├── RiscoBadge.tsx         selo de nível de risco
│   │   ├── StatusBadge.tsx        selo de situação
│   │   ├── ConfirmDialog.tsx      diálogo de confirmação em Modal
│   │   ├── EstadoMensagem.tsx     bloco de estado (carregando, erro, vazio)
│   │   ├── AvisoErro.tsx          faixa de erro em formulários
│   │   ├── CampoBusca.tsx         campo de busca
│   │   ├── FiltroRiscoBar.tsx     chips de filtro por risco
│   │   └── SeletorCenario.tsx     painel de simulação de cenários
│   ├── services/
│   │   └── ocorrenciasApi.ts      camada de mock (API simulada)
│   ├── context/
│   │   └── AppContext.tsx         estado global e orquestração das chamadas
│   ├── data/
│   │   └── mockOcorrencias.ts     base inicial
│   ├── utils/
│   │   ├── data.ts                formatação, validação e máscara de data
│   │   └── texto.ts               normalização para busca
│   └── types/
│       └── index.ts               modelagem TypeScript
├── app/                           rotas do expo-router (ponto de entrada)
├── components/                    componentes base do template
├── docs/
│   ├── TESTES-MANUAIS.md          documento de testes da Sprint 3
│   └── ROTEIRO-VIDEO.md           roteiro da demonstração
└── README.md
```

---

## Decisões técnicas da Sprint 3

**Continuamos em React Native.** Não houve migração para Flutter: a base da Sprint 2 já
estava em React Native com Expo e o esforço de reescrita não traria ganho dentro do escopo,
que é justamente consolidar o que já existia.

**A camada de dados virou assíncrona.** Sair de um array síncrono para um serviço com
`Promise`, latência e falhas obrigou as telas a tratarem carregamento e erro — que é o
comportamento real de um app conectado. A troca pela API verdadeira fica restrita a um
único arquivo.

**A mesma tela atende cadastro e edição.** Evita duplicar formulário, validação e
tratamento de erro; o modo é definido pela presença ou não de uma ocorrência recebida.

**A confirmação de exclusão não usa `Alert.alert`.** O `Alert` do React Native não
renderiza botões na web, o que deixava o fluxo de exclusão sem efeito no navegador. O
`ConfirmDialog` baseado em `Modal` se comporta igual nas três plataformas.

**Aparência fica em `View`, não em `Pressable`.** O template desativa o mapeamento de
`className` em `Pressable` (`lib/_core/nativewind-pressable.ts`) para impedir que a
className engula o `onPress`. Por isso os componentes interativos usam `Pressable` apenas
para o toque, com a aparência em uma `View` interna.

**Datas são tratadas como string.** `new Date("AAAA-MM-DD")` interpreta a data como UTC e,
em fuso negativo, exibe o dia anterior. A conversão para pt-BR é feita por manipulação de
string em `src/utils/data.ts`.

---

## Testes

O documento completo está em **[`docs/TESTES-MANUAIS.md`](docs/TESTES-MANUAIS.md)**: 8
casos de teste cobrindo os 5 fluxos principais e 3 complementares, com cenário testado,
resultado esperado, resultado obtido e status. Inclui também os 7 defeitos encontrados
durante a execução e corrigidos nesta Sprint.

Resultado da última execução: **8 casos, 8 aprovados, nenhum erro de console**.

---

## Pendências identificadas

1. **Sem persistência** — os dados vivem em memória e se perdem ao fechar o app.
2. **Sem API real** — a camada de serviço continua simulada.
3. **Sem autenticação** — não há login nem controle de acesso.
4. **Sem seletor de data nativo** — a data é digitada com máscara.
5. **Navegação por estado local** — sem *deep link* e sem integração com o botão voltar do Android.
6. **Barra de abas com uma única aba**.
7. **Sem anexo de foto** na ocorrência.
8. **Testes executados na build web** — falta a reexecução completa em emulador e dispositivo físico.
9. **Sem testes automatizados** no projeto.

---

## Plano de ajustes para a Sprint 4

| Prioridade | Ajuste | Por quê |
|---|---|---|
| 1 | Persistir as ocorrências com AsyncStorage | É a lacuna mais visível: hoje nada sobrevive ao fechamento do app. A dependência já está instalada. |
| 2 | Substituir a camada de mock por API real | O serviço já isola as chamadas; a troca fica contida em `ocorrenciasApi.ts`, mantendo os cenários para desenvolvimento. |
| 3 | Migrar a navegação para o expo-router | Habilita o botão voltar do Android, *deep links* e telas com URL própria. |
| 4 | Adicionar seletor de data nativo | Remove a fonte mais provável de erro de digitação no formulário. |
| 5 | Anexar foto à ocorrência | Evidência visual é o que mais falta ao registro em campo. |
| 6 | Criar a segunda aba (indicadores) | Dá sentido à barra de navegação e aproveita as contagens já calculadas. |
| 7 | Introduzir testes automatizados | O projeto já tem Vitest configurado; começar pelas regras de validação e pelo serviço. |

---

## Participantes

| Nome | RM |
|---|---|
| Alexandre Campão Fernandes Schneider Bertini | 563346 |
| Pedro Gabriel Mendes Soares Leite | 562242 |
| Leonardo Augusto Bacelar da Cunha | 565564 |
| Massayoshi Bando Fogaça e Silva | 561779 |
| Lucca Rosseto Rezende | 564180 |
| Guilherme Verrillo Peres | 563981 |

## Vídeo de demonstração

Sprint 3: (https://youtu.be/XHbd9FCyxZY?si=5YxOI14HAEfyeXwa)

---

Desenvolvido para a disciplina de Desenvolvimento Mobile — Sprint 3.
