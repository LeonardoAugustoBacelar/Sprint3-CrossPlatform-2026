/**
 * Componente Button
 * Botão reutilizável com variantes primária, secundária e de perigo.
 *
 * Atenção: este projeto desativa o mapeamento de className em Pressable
 * (ver lib/_core/nativewind-pressable.ts, onde remapProps impede que a
 * className engula o onPress). Por isso o Pressable cuida apenas do toque
 * e a aparência fica em uma View interna.
 */

import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { cn } from "@/lib/utils";

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const CLASSES_VARIANTE = {
  primary: "bg-primary border border-primary",
  secondary: "bg-surface border border-border",
  danger: "bg-error border border-error",
} as const;

const CLASSES_TEXTO = {
  primary: "text-white font-semibold",
  secondary: "text-foreground font-semibold",
  danger: "text-white font-semibold",
} as const;

export function Button({
  onPress,
  title,
  variant = "primary",
  disabled = false,
  loading = false,
  className,
}: ButtonProps) {
  const inativo = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: inativo, busy: loading }}
      style={({ pressed }) => ({
        opacity: inativo ? 0.5 : pressed ? 0.85 : 1,
      })}
    >
      <View
        className={cn(
          "rounded-lg py-3 px-4 items-center justify-center",
          CLASSES_VARIANTE[variant],
          className,
        )}
      >
        {loading ? (
          <ActivityIndicator color={variant === "secondary" ? "#687076" : "#FFFFFF"} />
        ) : (
          <Text className={CLASSES_TEXTO[variant]}>{title}</Text>
        )}
      </View>
    </Pressable>
  );
}
