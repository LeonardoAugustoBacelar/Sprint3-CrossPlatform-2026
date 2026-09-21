/**
 * AppNavigator
 * Navegação entre as telas da aplicação (navegação condicional com useState).
 *
 * Rotas: home → formulário (novo ou edição) → detalhe.
 */

import { useState } from "react";

import { useApp } from "@/src/context/AppContext";

import { DetalheScreen } from "./DetalheScreen";
import { FormularioScreen } from "./FormularioScreen";
import { HomeScreen } from "./HomeScreen";

type Tela = "home" | "formulario" | "detalhe";

export function AppNavigator() {
  const [tela, setTela] = useState<Tela>("home");
  const [idSelecionado, setIdSelecionado] = useState<number | null>(null);
  const [idEmEdicao, setIdEmEdicao] = useState<number | null>(null);

  const { getOcorrenciaById } = useApp();

  const irParaNovo = () => {
    setIdEmEdicao(null);
    setTela("formulario");
  };

  const irParaEdicao = (id: number) => {
    setIdEmEdicao(id);
    setTela("formulario");
  };

  const irParaDetalhe = (id: number) => {
    setIdSelecionado(id);
    setTela("detalhe");
  };

  const voltarParaHome = () => {
    setIdSelecionado(null);
    setIdEmEdicao(null);
    setTela("home");
  };

  // Ao salvar, volta para o detalhe quando era edição e para a home quando era cadastro
  const aoSalvar = () => {
    if (idEmEdicao !== null) {
      setIdSelecionado(idEmEdicao);
      setIdEmEdicao(null);
      setTela("detalhe");
      return;
    }
    voltarParaHome();
  };

  const aoCancelarFormulario = () => {
    if (idEmEdicao !== null) {
      setIdSelecionado(idEmEdicao);
      setIdEmEdicao(null);
      setTela("detalhe");
      return;
    }
    voltarParaHome();
  };

  if (tela === "formulario") {
    return (
      <FormularioScreen
        ocorrencia={idEmEdicao !== null ? getOcorrenciaById(idEmEdicao) : undefined}
        onSalvar={aoSalvar}
        onCancelar={aoCancelarFormulario}
      />
    );
  }

  if (tela === "detalhe" && idSelecionado !== null) {
    return (
      <DetalheScreen
        id={idSelecionado}
        onVoltar={voltarParaHome}
        onEditar={() => irParaEdicao(idSelecionado)}
      />
    );
  }

  return <HomeScreen onNovaOcorrencia={irParaNovo} onSelecionarOcorrencia={irParaDetalhe} />;
}
