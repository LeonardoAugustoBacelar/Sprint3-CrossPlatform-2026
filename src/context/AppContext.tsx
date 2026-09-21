/**
 * AppContext
 * Estado global da aplicação.
 *
 * Responsável por consumir a camada de serviço (API simulada), expor o
 * resultado para as telas e manter os estados de carregamento e erro.
 * As telas não conhecem o serviço: falam apenas com este contexto.
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import * as api from "@/src/services/ocorrenciasApi";
import type {
  AppContextType,
  CenarioMock,
  EstadoCarregamento,
  FormOcorrencia,
  Ocorrencia,
} from "@/src/types";

const AppContext = createContext<AppContextType | undefined>(undefined);

function mensagemDeErro(erro: unknown): string {
  if (erro instanceof Error && erro.message) return erro.message;
  return "Ocorreu um erro inesperado. Tente novamente.";
}

function ordenar(lista: Ocorrencia[]): Ocorrencia[] {
  return [...lista].sort((a, b) => b.data.localeCompare(a.data));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [estado, setEstado] = useState<EstadoCarregamento>("carregando");
  const [erro, setErro] = useState<string | null>(null);
  const [cenario, setCenario] = useState<CenarioMock>(api.getCenario());

  const recarregar = useCallback(async () => {
    setEstado("carregando");
    setErro(null);
    try {
      const lista = await api.listarOcorrencias();
      setOcorrencias(lista);
      setEstado("pronto");
    } catch (falha) {
      setOcorrencias([]);
      setErro(mensagemDeErro(falha));
      setEstado("erro");
    }
  }, []);

  // Carga inicial da lista
  useEffect(() => {
    recarregar();
  }, [recarregar]);

  const trocarCenario = useCallback(
    async (novoCenario: CenarioMock) => {
      api.definirCenario(novoCenario);
      setCenario(novoCenario);
      // Zera a lista para que o estado de carregamento apareca de fato
      // ao trocar de cenario (importante no cenario "lento").
      setOcorrencias([]);
      await recarregar();
    },
    [recarregar],
  );

  const addOcorrencia = useCallback(async (dados: FormOcorrencia) => {
    const nova = await api.criarOcorrencia(dados);
    setOcorrencias((anteriores) => ordenar([nova, ...anteriores]));
  }, []);

  const updateOcorrencia = useCallback(async (id: number, dados: FormOcorrencia) => {
    const atualizada = await api.atualizarOcorrencia(id, dados);
    setOcorrencias((anteriores) =>
      ordenar(anteriores.map((item) => (item.id === id ? atualizada : item))),
    );
  }, []);

  const deleteOcorrencia = useCallback(async (id: number) => {
    await api.removerOcorrencia(id);
    setOcorrencias((anteriores) => anteriores.filter((item) => item.id !== id));
  }, []);

  const alternarStatus = useCallback(async (id: number) => {
    const atualizada = await api.alternarStatusOcorrencia(id);
    setOcorrencias((anteriores) =>
      anteriores.map((item) => (item.id === id ? atualizada : item)),
    );
  }, []);

  const getOcorrenciaById = useCallback(
    (id: number) => ocorrencias.find((item) => item.id === id),
    [ocorrencias],
  );

  const value: AppContextType = {
    ocorrencias,
    estado,
    erro,
    cenario,
    recarregar,
    trocarCenario,
    addOcorrencia,
    updateOcorrencia,
    deleteOcorrencia,
    alternarStatus,
    getOcorrenciaById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const contexto = useContext(AppContext);
  if (contexto === undefined) {
    throw new Error("useApp deve ser usado dentro de AppProvider");
  }
  return contexto;
}
