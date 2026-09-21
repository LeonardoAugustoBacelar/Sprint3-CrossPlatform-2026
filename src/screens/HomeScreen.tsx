/**
 * Tela Home — Lista de Ocorrências
 *
 * Concentra os estados da listagem: carregando, erro, base vazia,
 * busca sem resultado e lista preenchida.
 */

import { useMemo, useState } from "react";
import { FlatList, Platform, Pressable, RefreshControl, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { CampoBusca } from "@/src/components/CampoBusca";
import { EstadoMensagem } from "@/src/components/EstadoMensagem";
import { FiltroRiscoBar } from "@/src/components/FiltroRiscoBar";
import { OcorrenciaCard } from "@/src/components/OcorrenciaCard";
import { SeletorCenario } from "@/src/components/SeletorCenario";
import { useApp } from "@/src/context/AppContext";
import type { FiltroRisco } from "@/src/types";
import { normalizarTexto } from "@/src/utils/texto";

// Sombra do botao flutuante: boxShadow no navegador, shadow*/elevation no dispositivo
const SOMBRA_FAB =
  Platform.OS === "web"
    ? { boxShadow: "0 4px 10px rgba(0,0,0,0.25)" }
    : {
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
      };

interface HomeScreenProps {
  onNovaOcorrencia: () => void;
  onSelecionarOcorrencia: (id: number) => void;
}

export function HomeScreen({ onNovaOcorrencia, onSelecionarOcorrencia }: HomeScreenProps) {
  const { ocorrencias, estado, erro, cenario, recarregar, trocarCenario } = useApp();
  const cores = useColors();

  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<FiltroRisco>("todos");

  const contagens = useMemo<Record<FiltroRisco, number>>(
    () => ({
      todos: ocorrencias.length,
      alto: ocorrencias.filter((item) => item.risco === "alto").length,
      medio: ocorrencias.filter((item) => item.risco === "medio").length,
      baixo: ocorrencias.filter((item) => item.risco === "baixo").length,
    }),
    [ocorrencias],
  );

  const filtradas = useMemo(() => {
    const termo = normalizarTexto(busca);
    return ocorrencias.filter((item) => {
      const atendeRisco = filtro === "todos" || item.risco === filtro;
      const atendeBusca =
        termo.length === 0 ||
        normalizarTexto(item.descricao).includes(termo) ||
        normalizarTexto(item.local).includes(termo);
      return atendeRisco && atendeBusca;
    });
  }, [ocorrencias, busca, filtro]);

  const carregandoInicial = estado === "carregando" && ocorrencias.length === 0;
  const listaDisponivel = estado === "pronto" && ocorrencias.length > 0;
  const emAberto = ocorrencias.filter((item) => item.status === "aberta").length;

  const limparFiltros = () => {
    setBusca("");
    setFiltro("todos");
  };

  const subtitulo = () => {
    if (carregandoInicial) return "Carregando registros...";
    if (estado === "erro") return "Não foi possível carregar os dados";
    if (ocorrencias.length === 0) return "Nenhum registro";
    return `${ocorrencias.length} ${ocorrencias.length === 1 ? "registro" : "registros"} · ${emAberto} em aberto`;
  };

  const conteudo = () => {
    if (carregandoInicial) {
      return (
        <EstadoMensagem
          carregando
          titulo="Carregando ocorrências"
          descricao="Consultando a base de dados simulada."
        />
      );
    }

    if (estado === "erro") {
      return (
        <EstadoMensagem
          icone="⚠️"
          titulo="Falha ao carregar as ocorrências"
          descricao={erro ?? undefined}
          acaoTitulo="Tentar novamente"
          onAcao={recarregar}
        />
      );
    }

    if (ocorrencias.length === 0) {
      return (
        <EstadoMensagem
          icone="📋"
          titulo="Nenhuma ocorrência registrada"
          descricao="Assim que uma ocorrência for registrada, ela aparece aqui."
          acaoTitulo="Registrar ocorrência"
          onAcao={onNovaOcorrencia}
        />
      );
    }

    if (filtradas.length === 0) {
      return (
        <EstadoMensagem
          icone="🔍"
          titulo="Nenhum resultado encontrado"
          descricao="Nenhuma ocorrência corresponde à busca ou ao filtro selecionado."
          acaoTitulo="Limpar filtros"
          onAcao={limparFiltros}
        />
      );
    }

    return (
      <FlatList
        data={filtradas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <OcorrenciaCard ocorrencia={item} onPress={() => onSelecionarOcorrencia(item.id)} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 96 }}
        refreshControl={
          <RefreshControl
            refreshing={estado === "carregando"}
            onRefresh={recarregar}
            tintColor={cores.primary}
            colors={[cores.primary]}
          />
        }
      />
    );
  };

  return (
    <ScreenContainer className="p-4">
      <View className="mb-4">
        <Text className="text-3xl font-bold text-foreground">Ocorrências</Text>
        <Text className="text-muted text-sm mt-1">{subtitulo()}</Text>
      </View>

      <SeletorCenario
        cenario={cenario}
        onTrocar={trocarCenario}
        desabilitado={estado === "carregando"}
      />

      {listaDisponivel ? (
        <View className="mb-3">
          <CampoBusca valor={busca} onChange={setBusca} />
          <View className="mt-3">
            <FiltroRiscoBar valor={filtro} contagens={contagens} onChange={setFiltro} />
          </View>
        </View>
      ) : null}

      <View className="flex-1">{conteudo()}</View>

      <Pressable
        onPress={onNovaOcorrencia}
        accessibilityRole="button"
        accessibilityLabel="Registrar nova ocorrência"
        style={({ pressed }) => ({
          position: "absolute",
          bottom: 24,
          right: 24,
          opacity: pressed ? 0.85 : 1,
          // O transform so e aplicado no toque: mante-lo fixo promove uma
          // camada de composicao que aparece como um quadrado branco atras do botao.
          ...(pressed ? { transform: [{ scale: 0.95 }] } : null),
        })}
      >
        <View
          className="w-14 h-14 bg-primary rounded-full items-center justify-center"
          style={SOMBRA_FAB}
        >
          <Text className="text-white text-3xl font-bold" style={{ lineHeight: 34 }}>
            +
          </Text>
        </View>
      </Pressable>
    </ScreenContainer>
  );
}
