# Procedimiento de Desarrollo Agéntico Reflexivo (Seis Fases)

> **Nota metodológica fundamental:** Este documento describe una **sistematización retrospectiva** derivada del análisis de las prácticas de desarrollo y supervisión humano-IA observadas a lo largo de la construcción de Xolotl Capital. **No se presenta ni debe interpretarse como un método universalmente validado mediante un diseño experimental controlado.**

---

## 1. Fundamentación y Marco Interpretativo

El procedimiento se conceptualiza a partir del **ciclo de aprendizaje experiencial de Kolb (1984)** y de los principios del aprendizaje basado en proyectos (Lavado-Anguera et al., 2024). En esta dinámica:
- El **desarrollador humano** funge como sujeto activo del aprendizaje, director técnico y tomador de decisiones.
- El **agente de IA** actúa como instrumento de exploración contextual, generación de alternativas, ejecución delegada y auditoría sistemática.

```
       [ 1. Problematización ]  <------------------------+
                  │                                      │
                  ▼                                      │
       [ 2. Exploración contextual ]                     │
                  │                                      │
                  ▼                                      │
       [ 3. Planificación supervisada ]                  │ (Cierre de ciclo /
                  │                                      │  Nueva iteración)
                  ▼                                      │
       [ 4. Implementación delegada ]                    │
                  │                                      │
                  ▼                                      │
       [ 5. Verificación reflexiva ]                     │
                  │                                      │
                  ▼                                      │
       [ 6. Consolidación del conocimiento ] ────────────+
          (Formalización en AGENTS.md)
```

---

## 2. Descripción Detallada de las Seis Fases

### Fase 1: Problematización
- **Propósito:** Identificar y caracterizar una necesidad, inconsistencia o falla técnica con base en evidencia concreta, evitando peticiones ambiguas de código.
- **Correspondencia con Kolb:** *Experiencia concreta humana.* El desarrollador experimenta una fricción real (ej. una orden pendiente que no se ejecuta, un warning de consola, una incongruencia visual).
- **Acción del agente:** Recolecta evidencias preliminares (mensajes de error, logs de ejecución, estado del repositorio) y caracteriza el problema sin aplicar modificaciones.
- **Intervención humana:** Delimita el problema, establece el alcance, descarta falsos positivos y prioriza la atención.

### Fase 2: Exploración contextual
- **Propósito:** Comprender a fondo las dependencias, contratos de interfaz y limitaciones del entorno antes de proponer cambios.
- **Correspondencia con Kolb:** *Observación reflexiva.* Se examina la situación desde múltiples perspectivas sin apresurar una solución reactiva.
- **Acción del agente:** Inspecciona el grafo de código (vía herramientas como `codebase-memory`), consulta documentación oficial actualizada (vía servidores MCP como Context7) y analiza configuraciones de infraestructura (`vercel.json`, `wrangler.toml`, esquemas SQL de Supabase).
- **Intervención humana:** Proporciona aclaraciones de contexto no documentadas, confirma restricciones de negocio y define qué áreas están fuera de los límites de exploración.

### Fase 3: Planificación supervisada
- **Propósito:** Articular hipótesis de solución evaluando alternativas técnicas, riesgos de regresión y compensaciones arquitectónicas.
- **Correspondencia con Kolb:** *Bisagra reflexiva-activa.* Al formular alternativas y seleccionar una estrategia, se plantea una hipótesis estructurada sobre cómo resolver el problema.
- **Acción del agente:** Genera un plan estructurado que desglosa cambios por componente, anticipa riesgos y propone un plan de verificación concreto.
- **Intervención humana:** Revisa el plan, exige modificaciones o ajustes de diseño, evalúa las compensaciones y **autoriza explícitamente** el inicio de la implementación. Ningún cambio de código comienza sin esta aprobación.

### Fase 4: Implementación delegada
- **Propósito:** Ejecutar las modificaciones de código y esquema estrictamente acotadas a las directrices autorizadas y a las restricciones operativas.
- **Correspondencia con Kolb:** *Experimentación activa.* Se pone a prueba la hipótesis técnica mediante la alteración controlada del entorno de software.
- **Acción del agente:** Edita archivos existentes o crea nuevos módulos, asegurando adherencia a convenciones (arquitectura por capas, sin generación de código oculta, manejo centralizado de errores, migraciones con timestamp).
- **Intervención humana:** Supervisa el progreso, resuelve consultas o bifurcaciones imprevistas que surjan durante la codificación y mantiene la disciplina sobre el alcance.

### Fase 5: Verificación reflexiva
- **Propósito:** Someter los cambios a pruebas rigurosas, objetivas y multinivel para confirmar la resolución del problema y la ausencia de regresiones.
- **Correspondencia con Kolb:** *Nueva experiencia concreta.* La hipótesis se valida empíricamente contra el comportamiento real del sistema.
- **Acción del agente:** Ejecuta suites de pruebas automatizadas (unitarias y de integración), comprobaciones de linter, análisis de cobertura, guards de tamaño de archivo y pruebas en navegador automatizadas (Playwright).
- **Intervención humana:** Realiza pruebas manuales en dispositivos físicos reales, audita el `git diff`, verifica la coherencia funcional y decide si el resultado satisface el estándar de calidad.

### Fase 6: Consolidación del conocimiento
- **Propósito:** Convertir la experiencia y las lecciones aprendidas en directrices permanentes para evitar la repetición de errores en sesiones futuras.
- **Correspondencia con Kolb:** *Conceptualización abstracta.* La resolución de la incidencia se abstrae y se formaliza como principio operativo perdurable.
- **Acción del agente:** Actualiza la documentación técnica del dominio correspondiente (`docs/`), registra el estado en la bitácora de problemas conocidos (`KNOWN_ISSUES.md`) y redacta propuestas de reglas operativas.
- **Intervención humana:** Aprueba la incorporación formal de nuevas restricciones o protocolos en `AGENTS.md`, transformando la memoria volátil de la sesión en el contrato operativo persistente del proyecto.

---

## 3. Clasificación Epistemológica

- **Categoría:** **Interpretación y sistematización realizada para el artículo.**
- **Fundamento:** Articulación reflexiva de prácticas de desarrollo registradas en el historial del proyecto Xolotl Capital, contrastadas con los marcos de aprendizaje experiencial de Kolb (1984) y desarrollo con agentes (Takerngsaksiri et al., 2025; Stray et al., 2025).
