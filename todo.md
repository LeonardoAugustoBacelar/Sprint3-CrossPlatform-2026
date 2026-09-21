# Motiva App — Sprint 3 (Protótipo Funcional Completo)

## Fluxos da aplicação

- [x] Listagem de ocorrências com contagem no cabeçalho
- [x] Rolagem da lista completa e pull-to-refresh
- [x] Busca textual por descrição e local (ignorando acentuação)
- [x] Filtro por nível de risco com contagem por faixa
- [x] Cadastro de ocorrência com validação por campo
- [x] Máscara e validação de data (formato, data existente e não futura)
- [x] Edição de ocorrência reaproveitando o formulário de cadastro
- [x] Detalhe com todos os campos do registro
- [x] Alternância de situação (aberta ↔ resolvida)
- [x] Exclusão com diálogo de confirmação multiplataforma

## Camada de mock

- [x] Serviço assíncrono simulando API (latência, erro e ordenação)
- [x] Cenário de sucesso
- [x] Cenário de lista vazia
- [x] Cenário de erro de conexão em todas as operações
- [x] Cenário de carregamento lento
- [x] Painel para trocar o cenário em tempo de execução

## Estados de tela

- [x] Carregando
- [x] Erro com ação de tentar novamente
- [x] Lista vazia
- [x] Busca sem resultado (distinta da lista vazia)
- [x] Erro ao salvar e ao excluir, preservando os dados digitados

## Consistência visual

- [x] Corrigir o glob do Tailwind para varrer `src/`
- [x] Corrigir a estilização dos componentes interativos (className em View, não em Pressable)
- [x] Selos de risco e situação com cores próprias em tema claro e escuro
- [x] Componentes reutilizáveis para estado, erro, busca, filtro e diálogo

## Documentação

- [x] Documento de testes manuais (docs/TESTES-MANUAIS.md)
- [x] README com status por funcionalidade, pendências e plano da Sprint 4
- [x] Roteiro do vídeo de demonstração (docs/ROTEIRO-VIDEO.md)

## Entrega

- [ ] Reexecutar os testes no emulador Android e atualizar o documento
- [ ] Push do código no repositório do GitHub
- [ ] Gravar o vídeo de até 3 minutos
- [ ] Publicar no YouTube como não listado
- [ ] Preencher os links no arquivo ENTREGA-SPRINT3.txt

## Sprint 4 (planejado)

- [ ] Persistência local com AsyncStorage
- [ ] Integração com API real
- [ ] Navegação com expo-router
- [ ] Seletor de data nativo
- [ ] Anexo de foto na ocorrência
- [ ] Segunda aba de indicadores
- [ ] Testes automatizados
