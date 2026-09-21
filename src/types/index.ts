/**
 * Tipos TypeScript da aplicacao Motiva
 * Modelagem de dados - Sprint 3
 */

/** Nivel de risco da ocorrencia */
export type NivelRisco = "baixo" | "medio" | "alto";

/** Situacao de tratativa da ocorrencia */
export type StatusOcorrencia = "aberta" | "resolvida";

/**
 * Ocorrencia de risco em ambiente de trabalho
 *
 * @property id - Identificador unico
 * @property descricao - Descricao detalhada do evento
 * @property local - Local onde ocorreu
 * @property risco - Nivel de risco
 * @property data - Data do evento (ISO: YYYY-MM-DD)
 * @property status - Situacao da tratativa
 */
export type Ocorrencia = {
  id: number;
  descricao: string;
  local: string;
  risco: NivelRisco;
  data: string;
  status: StatusOcorrencia;
};

/** Campos preenchidos pelo usuario no formulario (cadastro e edicao) */
export type FormOcorrencia = Omit<Ocorrencia, "id" | "status">;

/** Valor do filtro de risco na listagem */
export type FiltroRisco = NivelRisco | "todos";

/**
 * Cenario simulado pela camada de mock.
 * Permite demonstrar todos os estados da aplicacao sem backend real.
 */
export type CenarioMock = "sucesso" | "vazio" | "erro" | "lento";

/** Estado de carregamento da listagem */
export type EstadoCarregamento = "carregando" | "pronto" | "erro";

/** Contrato do contexto global da aplicacao */
export type AppContextType = {
  ocorrencias: Ocorrencia[];
  estado: EstadoCarregamento;
  erro: string | null;
  cenario: CenarioMock;
  recarregar: () => Promise<void>;
  trocarCenario: (cenario: CenarioMock) => Promise<void>;
  addOcorrencia: (dados: FormOcorrencia) => Promise<void>;
  updateOcorrencia: (id: number, dados: FormOcorrencia) => Promise<void>;
  deleteOcorrencia: (id: number) => Promise<void>;
  alternarStatus: (id: number) => Promise<void>;
  getOcorrenciaById: (id: number) => Ocorrencia | undefined;
};
