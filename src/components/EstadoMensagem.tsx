/**
 * Componente EstadoMensagem
 * Bloco visual único para os estados não-felizes da aplicação:
 * carregando, erro, lista vazia e busca sem resultado.
 */

import { ActivityIndicator, Text, View } from "react-native";

import { useColors } from "@/hooks/use-colors";

import { Button } from "./Button";

interface EstadoMensagemProps {
  icone?: string;
  titulo: string;
  descricao?: string;
  carregando?: boolean;
  acaoTitulo?: string;
  onAcao?: () => void;
}

export function EstadoMensagem({
  icone,
  titulo,
  descricao,
  carregando = false,
  acaoTitulo,
  onAcao,
}: EstadoMensagemProps) {
  const cores = useColors();

  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      {carregando ? (
        <ActivityIndicator size="large" color={cores.primary} />
      ) : icone ? (
        <Text style={{ fontSize: 40 }}>{icone}</Text>
      ) : null}

      <Text className="text-foreground text-lg font-semibold text-center mt-4">{titulo}</Text>

      {descricao ? (
        <Text className="text-muted text-sm text-center mt-2 leading-relaxed">{descricao}</Text>
      ) : null}

      {acaoTitulo && onAcao ? (
        <View className="mt-6 w-full" style={{ maxWidth: 260 }}>
          <Button title={acaoTitulo} onPress={onAcao} variant="primary" />
        </View>
      ) : null}
    </View>
  );
}
