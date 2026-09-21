/**
 * Componente FiltroRiscoBar
 * Chips de filtro por nível de risco, com a contagem de cada faixa.
 */

import { Pressable, ScrollView, Text, View } from "react-native";

import type { FiltroRisco } from "@/src/types";

interface FiltroRiscoBarProps {
  valor: FiltroRisco;
  contagens: Record<FiltroRisco, number>;
  onChange: (filtro: FiltroRisco) => void;
}

const OPCOES: { valor: FiltroRisco; label: string }[] = [
  { valor: "todos", label: "Todos" },
  { valor: "alto", label: "Alto" },
  { valor: "medio", label: "Médio" },
  { valor: "baixo", label: "Baixo" },
];

export function FiltroRiscoBar({ valor, contagens, onChange }: FiltroRiscoBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
    >
      {OPCOES.map((opcao) => {
        const ativo = valor === opcao.valor;
        return (
          <Pressable
            key={opcao.valor}
            onPress={() => onChange(opcao.valor)}
            accessibilityRole="button"
            accessibilityLabel={`Filtrar por risco ${opcao.label}`}
            accessibilityState={{ selected: ativo }}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <View
              className={
                ativo
                  ? "px-3 py-2 rounded-full border border-primary bg-primary flex-row items-center gap-1"
                  : "px-3 py-2 rounded-full border border-border bg-surface flex-row items-center gap-1"
              }
            >
              <Text
                className={
                  ativo
                    ? "text-white text-sm font-semibold"
                    : "text-foreground text-sm font-semibold"
                }
              >
                {opcao.label}
              </Text>
              <Text className={ativo ? "text-white text-xs" : "text-muted text-xs"}>
                ({contagens[opcao.valor] ?? 0})
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
