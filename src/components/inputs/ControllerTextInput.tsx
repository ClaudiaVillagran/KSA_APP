import React from "react";
import { StyleSheet, Text, View, TextInputProps } from "react-native";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import AppTextInput from "./AppTextInput";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  rules?: any;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoCorrect?: boolean;
};

function ControllerTextInput<T extends FieldValues>({
  control,
  name,
  rules,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = "sentences",
  autoCorrect = true,
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={"" as any} // 👈 clave: evita undefined
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
        const safeValue = value == null ? "" : String(value); // 👈 siempre string

        return (
          <View style={styles.inputContainer}>
            <AppTextInput
              value={safeValue}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              autoCorrect={autoCorrect}
              style={error ? styles.errorInput : undefined}
            />
            {error && <Text style={styles.textError}>{String(error.message)}</Text>}
          </View>
        );
      }}
    />
  );
}

export default ControllerTextInput;

const styles = StyleSheet.create({
  errorInput: {
    borderColor: "#B22222",
    borderWidth: 1,
  },
  textError: {
    color: "#B22222",
    fontSize: 14,
    marginTop: 4,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 12,
  },
});
