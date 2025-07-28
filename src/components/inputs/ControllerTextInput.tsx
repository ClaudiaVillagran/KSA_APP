import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";
import AppTextInput from "./AppTextInput";

const ControllerTextInput = ({
  control,
  name,
  rules,
  placeholder,
  secureTextEntry,
  keyboardType,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        // Hacer console.log aquí, en el lugar adecuado
        // console.log("error",error);

        return (
          <View style={styles.inputContainer}>
            <AppTextInput
              value={value}
              onChangeText={onChange}
              placeholder={placeholder}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              style={error ? styles.errorInput : undefined} // Estilo de error
            />
            {error && <Text style={styles.textError}>{error.message}</Text>}
          </View>
        );
      }}
    />
  );
};

export default ControllerTextInput;

const styles = StyleSheet.create({
  errorInput: {
    borderColor: "#B22222",
    borderWidth: 1,
  },
  textError: {
    color: "#B22222",
    fontSize: 17,
  },
  inputContainer:{
    width:"100%"
  }
});
