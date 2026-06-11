// ============================================================
// tools.js — Definición de herramientas del agente Marco
// IMACOMP — Soluciones en aire comprimido
// ============================================================
// Estas definiciones se envían a la API de Claude. Claude decide
// cuándo llamar cada herramienta. La ejecución real vive en handlers.js
// ============================================================

export const TOOLS = [
  {
    name: "calcular_consumo",
    description:
      "Calcula el consumo de aire comprimido proyectado a partir de las herramientas neumáticas Y/O " +
      "máquinas industriales que usará el cliente (llaves de impacto, pistolas de pintura incluidas " +
      "electrostáticas, arenadoras/granalladoras por tamaño de boquilla, prensas, envasadoras, sopladoras " +
      "PET, CNC, telares, sillones dentales, transporte neumático, etc.). Aplica factor de simultaneidad " +
      "SEGÚN LA INDUSTRIA del cliente (taller_automotriz, metalmecanica, pintura_acabados, " +
      "tratamiento_superficies, construccion, mineria, alimentos_bebidas, plasticos, farmaceutica, " +
      "dental_clinicas, textil, carpinteria_mueble) y factor de servicio estándar (1.30). " +
      "Devuelve CFM/l/min/m³min proyectado, presión requerida y alertas (oil-free, alta presión). " +
      "Úsala siempre que el cliente mencione qué equipos usará. Pasa la industria si la conoces.",
    input_schema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          description: "Lista de herramientas/máquinas que usará el cliente",
          items: {
            type: "object",
            properties: {
              nombre: { type: "string", description: "Nombre del equipo, ej: 'llave de impacto 1/2', 'pistola electrostática', 'arenadora boquilla 6mm', 'envasadora', 'sopladora PET'" },
              cantidad: { type: "number", description: "Cuántas unidades (default 1)" },
              consumo_cfm: { type: "number", description: "Opcional: consumo en CFM si el cliente lo conoce de su ficha técnica" },
              presion_bar: { type: "number", description: "Opcional: presión de trabajo si el cliente la conoce" },
            },
            required: ["nombre"],
          },
        },
        industria: { type: "string", description: "Industria/rubro del cliente para aplicar el factor de simultaneidad correcto, ej: 'taller_automotriz', 'mineria', 'alimentos_bebidas', 'dental_clinicas'" },
        factor_simultaneidad: { type: "number", description: "Opcional: si el cliente conoce su propio factor (0-1), ese manda" },
        factor_servicio: { type: "number", description: "Opcional: margen de seguridad (default 1.30)" },
      },
      required: ["items"],
    },
  },
  {
    name: "buscar_conocimiento",
    description:
      "Busca información técnica en la base de conocimiento de IMACOMP " +
      "(catálogos KRATTO, UNITED OSD-Hitachi, MAXTOP, manual RecondOil, casos de éxito). " +
      "Úsala SIEMPRE antes de dar datos técnicos de productos, especificaciones o casos. " +
      "No inventes especificaciones: si no las encuentras aquí, dilo.",
    input_schema: {
      type: "object",
      properties: {
        consulta: {
          type: "string",
          description: "Términos de búsqueda técnica, ej: 'compresor tornillo 50HP oil-free farmacéutica'",
        },
      },
      required: ["consulta"],
    },
  },
  {
    name: "recomendar_equipo",
    description:
      "Recomienda el compresor ideal entre las líneas KRATTO (PYME), UNITED OSD-Hitachi " +
      "(industrial premium) o MAXTOP (oil-free para farma/alimentos) según el caso de uso. " +
      "Llámala cuando tengas suficientes datos técnicos del cliente.",
    input_schema: {
      type: "object",
      properties: {
        caudal_requerido_cfm: { type: "number", description: "Caudal de aire requerido en CFM (o l/min si el cliente lo da así)" },
        presion_bar: { type: "number", description: "Presión de trabajo en bar" },
        horas_operacion_dia: { type: "number", description: "Horas de operación diarias" },
        industria: { type: "string", description: "Sector: ej. minería, alimentos, farma, metalmecánica, general" },
        requiere_oil_free: { type: "boolean", description: "true si la aplicación exige aire libre de aceite (farma/alimentos)" },
      },
      required: ["industria"],
    },
  },
  {
    name: "estimar_roi",
    description:
      "Estima el ahorro energético y el payback preliminar de modernizar o auditar el sistema " +
      "de aire comprimido. Conecta con el posicionamiento de auditoría ISO 11011. " +
      "Es un estimado preliminar, NO un compromiso de resultado.",
    input_schema: {
      type: "object",
      properties: {
        potencia_actual_hp: { type: "number", description: "Potencia instalada actual en HP" },
        horas_operacion_dia: { type: "number", description: "Horas de operación diarias" },
        dias_operacion_mes: { type: "number", description: "Días de operación al mes (default 26)" },
        costo_kwh_clp: { type: "number", description: "Costo de energía en CLP por kWh (default 150)" },
      },
      required: ["potencia_actual_hp", "horas_operacion_dia"],
    },
  },
  {
    name: "diagnostico_preliminar",
    description:
      "Genera un diagnóstico inicial de eficiencia/fugas a partir de síntomas reportados. " +
      "Sirve para justificar una auditoría formal ISO 11011. Llámala tras recoger síntomas " +
      "(caídas de presión, compresor que no para, fugas audibles, etc.).",
    input_schema: {
      type: "object",
      properties: {
        sintomas: {
          type: "array",
          items: { type: "string" },
          description: "Lista de síntomas reportados por el cliente",
        },
        antiguedad_equipo_anios: { type: "number", description: "Antigüedad aproximada del equipo en años" },
      },
      required: ["sintomas"],
    },
  },
  {
    name: "guardar_lead",
    description:
      "Guarda el lead calificado en el CRM con todo el contexto técnico recopilado. " +
      "Llámala SOLO cuando el cliente haya entregado al menos nombre y un dato de contacto " +
      "(email o teléfono) y muestre interés real. Confirma con el cliente antes de guardar.",
    input_schema: {
      type: "object",
      properties: {
        nombre: { type: "string" },
        empresa: { type: "string" },
        email: { type: "string" },
        telefono: { type: "string" },
        ciudad: { type: "string" },
        resumen_tecnico: {
          type: "string",
          description: "Resumen del caso: equipo recomendado, ROI estimado, diagnóstico, necesidad detectada",
        },
        nivel_interes: { type: "string", enum: ["frio", "tibio", "caliente"] },
      },
      required: ["nombre", "resumen_tecnico"],
    },
  },
  {
    name: "agendar_reunion",
    description:
      "Agenda una reunión técnica en Google Calendar. Llámala cuando el cliente acepte " +
      "una reunión y haya entregado su email. Propón horarios en horario hábil de Chile.",
    input_schema: {
      type: "object",
      properties: {
        nombre: { type: "string" },
        email: { type: "string" },
        fecha_hora_iso: { type: "string", description: "Fecha y hora propuesta en ISO 8601 (zona America/Santiago)" },
        tema: { type: "string", description: "Tema de la reunión, ej: 'Auditoría aire comprimido planta Quilicura'" },
      },
      required: ["nombre", "email", "fecha_hora_iso"],
    },
  },
];
