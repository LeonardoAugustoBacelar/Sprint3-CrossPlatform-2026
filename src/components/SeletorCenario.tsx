/**
 * Componente SeletorCenario
 * Painel que troca o cenário da camada de mock em tempo de execução.
 *
 * Existe para tornar demonstráveis os estados que, com dados estáticos,
 * nunca apareceriam: falha de rede, base vazia e carregamento lento.
 */

import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import type { CenarioMock } from "@/src/types";

interface SeletorCenarioProps {
  cenario: CenarioMock;
  onTrocar: (cenario: CenarioMock) => void;
  desabilitado?: boolean;
}

const CENARIOS: { valor: CenarioMock; label: string; descricao: string }[] = [
  { valor: "sucesso", label: "Sucesso", descricao: "Resposta normal com registros" },
  { valor: "vazio", label: "Lista vazia", descricao: "Base sem nenhum registro" },
  { valor: "erro", label: "Erro", descricao: "Falha de conexão em toda operação" },
  { valor: "lento", label: "Lento", descricao: "Resposta em ~2,5s" },
];

export function SeletorCenario({ cenario, onTrocar, desabilitado = false }: SeletorCenarioProps) {
  const [aberto, setAberto] = useState(false);
  const atual = CENARIOS.find((item) => item.valor === cenario);

  return (
    <View className="bg-surface border border-border rounded-lg mb-3 overflow-hidden">
      <Pressable
        onPress={() => setAberto((valor) => !valor)}
        accessibilityRole="button"
        accessibilityLabel="Simulação de cenários de dados"
        accessibilityState={{ expanded: aberto }}
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      >
        <View className="flex-row items-center justify-between px-3 py-3">
          <View className="flex-row items-center gap-2 flex-1">
            <Text style={{ fontSize: 14 }}>🧪</Text>
            <Text className="text-foreground text-sm font-semibold">Simulação de cenários</Text>
            <Text className="text-muted text-xs">· {atual?.label}</Text>
          </View>
          <Text className="text-muted text-xs">{aberto ? "▲" : "▼"}</Text>
        </View>
      </Pressable>

      {aberto ? (
        <View className="px-3 pb-3 gap-2">
          <Text className="text-muted text-xs leading-relaxed mb-1">
            Troca o comportamento da API simulada para demonstrar todos os estados da tela.
          </Text>

          {CENARIOS.map((item) => {
            const ativo = item.valor === cenario;
            return (
              <Pressable
                key={item.valor}
                onPress={() => onTrocar(item.valor)}
                disabled={desabilitado}
                accessibilityRole="button"
                accessibilityLabel={`Cenário ${item.label}`}
                accessibilityState={{ selected: ativo, disabled: desabilitado }}
                style={({ pressed }) => ({ opacity: desabilitado ? 0.5 : pressed ? 0.8 : 1 })}
              >
                <View
                  className={
                    ativo
                      ? "border border-primary bg-background rounded-lg px-3 py-2"
                      : "border border-border bg-background rounded-lg px-3 py-2"
                  }
                >
                  <View className="flex-row items-center justify-between">
                    <Text
                      className={
                        ativo
                          ? "text-primary text-sm font-semibold"
                          : "text-foreground text-sm font-semibold"
                      }
                    >
                      {item.label}
                    </Text>
                    {ativo ? <Text className="text-primary text-xs">● ativo</Text> : null}
                  </View>
                  <Text className="text-muted text-xs mt-1">{item.descricao}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}
