import React from "react";
import { StyleSheet, TextInput, View, TextInputProps } from "react-native";

type Props = {
  value?: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  style?: any;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoCorrect?: boolean;
  onBlur?: () => void;
  editable?: boolean;
};

export default function AppTextInput({
  value = "", // 👈 default seguro
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  style,
  autoCapitalize = "sentences",
  autoCorrect = true,
  onBlur,
  editable = true,
}: Props) {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        editable={editable}
        style={[styles.input, style]}
        placeholderTextColor="#8CA0AF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 0,
  },
  input: {
    height: 44,
    borderColor: "#E2EDF6",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#F2F8FD",
  },
});
