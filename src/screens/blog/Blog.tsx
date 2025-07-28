import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";

export default function Blog() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        5 factores clave a considerar antes de comenzar un proyecto de construcción
      </Text>
      <Text style={styles.intro}>
        Iniciar un proyecto de construcción, ya sea una vivienda, local comercial
        o instalación industrial, es una decisión que requiere planificación,
        experiencia y una visión clara desde el inicio. Una mala elección o una
        evaluación incompleta puede traducirse en sobrecostos, retrasos e incluso
        problemas legales. En este artículo te explicamos los 5 factores clave que
        debes considerar antes de comenzar cualquier obra, especialmente si buscas
        garantizar resultados de calidad, durabilidad y cumplimiento normativo.
      </Text>

      <Text style={styles.sectionTitle}>1. Asesoría profesional desde la etapa inicial</Text>
      <Text style={styles.paragraph}>
        Contar con un equipo especializado en asesoría en construcción te permite
        tomar decisiones informadas desde el principio. Un profesional capacitado
        puede ayudarte a:
      </Text>
      <Text style={styles.listItem}>• Evaluar la viabilidad técnica y legal del proyecto.</Text>
      <Text style={styles.listItem}>• Estimar costos reales de obra.</Text>
      <Text style={styles.listItem}>• Prevenir errores en diseño y ejecución.</Text>

      <Text style={styles.sectionTitle}>2. Estudio del terreno y permisos legales</Text>
      <Text style={styles.paragraph}>
        Antes de construir, es imprescindible realizar un estudio del terreno para
        conocer su resistencia, inclinación, tipo de suelo y riesgos asociados. A la
        par, debe iniciarse el proceso de permisos municipales o sectoriales según el
        tipo de proyecto. Esto incluye:
      </Text>
      <Text style={styles.listItem}>• Permiso de edificación.</Text>
      <Text style={styles.listItem}>• Declaraciones ambientales (si corresponde).</Text>
      <Text style={styles.listItem}>• Trámites de regularización o subdivisión.</Text>
      <Text style={styles.paragraph}>
        Ignorar estos aspectos puede detener tu obra o implicar multas costosas.
      </Text>

      <Text style={styles.sectionTitle}>3. Planificación detallada del proyecto</Text>
      <Text style={styles.paragraph}>
        Una obra sin planificación es un riesgo financiero. Todo proyecto debe contar
        con:
      </Text>
      <Text style={styles.listItem}>• Planos arquitectónicos y estructurales.</Text>
      <Text style={styles.listItem}>• Cronograma de ejecución.</Text>
      <Text style={styles.listItem}>• Presupuesto detallado por partidas.</Text>
      <Text style={styles.paragraph}>
        Una buena planificación permite anticipar contingencias y mantener el control
        de plazos y costos.
      </Text>

      <Text style={styles.sectionTitle}>4. Selección de materiales y proveedores confiables</Text>
      <Text style={styles.paragraph}>
        La elección de materiales influye directamente en la calidad, seguridad y vida
        útil de la obra. Es fundamental trabajar con:
      </Text>
      <Text style={styles.listItem}>• Proveedores confiables.</Text>
      <Text style={styles.listItem}>• Materiales certificados y con respaldo técnico.</Text>
      <Text style={styles.listItem}>• Sistemas constructivos acordes al tipo de uso.</Text>
      <Text style={styles.paragraph}>
        No siempre lo más barato es lo más conveniente. La durabilidad de tu proyecto
        depende en gran parte de la calidad de lo que se instala.
      </Text>

      <Text style={styles.sectionTitle}>5. Contratación de una empresa constructora con experiencia</Text>
      <Text style={styles.paragraph}>
        Finalmente, la ejecución debe estar en manos de una empresa que tenga experiencia
        comprobada en proyectos similares. Verifica:
      </Text>
      <Text style={styles.listItem}>• Obras anteriores y referencias.</Text>
      <Text style={styles.listItem}>• Capacidad técnica y profesional del equipo.</Text>
      <Text style={styles.listItem}>• Cumplimiento con normativas y seguridad laboral.</Text>
      <Text style={styles.paragraph}>
        Elegir una empresa comprometida garantiza una ejecución profesional, cumpliendo
        con los estándares exigidos y respetando el tiempo acordado.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  intro: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
    lineHeight: 24,
  },
  listItem: {
    fontSize: 16,
    color: "#555",
    marginLeft: 20,
    marginBottom: 5,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
