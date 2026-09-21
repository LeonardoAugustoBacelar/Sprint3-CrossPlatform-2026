/**
 * Tela Formulário — Cadastro e Edição de Ocorrência
 *
 * A mesma tela atende aos dois fluxos: quando recebe uma ocorrência,
 * entra em modo de edição; sem ela, cadastra um novo registro.
 */

import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { AvisoErro } from "@/src/components/AvisoErro";
import { Button } from "@/src/components/Button";
import { FormField } from "@/src/components/FormField";
import { useApp } from "@/src/context/AppContext";
import type { NivelRisco, Ocorrencia } from "@/src/types";
import { aplicarMascaraData, dataNoFuturo, dataValida, hojeISO } from "@/src/utils/data";

interface FormularioScreenProps {
  ocorrencia?: Ocorrencia;
  onSalvar: () => void;
  onCancelar: () => void;
}

const NIVEIS: { valor: NivelRisco; label: string }[] = [
  { valor: "baixo", label: "Baixo" },
  { valor: "medio", label: "Médio" },
  { valor: "alto", label: "Alto" },
];

export function FormularioScreen({ ocorrencia, onSalvar, onCancelar }: FormularioScreenProps) {
  const { addOcorrencia, updateOcorrencia } = useApp();
  const edicao = Boolean(ocorrencia);

  const [descricao, setDescricao] = useState(ocorrencia?.descricao ?? "");
  const [local, setLocal] = useState(ocorrencia?.local ?? "");
  const [risco, setRisco] = useState<NivelRisco>(ocorrencia?.risco ?? "baixo");
  const [data, setData] = useState(ocorrencia?.data ?? hojeISO());

  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const validar = (): boolean => {
    const novosErros: Record<string, string> = {};

    if (!descricao.trim()) {
      novosErros.descricao = "Descrição é obrigatória";
    } else if (descricao.trim().length < 10) {
      novosErros.descricao = "Descreva o evento com pelo menos 10 caracteres";
    }

    if (!local.trim()) {
      novosErros.local = "Local é obrigatório";
    } else if (local.trim().length < 3) {
      novosErros.local = "Informe um local válido";
    }

    if (!data.trim()) {
      novosErros.data = "Data é obrigatória";
    } else if (!dataValida(data)) {
      novosErros.data = "Data inválida. Use o formato AAAA-MM-DD";
    } else if (dataNoFuturo(data)) {
      novosErros.data = "A data não pode ser futura";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = async () => {
    if (salvando) return;
    if (!validar()) return;

    setSalvando(true);
    setErroEnvio(null);

    const dados = {
      descricao: descricao.trim(),
      local: local.trim(),
      risco,
      data,
    };

    try {
      if (ocorrencia) {
        await updateOcorrencia(ocorrencia.id, dados);
      } else {
        await addOcorrencia(dados);
      }
      onSalvar();
    } catch (falha) {
      setErroEnvio(
        falha instanceof Error
          ? falha.message
          : "Não foi possível salvar a ocorrência. Tente novamente.",
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View className="mb-6 flex-row items-center">
          <Pressable
            onPress={onCancelar}
            disabled={salvando}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            hitSlop={8}
            style={({ pressed }) => ({ marginRight: 12, opacity: pressed ? 0.6 : 1 })}
          >
            <Text className="text-primary text-2xl font-semibold">←</Text>
          </Pressable>
          <Text className="text-2xl font-bold text-foreground">
            {edicao ? "Editar Ocorrência" : "Nova Ocorrência"}
          </Text>
        </View>

        {erroEnvio ? <AvisoErro mensagem={erroEnvio} /> : null}

        <FormField
          label="Descrição"
          placeholder="Descreva o evento..."
          value={descricao}
          onChangeText={setDescricao}
          multiline
          error={erros.descricao}
          hint="Mínimo de 10 caracteres"
          editable={!salvando}
        />

        <FormField
          label="Local"
          placeholder="Onde ocorreu?"
          value={local}
          onChangeText={setLocal}
          error={erros.local}
          editable={!salvando}
        />

        <View className="mb-4">
          <Text className="text-foreground font-semibold text-sm mb-2">Nível de Risco</Text>
          <View className="flex-row gap-2">
            {NIVEIS.map((nivel) => {
              const ativo = risco === nivel.valor;
              return (
                <Pressable
                  key={nivel.valor}
                  onPress={() => setRisco(nivel.valor)}
                  disabled={salvando}
                  accessibilityRole="button"
                  accessibilityLabel={`Risco ${nivel.label}`}
                  accessibilityState={{ selected: ativo }}
                  style={({ pressed }) => ({ flex: 1, opacity: pressed ? 0.85 : 1 })}
                >
                  <View
                    className={
                      ativo
                        ? "py-3 px-3 rounded-lg border border-primary bg-primary"
                        : "py-3 px-3 rounded-lg border border-border bg-surface"
                    }
                  >
                    <Text
                      className={
                        ativo
                          ? "text-center font-semibold text-sm text-white"
                          : "text-center font-semibold text-sm text-foreground"
                      }
                    >
                      {nivel.label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <FormField
          label="Data"
          placeholder="AAAA-MM-DD"
          value={data}
          onChangeText={(texto) => setData(aplicarMascaraData(texto))}
          keyboardType="number-pad"
          maxLength={10}
          error={erros.data}
          hint="Somente números: a máscara insere os hifens automaticamente"
          editable={!salvando}
        />

        <View className="gap-3 mt-6 mb-8">
          <Button
            title={edicao ? "Salvar alterações" : "Salvar"}
            onPress={handleSalvar}
            loading={salvando}
            variant="primary"
          />
          <Button
            title="Cancelar"
            onPress={onCancelar}
            variant="secondary"
            disabled={salvando}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
