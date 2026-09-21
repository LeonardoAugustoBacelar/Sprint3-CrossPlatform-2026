/**
 * Componente StatusBadge
 * Indica se a ocorrência está aberta ou já foi resolvida.
 */

import { Text, View } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";
import type { StatusOcorrencia } from "@/src/types";

type Par = { fundo: string; texto: string };

const CORES: Record<StatusOcorrencia, { label: string; light: Par; dark: Par }> = {
  aberta: {
    label: "Aberta",
    light: { fundo: "#E0F2FE", texto: "#075985" },
    dark: { fundo: "#0C4A6E", texto: "#BAE6FD" },
  },
  resolvida: {
    label: "Resolvida",
    light: { fundo: "#E5E7EB", texto: "#374151" },
    dark: { fundo: "#374151", texto: "#E5E7EB" },
  },
};

interface StatusBadgeProps {
  status: StatusOcorrencia;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const esquema = useColorScheme() ?? "light";
  const definicao = CORES[status];
  const par = esquema === "dark" ? definicao.dark : definicao.light;
  const compacto = size === "sm";

  return (
    <View
      style={{
        backgroundColor: par.fundo,
        paddingVertical: compacto ? 4 : 6,
        paddingHorizontal: compacto ? 10 : 12,
        borderRadius: 999,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ color: par.texto, fontSize: compacto ? 12 : 13, fontWeight: "600" }}>
        {definicao.label}
      </Text>
    </View>
  );
}
