# Capturas Auténticas del Simulador Actual en Producción

Este directorio contiene capturas de pantalla directas tomadas de la versión actual de **Xolotl Capital** desplegada en producción (`https://xolotl-capital.com`).

---

## 1. Inventario de Capturas

| Archivo | Vista Representada | Plataforma / Resolución | Elementos Pedagógicos y Técnicos Visibles |
| :--- | :--- | :--- | :--- |
| [`01-dashboard-inicio-movil.jpeg`](01-dashboard-inicio-movil.jpeg) | Dashboard / Inicio | Móvil (785 × 1694 px) | Saldo patrimonial ($10,000 MXN), Racha de 13 días, Nivel Oro 9, tarjeta de evaluación reflexiva (*"Revisa tu decisión sobre GFINBURO - Resultado listo: primero evalúa tu razonamiento"*) y Diario de disciplina reflexiva (+15 XP). |
| [`02-mercados-cotizaciones-movil.jpeg`](02-mercados-cotizaciones-movil.jpeg) | Mercados Financieros | Móvil (784 × 1688 px) | Cotizaciones BMV/SIC en tiempo real, banner de interacción con el Tutor IA (+40 XP), listas curadas (FIBRAs, Líderes BMV), mayores variaciones del día y catálogo de 212 acciones. |
| [`03-detalle-activo-bimboa-movil.jpeg`](03-detalle-activo-bimboa-movil.jpeg) | Ficha de Activo (BIMBOA) | Móvil (782 × 1697 px) | Gráfica financiera avanzada (Línea / Velas, horizontes temporales), rangos de precio intradiario y 52 semanas, y botón de acción de compra vinculado a la intervención pedagógica. |
| [`04-dashboard-escritorio-responsive.png`](04-dashboard-escritorio-responsive.png) | Dashboard Web Responsive | Escritorio (3016 × 1708 px) | Adaptabilidad responsiva del código Flutter (mismo codebase para Web y Móvil), navegación lateral expandida y botón flotante de acceso al Tutor IA. |

---

## 2. Relevancia Metodológica y Evidencia Empírica

Estas capturas demuestran la evolución técnica y pedagógica documentada en el artículo:

1. **Maduración de la Intervención Pedagógica:** A diferencia del prototipo inicial donde la intervención era un simple modal de texto en cliente, la versión actual integra un ciclo reflexivo completo: evaluación previa del razonamiento antes de ver resultados, bitácora diaria de disciplina y tutor socrático adaptativo basado en IA.
2. **Arquitectura Multiplataforma Real (Flutter 3.x):** Se evidencia el diseño responsivo generado a partir de una única base de código para móvil y web, gobernada bajo los principios de diseño sobrio financiero (*anti-AI slop*) y contratos operativos (`AGENTS.md`).
3. **Integración de Mercado Real:** De un catálogo estático simulado de 15 tickers en el prototipo de abril, el simulador productivo opera con más de 212 instrumentos reales del mercado bursátil mexicano (BMV) y del Sistema Internacional de Cotizaciones (SIC).
