/**
 * Componente AvisoErro
 * Faixa de erro exibida dentro de formulários e telas de detalhe
 * quando uma operação de escrita falha.
 */

import { Text, View } from "react-native";

interface AvisoErroProps {
  mensagem: string;
}

export function AvisoErro({ mensagem }: AvisoErroProps) {
  return (
    <View className="border border-error rounded-lg px-3 py-3 mb-4 flex-row items-start gap-2">
      <Text style={{ fontSize: 14 }}>⚠️</Text>
      <Text className="text-error text-sm flex-1 leading-relaxed">{mensagem}</Text>
    </View>
  );
}
