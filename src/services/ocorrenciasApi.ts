/**
 * Camada de mock de dados (API simulada)
 *
 * Toda a aplicação conversa com este módulo como se fosse um backend real:
 * as funções são assíncronas, têm latência e podem falhar. Quando a API
 * verdadeira existir, basta trocar o corpo destas funções por chamadas HTTP —
 * nenhuma tela precisa ser alterada.
 *
 * O cenário ativo controla o comportamento simulado:
 * - sucesso: resposta normal (~600ms)
 * - vazio:   base sem registros, para exercitar o estado de lista vazia
 * - erro:    toda operação falha, para exercitar o estado de erro
 * - lento:   resposta em ~2,5s, para exercitar o estado de carregamento
 */

import { mockOcorrencias } from "@/src/data/mockOcorrencias";
import type { CenarioMock, FormOcorrencia, Ocorrencia } from "@/src/types";

/** Erro devolvido pela API simulada */
export class ErroApi extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "ErroApi";
  }
}

const ATRASOS: Record<CenarioMock, number> = {
  sucesso: 600,
  vazio: 500,
  erro: 800,
  lento: 2500,
};

const MENSAGEM_FALHA_REDE =
  "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";

let cenarioAtual: CenarioMock = "sucesso";
let banco: Ocorrencia[] = clonar(mockOcorrencias);

function clonar(lista: Ocorrencia[]): Ocorrencia[] {
  return lista.map((item) => ({ ...item }));
}

function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Aplica latência e, no cenário de erro, derruba a requisição */
async function simularRede(): Promise<void> {
  await esperar(ATRASOS[cenarioAtual]);
  if (cenarioAtual === "erro") {
    throw new ErroApi(MENSAGEM_FALHA_REDE);
  }
}

function ordenarPorDataDesc(lista: Ocorrencia[]): Ocorrencia[] {
  return [...lista].sort((a, b) => b.data.localeCompare(a.data));
}

function proximoId(): number {
  return banco.reduce((maior, item) => Math.max(maior, item.id), 0) + 1;
}

/** Cenário ativo no momento */
export function getCenario(): CenarioMock {
  return cenarioAtual;
}

/**
 * Troca o cenário e reinicia a base simulada.
 * O cenário "vazio" zera a base; os demais restauram os dados mockados.
 */
export function definirCenario(cenario: CenarioMock): void {
  cenarioAtual = cenario;
  banco = cenario === "vazio" ? [] : clonar(mockOcorrencias);
}

/** GET /ocorrencias */
export async function listarOcorrencias(): Promise<Ocorrencia[]> {
  await simularRede();
  return ordenarPorDataDesc(clonar(banco));
}

/** POST /ocorrencias */
export async function criarOcorrencia(dados: FormOcorrencia): Promise<Ocorrencia> {
  await simularRede();
  const nova: Ocorrencia = { ...dados, id: proximoId(), status: "aberta" };
  banco = [nova, ...banco];
  return { ...nova };
}

/** PUT /ocorrencias/:id */
export async function atualizarOcorrencia(
  id: number,
  dados: FormOcorrencia,
): Promise<Ocorrencia> {
  await simularRede();
  const indice = banco.findIndex((item) => item.id === id);
  if (indice === -1) {
    throw new ErroApi("Ocorrência não encontrada.");
  }
  const atualizada: Ocorrencia = { ...banco[indice], ...dados };
  banco = banco.map((item) => (item.id === id ? atualizada : item));
  return { ...atualizada };
}

/** DELETE /ocorrencias/:id */
export async function removerOcorrencia(id: number): Promise<void> {
  await simularRede();
  const existe = banco.some((item) => item.id === id);
  if (!existe) {
    throw new ErroApi("Ocorrência não encontrada.");
  }
  banco = banco.filter((item) => item.id !== id);
}

/** PATCH /ocorrencias/:id/status — alterna entre aberta e resolvida */
export async function alternarStatusOcorrencia(id: number): Promise<Ocorrencia> {
  await simularRede();
  const indice = banco.findIndex((item) => item.id === id);
  if (indice === -1) {
    throw new ErroApi("Ocorrência não encontrada.");
  }
  const atual = banco[indice];
  const atualizada: Ocorrencia = {
    ...atual,
    status: atual.status === "aberta" ? "resolvida" : "aberta",
  };
  banco = banco.map((item) => (item.id === id ? atualizada : item));
  return { ...atualizada };
}
