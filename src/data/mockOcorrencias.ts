/**
 * Dados mockados de ocorrências
 * Base de dados inicial consumida pela camada de serviço (src/services).
 * Nenhuma tela importa este arquivo diretamente: o acesso passa sempre
 * por ocorrenciasApi.ts, que simula latência e falhas de rede.
 */

import type { Ocorrencia } from "@/src/types";

export const mockOcorrencias: Ocorrencia[] = [
  {
    id: 1,
    descricao: "Queda de altura durante manutenção do piso 3",
    local: "Andar 3 - Setor de Produção",
    risco: "baixo",
    data: "2026-06-10",
    status: "aberta",
  },
  {
    id: 2,
    descricao: "Máquina de corte sem proteção de guarda de segurança",
    local: "Fábrica - Linha de Produção A",
    risco: "alto",
    data: "2026-06-09",
    status: "aberta",
  },
  {
    id: 3,
    descricao: "Vazamento de óleo no piso causando escorregão",
    local: "Garagem - Área de Manutenção",
    risco: "medio",
    data: "2026-06-08",
    status: "resolvida",
  },
  {
    id: 4,
    descricao: "Fio elétrico exposto na sala de servidores",
    local: "Sala de Servidores - Andar 2",
    risco: "alto",
    data: "2026-06-07",
    status: "aberta",
  },
  {
    id: 5,
    descricao: "Carga mal acondicionada em prateleira",
    local: "Almoxarifado - Bloco B",
    risco: "medio",
    data: "2026-06-06",
    status: "resolvida",
  },
  {
    id: 6,
    descricao: "Sinalização de obra derrubada na faixa de domínio",
    local: "Rodovia - km 32, pista sul",
    risco: "alto",
    data: "2026-06-05",
    status: "aberta",
  },
  {
    id: 7,
    descricao: "Equipe sem colete refletivo em serviço noturno",
    local: "Praça de Pedágio - Cabine 4",
    risco: "medio",
    data: "2026-06-04",
    status: "aberta",
  },
  {
    id: 8,
    descricao: "Extintor com carga vencida no posto de apoio",
    local: "Base Operacional - Almoxarifado",
    risco: "baixo",
    data: "2026-06-03",
    status: "resolvida",
  },
];
