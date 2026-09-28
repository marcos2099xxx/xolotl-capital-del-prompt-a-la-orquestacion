# Fuentes y Metodología: Figura 2 (Procedimiento de Desarrollo Agéntico Reflexivo)

## 1. Qué Representa la Figura

La **Figura 2** representa la estructura cíclica e iterativa del procedimiento de desarrollo agéntico reflexivo formulado a partir de la experiencia de construcción de Xolotl Capital. Ilustra la interdependencia entre el razonamiento humano y la capacidad analítico-ejecutiva del agente de inteligencia artificial a lo largo de seis fases recurrentes:
1. Problematización
2. Exploración contextual
3. Planificación supervisada
4. Implementación delegada
5. Verificación reflexiva
6. Consolidación del conocimiento

El diagrama destaca visualmente que **el humano no es un simple solicitante de código vía prompts sueltos, sino el director del ciclo**, reservándose la delimitación del problema, la autorización previa del plan, la validación en dispositivos físicos y la gobernanza del contrato operativo (`AGENTS.md`). La flecha de retorno desde la Fase 6 hacia la Fase 1 formaliza el principio de que cada lección aprendida retroalimenta la base de conocimiento para las iteraciones posteriores.

---

## 2. Distinción Epistemológica de Fuentes

| Componente del Diagrama | Tipo de Fuente | Respaldo en el Repositorio |
|---|---|---|
| **Estructura de 6 Fases** | **Sistematización e interpretación de los autores** | Articulación conceptual del flujo documentado en `docs/system/AI_WORKFLOW.md` contrastado con el ciclo de aprendizaje experiencial de Kolb (1984). |
| **Acciones del Agente** | **Evidencia documental verificable** | Trazas de comandos de diagnóstico (`git status`, logs), consultas a grafos de código (MCP `codebase-memory`), consultas de documentación (MCP Context7) y suites de prueba automatizadas. |
| **Intervenciones Humanas** | **Evidencia documental + Reconstrucción retrospectiva** | Aprobaciones explícitas de planes (solicitudes de confirmación en IDE), pruebas manuales en dispositivos declaradas por el desarrollador y directrices de commit fijadas en `AGENTS.md`. |
| **Bucle de Retorno (`AGENTS.md`)** | **Evidencia documental verificable** | Crecimiento comprobado del archivo `AGENTS.md` (361 líneas) y de la bitácora `KNOWN_ISSUES.md`, donde cada incidencia resuelta engendra una nueva regla operativa. |

---

## 3. Formatos Disponibles

- `figura-2.svg`: Formato vectorial principal, diseñado con tipografías de sistema estándar (`Inter`, `sans-serif`), alto contraste y patrones diferenciados para legibilidad tanto a color como en escala de grises.
- `figura-2.png`: Renderizado rasterizado de alta resolución (300 DPI equivalente) para inclusión directa en manuscritos.
- `figura-2.mmd`: Especificación de código fuente abierto en formato Mermaid para reproducibilidad y renderizado alternativo.
