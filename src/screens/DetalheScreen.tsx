/**
 * Tela Detalhe — Visualização da Ocorrência
 *
 * Reúne as ações sobre um registro: editar, alternar status e excluir.
 * A exclusão passa por um diálogo de confirmação próprio (ConfirmDialog),
 * que funciona tanto no dispositivo quanto no navegador.
 */

import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { AvisoErro } from "@/src/components/AvisoErro";
import { Button } from "@/src/components/Button";
import { ConfirmDialog } from "@/src/components/ConfirmDialog";
import { EstadoMensagem } from "@/src/components/EstadoMensagem";
import { RiscoBadge } from "@/src/components/RiscoBadge";
import { StatusBadge } from "@/src/components/StatusBadge";
import { useApp } from "@/src/context/AppContext";
import { formatarDataBR } from "@/src/utils/data";

interface DetalheScreenProps {
  id: number;
  onVoltar: () => void;
  onEditar: () => void;
}

function Campo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <View className="mb-4 pb-4 border-b border-border">
      <Text className="text-muted text-xs uppercase tracking-wide mb-1">{rotulo}</Text>
      {children}
    </View>
  );
}

export function DetalheScreen({ id, onVoltar, onEditar }: DetalheScreenProps) {
  const { getOcorrenciaById, deleteOcorrencia, alternarStatus } = useApp();
  const ocorrencia = getOcorrenciaById(id);

  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [alterandoStatus, setAlterandoStatus] = useState(false);
  const [erroAcao, setErroAcao] = useState<string | null>(null);

  if (!ocorrencia) {
    return (
      <ScreenContainer className="p-4">
        <EstadoMensagem
          icone="🔎"
          titulo="Ocorrência não encontrada"
          descricao="O registro pode ter sido removido."
          acaoTitulo="Voltar para a lista"
          onAcao={onVoltar}
        />
      </ScreenContainer>
    );
  }

  const mensagemFalha = (falha: unknown, padrao: string) =>
    falha instanceof Error && falha.message ? falha.message : padrao;

  const handleExcluir = async () => {
    setExcluindo(true);
    setErroAcao(null);
    try {
      await deleteOcorrencia(ocorrencia.id);
      setConfirmacaoAberta(false);
      onVoltar();
    } catch (falha) {
      setConfirmacaoAberta(false);
      setErroAcao(mensagemFalha(falha, "Não foi possível excluir a ocorrência."));
    } finally {
      setExcluindo(false);
    }
  };

  const handleAlternarStatus = async () => {
    setAlterandoStatus(true);
    setErroAcao(null);
    try {
      await alternarStatus(ocorrencia.id);
    } catch (falha) {
      setErroAcao(mensagemFalha(falha, "Não foi possível atualizar o status."));
    } finally {
      setAlterandoStatus(false);
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mb-6 flex-row items-center">
          <Pressable
            onPress={onVoltar}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            hitSlop={8}
            style={({ pressed }) => ({ marginRight: 12, opacity: pressed ? 0.6 : 1 })}
          >
            <Text className="text-primary text-2xl font-semibold">←</Text>
          </Pressable>
          <Text className="text-2xl font-bold text-foreground">Detalhes</Text>
        </View>

        {erroAcao ? <AvisoErro mensagem={erroAcao} /> : null}

        <View className="bg-surface rounded-lg p-4 border border-border mb-6">
          <Campo rotulo="ID">
            <Text className="text-foreground font-semibold text-base">
              #{ocorrencia.id.toString().padStart(3, "0")}
            </Text>
          </Campo>

          <Campo rotulo="Descrição">
            <Text className="text-foreground text-base leading-relaxed">
              {ocorrencia.descricao}
            </Text>
          </Campo>

          <Campo rotulo="Local">
            <Text className="text-foreground text-base">📍 {ocorrencia.local}</Text>
          </Campo>

          <Campo rotulo="Data">
            <Text className="text-foreground text-base">
              📅 {formatarDataBR(ocorrencia.data)}
            </Text>
          </Campo>

          <Campo rotulo="Nível de Risco">
            <RiscoBadge risco={ocorrencia.risco} size="lg" />
          </Campo>

          <View>
            <Text className="text-muted text-xs uppercase tracking-wide mb-2">Situação</Text>
            <StatusBadge status={ocorrencia.status} size="md" />
          </View>
        </View>

        <View className="gap-3 mb-8">
          <Button title="Editar" onPress={onEditar} variant="primary" />
          <Button
            title={
              ocorrencia.status === "aberta" ? "Marcar como resolvida" : "Reabrir ocorrência"
            }
            onPress={handleAlternarStatus}
            loading={alterandoStatus}
            variant="secondary"
          />
          <Button
            title="Excluir"
            onPress={() => setConfirmacaoAberta(true)}
            variant="danger"
            disabled={alterandoStatus}
          />
        </View>
      </ScrollView>

      <ConfirmDialog
        visivel={confirmacaoAberta}
        titulo="Excluir ocorrência"
        mensagem="Esta ação não pode ser desfeita. Deseja realmente excluir este registro?"
        textoConfirmar="Excluir"
        carregando={excluindo}
        onConfirmar={handleExcluir}
        onCancelar={() => setConfirmacaoAberta(false)}
      />
    </ScreenContainer>
  );
}
