/**
 * Componente FormField
 * Campo de formulário reutilizável, com rótulo, texto de apoio e erro.
 */

import { Text, TextInput, View, type TextInputProps } from "react-native";

import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

interface FormFieldProps extends TextInputProps {
  label: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export function FormField({
  label,
  hint,
  error,
  containerClassName,
  className,
  multiline,
  ...props
}: FormFieldProps) {
  const cores = useColors();

  return (
    <View className={cn("mb-4", containerClassName)}>
      <Text className="text-foreground font-semibold text-sm mb-2">{label}</Text>

      <TextInput
        placeholderTextColor={cores.muted}
        multiline={multiline}
        style={multiline ? { minHeight: 96, textAlignVertical: "top" } : undefined}
        className={cn(
          "border rounded-lg px-3 py-3 text-foreground bg-surface",
          error ? "border-error" : "border-border",
          className,
        )}
        {...props}
      />

      {error ? (
        <Text className="text-error text-xs mt-1">{error}</Text>
      ) : hint ? (
        <Text className="text-muted text-xs mt-1">{hint}</Text>
      ) : null}
    </View>
  );
}
