/**
 * Componente OcorrenciaCard
 * Resumo de uma ocorrência na listagem.
 */

import { Pressable, Text, View } from "react-native";

import type { Ocorrencia } from "@/src/types";
import { formatarDataBR } from "@/src/utils/data";

import { RiscoBadge } from "./RiscoBadge";
import { StatusBadge } from "./StatusBadge";

interface OcorrenciaCardProps {
  ocorrencia: Ocorrencia;
  onPress: () => void;
}

export function OcorrenciaCard({ ocorrencia, onPress }: OcorrenciaCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ocorrência ${ocorrencia.descricao}`}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
        <Text className="text-foreground font-semibold text-base mb-2 leading-relaxed" numberOfLines={2}>
          {ocorrencia.descricao}
        </Text>

        <Text className="text-muted text-sm mb-3" numberOfLines={1}>
          📍 {ocorrencia.local}
        </Text>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <RiscoBadge risco={ocorrencia.risco} size="sm" />
            <StatusBadge status={ocorrencia.status} size="sm" />
          </View>
          <Text className="text-muted text-xs">{formatarDataBR(ocorrencia.data)}</Text>
        </View>
      </View>
    </Pressable>
  );
}
