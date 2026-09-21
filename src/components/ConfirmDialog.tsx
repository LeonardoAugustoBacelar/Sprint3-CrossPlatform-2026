/**
 * Componente ConfirmDialog
 * Diálogo de confirmação em Modal do React Native.
 *
 * Substitui o Alert.alert nativo, que não renderiza botões no React Native Web:
 * este componente funciona igual em Android, iOS e navegador.
 */

import { Modal, Pressable, Text, View } from "react-native";

import { Button } from "./Button";

interface ConfirmDialogProps {
  visivel: boolean;
  titulo: string;
  mensagem: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  carregando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmDialog({
  visivel,
  titulo,
  mensagem,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  carregando = false,
  onConfirmar,
  onCancelar,
}: ConfirmDialogProps) {
  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={carregando ? undefined : onCancelar}
    >
      <Pressable
        onPress={carregando ? undefined : onCancelar}
        accessibilityLabel="Fechar diálogo"
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <Pressable onPress={() => {}} style={{ width: "100%", maxWidth: 380 }}>
          <View className="bg-background border border-border rounded-2xl p-5">
            <Text className="text-foreground text-lg font-bold mb-2">{titulo}</Text>
            <Text className="text-muted text-sm mb-5 leading-relaxed">{mensagem}</Text>

            <View className="gap-3">
              <Button
                title={textoConfirmar}
                onPress={onConfirmar}
                variant="danger"
                loading={carregando}
              />
              <Button
                title={textoCancelar}
                onPress={onCancelar}
                variant="secondary"
                disabled={carregando}
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
