
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


// --- Sample Data (simulating a database fetch) ---
const QA_QUESTIONS = [
  // Módulo 1: Fundamentos de Pruebas (9 preguntas)
  {
    module: "Fundamentos de Pruebas",
    question: "Después de varias semanas ejecutando la misma suite de regresión automatizada, el equipo nota que ya no se encuentran nuevos bugs. ¿Qué principio de testing explica este fenómeno?",
    options: [
      "Las pruebas dependen del contexto.",
      "La paradoja del pesticida.",
      "Las pruebas demuestran la presencia de defectos.",
      "Agrupación de defectos (Defect clustering)."
    ],
    correctAnswer: "La paradoja del pesticida.",
    explanation: "La paradoja del pesticida establece que si se repiten los mismos tests una y otra vez, con el tiempo dejarán de encontrar nuevos defectos. Es necesario revisar y actualizar los casos de prueba para cubrir nuevas áreas y posibles fallos."
  },
  {
    module: "Fundamentos de Pruebas",
    question: "El equipo está desarrollando una aplicación de e-commerce. ¿Qué enfoque de pruebas sería más apropiado y por qué, según el principio 'Las pruebas dependen del contexto'?",
    options: [
      "Probar la aplicación de la misma forma que un sistema de control aéreo, con un 100% de cobertura de código.",
      "Enfocarse principalmente en pruebas de rendimiento y seguridad, ya que son las más críticas para cualquier aplicación web.",
      "Priorizar las pruebas en los flujos de compra, la integración con pasarelas de pago y la compatibilidad en navegadores móviles.",
      "Aplicar únicamente pruebas unitarias, ya que son las más rápidas y baratas de ejecutar."
    ],
    correctAnswer: "Priorizar las pruebas en los flujos de compra, la integración con pasarelas de pago y la compatibilidad en navegadores móviles.",
    explanation: "El contexto de una tienda online implica riesgos financieros y de reputación si el flujo de compra falla. Por ello, se deben priorizar las áreas que impactan directamente al usuario y al negocio."
  },
  {
    module: "Fundamentos de Pruebas",
    question: "En producción, el 80% de los errores reportados por los usuarios se concentran en el módulo de 'Gestión de Perfil'. ¿Qué principio de testing sugiere que este es un comportamiento esperado?",
    options: [
      "La falacia de la ausencia de errores.",
      "Las pruebas exhaustivas son imposibles.",
      "Agrupación de defectos (Defect clustering).",
      "Las pruebas tempranas ahorran tiempo y dinero."
    ],
    correctAnswer: "Agrupación de defectos (Defect clustering).",
    explanation: "Este principio, similar al de Pareto, sugiere que la mayoría de los defectos tienden a concentrarse en un pequeño número de módulos, lo que ayuda a enfocar los esfuerzos de pruebas de regresión en las áreas más problemáticas."
  },
  {
    module: "Fundamentos de Pruebas",
    question: "Un Product Manager te pide que 'pruebes todo' para garantizar un lanzamiento sin ningún bug. ¿Cómo respondes basándote en los principios fundamentales del testing?",
    options: [
      "Aceptas el reto y pides más tiempo para poder ejecutar todos los casos de prueba posibles.",
      "Le explicas que las pruebas exhaustivas son imposibles y propones un enfoque basado en riesgos para priorizar las áreas más críticas.",
      "Le aseguras que si la suite de automatización pasa al 100%, el sistema estará libre de errores.",
      "Le dices que es imposible garantizar la ausencia de bugs y que el equipo de desarrollo es el responsable final."
    ],
    correctAnswer: "Le explicas que las pruebas exhaustivas son imposibles y propones un enfoque basado en riesgos para priorizar las áreas más críticas.",
    explanation: "Educar a los stakeholders es clave. Las pruebas exhaustivas son inviables, por lo que un enfoque profesional se centra en mitigar los riesgos más importantes con los recursos y el tiempo disponibles."
  },
  {
    module: "Fundamentos de Pruebas",
    question: "Durante la revisión de una historia de usuario, el QA nota una ambigüedad en un criterio de aceptación. ¿Cuál es la acción más efectiva en este momento?",
    options: [
      "Esperar a que la funcionalidad esté desarrollada y luego probar los diferentes posibles resultados.",
      "Anotar la duda para preguntarla en la siguiente reunión de retrospectiva.",
      "Plantear la ambigüedad inmediatamente al Product Owner para que la aclare antes de que comience el desarrollo.",
      "Crear casos de prueba para todas las interpretaciones posibles de la ambigüedad."
    ],
    correctAnswer: "Plantear la ambigüedad inmediatamente al Product Owner para que la aclare antes de que comience el desarrollo.",
    explanation: "Esto es una aplicación del principio de 'Pruebas tempranas' (Shift-Left). Encontrar y corregir un defecto en la fase de requisitos es exponencialmente más barato que hacerlo en una fase posterior."
  },
  {
    module: "Fundamentos de Pruebas",
    question: "El equipo ha lanzado una nueva funcionalidad que ha pasado todas las pruebas y no tiene bugs conocidos. Sin embargo, los usuarios se quejan de que es confusa y difícil de usar. ¿Qué principio de testing describe esta situación?",
    options: [
      "Las pruebas demuestran la presencia de defectos.",
      "Las pruebas dependen del contexto.",
      "La paradoja del pesticida.",
      "La falacia de la ausencia de errores."
    ],
    correctAnswer: "La falacia de la ausencia de errores.",
    explanation: "Este principio advierte que un software técnicamente libre de errores no tiene valor si no cumple con las necesidades y expectativas del usuario. La calidad va más allá de la simple ausencia de bugs."
  },
  {
    module: "Fundamentos de Pruebas",
    question: "Eres el único QA en un proyecto. ¿Cuál de las siguientes actividades NO se considera una 'prueba estática'?",
    options: [
      "Revisar el documento de requisitos para asegurar que sean claros y comprobables.",
      "Participar en una sesión de 'walkthrough' del diseño de la nueva arquitectura.",
      "Ejecutar una consulta SQL para verificar que un dato se guardó correctamente en la base de datos tras un registro.",
      "Analizar un 'wireframe' de la nueva interfaz de usuario para identificar posibles problemas de usabilidad."
    ],
    correctAnswer: "Ejecutar una consulta SQL para verificar que un dato se guardó correctamente en la base de datos tras un registro.",
    explanation: "Las pruebas estáticas se realizan sin ejecutar el código del sistema (revisión de documentos, análisis de código). Ejecutar una consulta para verificar un resultado es una prueba dinámica, ya que implica interactuar con el sistema en ejecución."
  },
  {
    module: "Fundamentos de Pruebas",
    question: "Un desarrollador corrige un bug y te pide que lo verifiques. Realizas la prueba y confirmas que el bug está solucionado. ¿Cuál es el siguiente paso MÁS importante?",
    options: [
      "Cerrar el ticket del bug inmediatamente.",
      "Ejecutar una suite de pruebas de regresión en el área afectada para asegurar que la corrección no rompió otra cosa.",
      "Agradecer al desarrollador y esperar la siguiente tarea.",
      "Probar la corrección en diferentes navegadores, aunque el bug original solo ocurría en uno."
    ],
    correctAnswer: "Ejecutar una suite de pruebas de regresión en el área afectada para asegurar que la corrección no rompió otra cosa.",
    explanation: "Después de una prueba de confirmación (verificar la corrección), siempre se debe realizar una prueba de regresión. Es muy común que las correcciones introduzcan efectos secundarios inesperados en funcionalidades existentes."
  },
  {
    module: "Fundamentos de Pruebas",
    question: "Se te asigna probar un nuevo módulo de reportería financiera. ¿Cuál de las siguientes actividades representa una prueba NO funcional?",
    options: [
      "Verificar que el reporte se puede exportar a PDF correctamente.",
      "Comprobar que los cálculos de impuestos en el reporte son correctos.",
      "Validar que solo los usuarios con el rol 'Contador' pueden acceder al módulo.",
      "Medir cuánto tiempo tarda el sistema en generar un reporte con un millón de registros."
    ],
    correctAnswer: "Medir cuánto tiempo tarda el sistema en generar un reporte con un millón de registros.",
    explanation: "Las pruebas funcionales verifican 'qué' hace el sistema (cálculos, permisos, exportación). Las pruebas no funcionales verifican 'cómo' lo hace (rendimiento, seguridad, usabilidad)."
  },
  
  // Módulo 2: Pruebas en el Ciclo de Vida -> reframed a El Rol del QA en el Proceso Ágil
  {
    module: "Metodologías Ágiles y Scrum",
    question: "Durante la Sprint Planning, el Product Owner presenta una historia de usuario con criterios de aceptación vagos. Como QA del equipo, ¿cuál es tu contribución más valiosa?",
    options: [
        "Aceptar la historia y planificar tiempo extra para 'testing exploratorio' y así descubrir los requisitos.",
        "Hacer preguntas específicas para aclarar los criterios (ej. '¿Qué mensaje de error debe ver el usuario?') para que sean medibles y comprobables.",
        "Permanecer en silencio, ya que la Planning es una reunión para que los desarrolladores estimen el esfuerzo.",
        "Sugerir que la historia se mueva al siguiente Sprint para dar más tiempo a que los requisitos se definan mejor."
    ],
    correctAnswer: "Hacer preguntas específicas para aclarar los criterios (ej. '¿Qué mensaje de error debe ver el usuario?') para que sean medibles y comprobables.",
    explanation: "El rol del QA en la Planning es ayudar a refinar las historias y asegurar que los criterios de aceptación sean claros, concisos y, sobre todo, testeables. Esto previene ambigüedades y retrabajo."
  },
  {
    module: "Metodologías Ágiles y Scrum",
    question: "El equipo de desarrollo acaba de entregar una nueva build al entorno de pruebas. ¿Qué tipo de prueba es la más crucial para ejecutar INMEDIATAMENTE para decidir si la build es estable?",
    options: [
      "Una suite completa de pruebas de regresión automatizadas.",
      "Pruebas de usabilidad con usuarios finales.",
      "Una prueba de humo (Smoke Test) que verifique las funcionalidades críticas.",
      "Pruebas de rendimiento para ver cómo se comporta bajo carga."
    ],
    correctAnswer: "Una prueba de humo (Smoke Test) que verifique las funcionalidades críticas.",
    explanation: "Un Smoke Test es un conjunto rápido de pruebas que valida que las funcionalidades más importantes (login, búsqueda principal, etc.) no están rotas. Si este test falla, la build se rechaza, ahorrando tiempo al equipo."
  },
  {
    module: "Metodologías Ágiles y Scrum",
    question: "¿Cuál es la diferencia fundamental entre la 'Definition of Done' (DoD) y los 'Criterios de Aceptación' de una historia?",
    options: [
      "No hay diferencia, son dos nombres para lo mismo.",
      "La DoD es definida por el Product Owner y los Criterios de Aceptación por el equipo.",
      "La DoD se aplica a todas las historias del Sprint (es un estándar de calidad), mientras que los Criterios de Aceptación son únicos para cada historia.",
      "Los Criterios de Aceptación son técnicos y la DoD es funcional."
    ],
    correctAnswer: "La DoD se aplica a todas las historias del Sprint (es un estándar de calidad), mientras que los Criterios de Aceptación son únicos para cada historia.",
    explanation: "La DoD es una checklist de calidad global (ej: 'código revisado', 'pruebas unitarias pasan', 'documentación actualizada'). Los Criterios de Aceptación definen los requisitos específicos de una funcionalidad particular."
  },
  {
    module: "Metodologías Ágiles y Scrum",
    question: "En la Daily Scrum, un desarrollador menciona que está bloqueado con una tarea. ¿Cuál es el rol del QA en esta situación?",
    options: [
      "Ofrecer ayuda si el bloqueo está relacionado con el entorno de pruebas o la reproducibilidad de un bug.",
      "Tomar nota del bloqueo para reportarlo al final del Sprint.",
      "No intervenir, ya que la Daily es solo para que los desarrolladores se sincronicen.",
      "Sugerir una solución técnica al desarrollador."
    ],
    correctAnswer: "Ofrecer ayuda si el bloqueo está relacionado con el entorno de pruebas o la reproducibilidad de un bug.",
    explanation: "En un equipo ágil, la calidad es responsabilidad de todos. El QA es un miembro del equipo de desarrollo y debe colaborar activamente para resolver impedimentos, especialmente si están relacionados con el testing."
  },
  {
    module: "Metodologías Ágiles y Scrum",
    question: "El equipo está en la Sprint Retrospective. ¿Cuál de los siguientes puntos es el más constructivo que un QA puede aportar?",
    options: [
      "Quejarse de que los desarrolladores siempre entregan el trabajo el último día del Sprint.",
      "Sugerir: 'Propongo que intentemos hacer un 'desk check' (revisión rápida) de las historias con el desarrollador antes de que se desplieguen a QA, para reducir el retrabajo'.",
      "Listar todos los bugs que se encontraron en el Sprint para demostrar el valor del trabajo de QA.",
      "Preguntar por qué no se completaron todas las historias planificadas."
    ],
    correctAnswer: "Sugerir: 'Propongo que intentemos hacer un 'desk check' (revisión rápida) de las historias con el desarrollador antes de que se desplieguen a QA, para reducir el retrabajo'.",
    explanation: "La Retrospectiva se centra en mejorar el proceso. Una buena contribución identifica un problema (retrabajo) y propone una solución concreta y colaborativa, en lugar de buscar culpables."
  },
  {
    module: "Metodologías Ágiles y Scrum",
    question: "El concepto 'Shift-Left Testing' en un contexto ágil se refiere a:",
    options: [
      "Dejar todas las pruebas para el final del ciclo, justo antes del lanzamiento.",
      "Mover las tareas de 'Testing' a la columna izquierda del tablero Kanban.",
      "Involucrar las actividades de calidad lo más temprano posible en el ciclo de vida, como en la revisión de requisitos y diseño.",
      "Probar únicamente el back-end antes que el front-end."
    ],
    correctAnswer: "Involucrar las actividades de calidad lo más temprano posible en el ciclo de vida, como en la revisión de requisitos y diseño.",
    explanation: "Shift-Left es una filosofía que busca prevenir defectos en lugar de solo detectarlos. Implica que el QA colabore desde la concepción de una idea, no solo cuando el código ya está escrito."
  },
  {
    module: "Metodologías Ágiles y Scrum",
    question: "Durante el Sprint Review, un stakeholder importante señala que una funcionalidad no es lo que esperaba. ¿De quién es la principal responsabilidad de que esto haya ocurrido?",
    options: [
      "Del QA, por no haber detectado la discrepancia durante las pruebas.",
      "Del desarrollador, por no haber implementado los requisitos correctamente.",
      "Del Scrum Master, por no haber facilitado bien la comunicación.",
      "Del Product Owner, por no haber gestionado adecuadamente las expectativas del stakeholder y los requisitos en el Product Backlog."
    ],
    correctAnswer: "Del Product Owner, por no haber gestionado adecuadamente las expectativas del stakeholder y los requisitos en el Product Backlog.",
    explanation: "El Product Owner es el puente entre los stakeholders y el equipo de desarrollo. Su principal responsabilidad es asegurar que el Product Backlog refleje las necesidades del negocio y que estas sean entendidas por el equipo."
  },
  {
    module: "Metodologías Ágiles y Scrum",
    question: "Un QA está trabajando en un equipo Kanban. ¿Cuál es su principal objetivo diario?",
    options: [
      "Completar todas las pruebas asignadas antes de que termine el Sprint.",
      "Ayudar a que las tareas fluyan a través del tablero, colaborando con desarrolladores para resolver bugs y validar historias en la columna 'Testing'.",
      "Esperar a que se acumulen varias tareas en la columna de 'Testing' para probarlas en lote.",
      "Automatizar todos los casos de prueba antes de probar manualmente."
    ],
    correctAnswer: "Ayudar a que las tareas fluyan a través del tablero, colaborando con desarrolladores para resolver bugs y validar historias en la columna 'Testing'.",
    explanation: "En Kanban, el objetivo es optimizar el flujo de trabajo y reducir el 'Work in Progress' (WIP). El QA juega un rol crucial en desbloquear tareas de la fase de testing para que puedan pasar a 'Done'."
  },
  {
    module: "Metodologías Ágiles y Scrum",
    question: "En un equipo Scrum, la calidad del producto es responsabilidad de:",
    options: [
      "Únicamente el equipo de QA.",
      "El Scrum Master, que debe velar por el proceso.",
      "El Product Owner, que define los requisitos de calidad.",
      "Todo el equipo Scrum (desarrolladores, QA, PO)."
    ],
    correctAnswer: "Todo el equipo Scrum (desarrolladores, QA, PO).",
    explanation: "En los marcos ágiles, la calidad es una responsabilidad compartida. Todo el equipo se compromete a entregar un incremento de producto de alta calidad al final de cada sprint."
  },
  {
    module: "Metodologías Ágiles y Scrum",
    question: "Durante una sesión de refinamiento del backlog (grooming), el equipo analiza una historia para un nuevo formulario de registro. ¿Cuál es la contribución MÁS valiosa del QA en esta etapa?",
    options: [
      "Estimar el tiempo que tomará probar la historia una vez que esté terminada.",
      "Preguntar sobre el manejo de casos borde y errores (ej. ¿qué pasa si el usuario ya existe?, ¿qué campos son obligatorios?) para hacer los Criterios de Aceptación más robustos.",
      "Empezar a escribir los scripts de automatización basados en los requisitos iniciales.",
      "Esperar a que los desarrolladores definan la estructura de la base de datos para entender cómo probarlo."
    ],
    correctAnswer: "Preguntar sobre el manejo de casos borde y errores (ej. ¿qué pasa si el usuario ya existe?, ¿qué campos son obligatorios?) para hacer los Criterios de Aceptación más robustos.",
    explanation: "La participación del QA en el refinamiento es crucial para anticipar riesgos y casos complejos. Al hacer preguntas sobre los 'caminos infelices' y los bordes, el QA ayuda al equipo a construir una definición de 'hecho' más completa desde el principio."
  },

  // Módulo 3: Técnicas de Prueba
  {
    module: "Técnicas de Prueba",
    question: "Estás probando un campo de edad que acepta valores entre 18 y 65 años. Usando 'Análisis de Valores Límite', ¿cuál de los siguientes conjuntos de datos es el MÁS efectivo?",
    options: [
      "18, 40, 65",
      "17, 18, 19, 64, 65, 66",
      "0, 100",
      "Cualquier número dentro y fuera del rango, como 25 y 99."
    ],
    correctAnswer: "17, 18, 19, 64, 65, 66",
    explanation: "El Análisis de Valores Límite prueba los valores justo en los límites (18, 65), así como los valores inmediatamente adyacentes a cada lado (17, 19 y 64, 66), ya que es donde suelen ocurrir los errores de lógica."
  },
  {
    module: "Técnicas de Prueba",
    question: "Una aplicación ofrece descuentos de envío según el tipo de usuario (Normal, Premium) y el monto de la compra (<$50, >=$50). ¿Qué técnica de prueba es la más sistemática para diseñar casos de prueba para estas reglas de negocio?",
    options: [
      "Testing exploratorio.",
      "Análisis de valores límite.",
      "Tablas de decisión.",
      "Transición de estados."
    ],
    correctAnswer: "Tablas de decisión.",
    explanation: "Las tablas de decisión son perfectas para modelar y probar lógicas complejas con múltiples condiciones de entrada (tipo de usuario, monto) y sus correspondientes resultados (descuento aplicado)."
  },
  {
    module: "Técnicas de Prueba",
    question: "Se te pide probar el flujo de estados de un pedido en un e-commerce (Pendiente -> Procesando -> Enviado -> Entregado). ¿Qué técnica te ayudaría a visualizar y probar todas las transiciones posibles, incluyendo las inválidas (ej. de 'Pendiente' a 'Entregado')?",
    options: [
      "Partición de equivalencia.",
      "Diagrama de transición de estados.",
      "Cobertura de sentencias.",
      "Adivinación de errores (Error guessing)."
    ],
    correctAnswer: "Diagrama de transición de estados.",
    explanation: "Esta técnica es ideal para sistemas que tienen un número finito de estados. Ayuda a diseñar pruebas que cubran cada transición válida e intente realizar transiciones inválidas para verificar el control de errores."
  },
  {
    module: "Técnicas de Prueba",
    question: "Acabas de recibir una nueva funcionalidad para probar, pero la documentación es mínima. Tienes libertad para investigar la aplicación como lo haría un usuario. ¿Qué enfoque de testing estás aplicando?",
    options: [
      "Pruebas de regresión.",
      "Pruebas de caja blanca.",
      "Pruebas de aceptación de usuario (UAT).",
      "Testing exploratorio."
    ],
    correctAnswer: "Testing exploratorio.",
    explanation: "El testing exploratorio combina el aprendizaje, el diseño de pruebas y la ejecución de forma simultánea. Es una técnica basada en la experiencia, muy útil para descubrir defectos inesperados cuando la documentación es escasa."
  },
  {
    module: "Técnicas de Prueba",
    question: "Un campo de texto debe aceptar nombres de usuario de entre 5 y 15 caracteres alfanuméricos. Usando 'Partición de Equivalencia', ¿cuántas particiones (clases) de datos deberías considerar como mínimo?",
    options: [
      "Dos: una válida (5-15) y una inválida (cualquier otra cosa).",
      "Tres: una inválida por debajo (4 caracteres), una válida (ej. 10 caracteres) y una inválida por encima (16 caracteres).",
      "Cuatro: una inválida (muy corta), una válida, una inválida (muy larga) y otra inválida (con caracteres especiales como '@#$').",
      "Solo una: un nombre de usuario válido de 10 caracteres."
    ],
    correctAnswer: "Cuatro: una inválida (muy corta), una válida, una inválida (muy larga) y otra inválida (con caracteres especiales como '@#$').",
    explanation: "Una buena partición de equivalencia considera todas las reglas. Se necesitan particiones para probar la longitud (demasiado corta, válida, demasiado larga) y la composición de los caracteres (válidos vs. inválidos)."
  },
  {
    module: "Técnicas de Prueba",
    question: "¿En cuál de los siguientes escenarios un QA está aplicando una técnica de 'caja blanca'?",
    options: [
      "Prueba un formulario de login introduciendo un email válido y uno inválido para ver la respuesta del sistema.",
      "Ejecuta una serie de pruebas automatizadas de UI y luego revisa un reporte de cobertura de código para ver qué líneas se ejecutaron.",
      "Utiliza Postman para enviar una petición a una API y verificar que el código de estado de la respuesta es 200 OK.",
      "Sigue los pasos descritos en un caso de prueba para verificar una nueva funcionalidad."
    ],
    correctAnswer: "Ejecuta una serie de pruebas automatizadas de UI y luego revisa un reporte de cobertura de código para ver qué líneas se ejecutaron.",
    explanation: "Las técnicas de caja blanca requieren conocimiento de la estructura interna del código. La cobertura de código es una métrica clásica de caja blanca para medir qué tan a fondo se ha probado el código fuente."
  },
  {
    module: "Técnicas de Prueba",
    question: "Estás probando la funcionalidad de 'subir foto de perfil'. Basado en la técnica de 'adivinación de errores' (error guessing), ¿cuál de los siguientes casos de prueba NO intentarías?",
    options: [
      "Subir una imagen con un formato no soportado (ej. un .zip renombrado a .jpg).",
      "Subir una imagen extremadamente grande (ej. 50 MB).",
      "Subir un archivo que no es una imagen (ej. un documento .pdf).",
      "Subir una imagen de 500x500 píxeles en formato .png, como se especifica en los requisitos."
    ],
    correctAnswer: "Subir una imagen de 500x500 píxeles en formato .png, como se especifica en los requisitos.",
    explanation: "La adivinación de errores es una técnica basada en la experiencia para encontrar bugs anticipando errores comunes. Probar el 'camino feliz' (happy path) es una técnica de caja negra, pero no es 'adivinación de errores'."
  },
  {
    module: "Técnicas de Prueba",
    question: "Tu equipo está construyendo una API REST. El desarrollador te pide que revises el código de un controlador para asegurar que todas las posibles ramas de un 'if-else' (manejo de errores y éxito) están cubiertas por sus pruebas unitarias. ¿Qué métrica de cobertura estáis analizando?",
    options: [
      "Cobertura de API.",
      "Cobertura de sentencias.",
      "Cobertura de decisión (o de rama).",
      "Cobertura de requisitos."
    ],
    correctAnswer: "Cobertura de decisión (o de rama).",
    explanation: "La cobertura de decisión es una métrica de caja blanca que comprueba si se han ejecutado todos los resultados posibles de las estructuras de control (como los bloques 'if' y 'else'). Es más exhaustiva que la simple cobertura de sentencias."
  },
  {
    module: "Técnicas de Prueba",
    question: "¿En qué situación es más valioso aplicar el 'testing exploratorio' en lugar de seguir casos de prueba predefinidos?",
    options: [
      "Al ejecutar la suite de regresión semanal, que debe ser consistente y repetible.",
      "Al verificar los requisitos de una funcionalidad crítica y bien documentada.",
      "Al realizar una prueba de humo sobre una nueva build.",
      "Cuando se integra un nuevo componente y se quiere descubrir cómo interactúa con el resto del sistema de forma inesperada."
    ],
    correctAnswer: "Cuando se integra un nuevo componente y se quiere descubrir cómo interactúa con el resto del sistema de forma inesperada.",
    explanation: "El testing exploratorio brilla cuando el objetivo es el aprendizaje y el descubrimiento de bugs no obvios. Es menos estructurado y permite al tester usar su creatividad y experiencia para investigar la aplicación."
  },
   {
    module: "Técnicas de Prueba",
    question: "Al revisar un nuevo formulario web, ¿cuál de los siguientes hallazgos representa una violación de accesibilidad (a11y) de nivel crítico?",
    options: [
      "El color de fondo del botón de 'Enviar' no coincide exactamente con la paleta de colores de la marca.",
      "La página tarda 3 segundos en cargar en una conexión 3G.",
      "Al navegar con el teclado, es imposible saber qué elemento está seleccionado porque no hay un indicador de foco visible (outline).",
      "El texto de la política de privacidad está en un tamaño de fuente de 12px en lugar de los 14px recomendados."
    ],
    correctAnswer: "Al navegar con el teclado, es imposible saber qué elemento está seleccionado porque no hay un indicador de foco visible (outline).",
    explanation: "La accesibilidad web (a11y) garantiza que las personas con discapacidades puedan usar la web. La navegación por teclado es fundamental, y un indicador de foco visible es un requisito no negociable para que los usuarios sepan dónde se encuentran en la página."
  },

  // Módulo 4: Gestión de Pruebas -> 10 preguntas
  {
    module: "Gestión de Pruebas",
    question: "Encuentras un bug que bloquea el login de la aplicación a un día del lanzamiento. ¿Cuál es la acción más profesional y urgente que debes tomar?",
    options: [
      "Avisar a un desarrollador por chat informalmente para que lo mire.",
      "Documentar el bug con pasos claros, logs y capturas, y comunicarlo inmediatamente al Product Owner y al Tech Lead para una decisión.",
      "Intentar solucionarlo por tu cuenta revisando el código fuente para agilizar.",
      "Revertir la última versión del código en el entorno de pruebas y seguir probando otras cosas."
    ],
    correctAnswer: "Documentar el bug con pasos claros, logs y capturas, y comunicarlo inmediatamente al Product Owner y al Tech Lead para una decisión.",
    explanation: "La prioridad es asegurar que el bug sea visible, reproducible y que las personas correctas (quienes toman decisiones de negocio y técnicas) tengan toda la información para evaluar el riesgo y decidir el curso de acción."
  },
  {
    module: "Gestión de Pruebas",
    question: "Un desarrollador cierra un bug que reportaste con el comentario: 'No es un bug, es una característica'. ¿Cómo procedes de la manera más constructiva?",
    options: [
      "Reabrir el bug inmediatamente insistiendo en que es un fallo.",
      "Escalar el problema directamente al CTO de la empresa.",
      "Revisar los requisitos o Criterios de Aceptación. Si el comportamiento no coincide, iniciar una conversación con el Product Owner para que defina lo esperado.",
      "Aceptar la decisión del desarrollador, ya que él conoce mejor el código."
    ],
    correctAnswer: "Revisar los requisitos o Criterios de Aceptación. Si el comportamiento no coincide, iniciar una conversación con el Product Owner para que defina lo esperado.",
    explanation: "La 'fuente de la verdad' son los requisitos del negocio, representados por el Product Owner. Si hay una discrepancia, el PO debe tomar la decisión final sobre el comportamiento deseado."
  },
  {
    module: "Gestión de Pruebas",
    question: "Al reportar un bug, ¿cuál es la diferencia clave entre 'Severidad' y 'Prioridad'?",
    options: [
      "Son lo mismo, solo que se usan términos diferentes en distintas empresas.",
      "Severidad es definida por el QA y Prioridad por el desarrollador.",
      "Severidad mide el impacto técnico del bug en el sistema, mientras que Prioridad mide la urgencia de negocio para corregirlo.",
      "Severidad se aplica a bugs de UI y Prioridad a bugs de backend."
    ],
    correctAnswer: "Severidad mide el impacto técnico del bug en el sistema, mientras que Prioridad mide la urgencia de negocio para corregirlo.",
    explanation: "Un bug puede tener severidad crítica (ej. una falta de ortografía en el nombre de la empresa en la home page) pero prioridad baja si no afecta la funcionalidad. O puede tener severidad baja (ej. un cálculo incorrecto en un reporte que nadie usa) pero prioridad alta si un cliente importante lo necesita."
  },
  {
    module: "Gestión de Pruebas",
    question: "Estás creando un plan de pruebas para un nuevo proyecto. ¿Qué define el 'Criterio de Salida' (Exit Criteria)?",
    options: [
      "La fecha final del proyecto establecida por la gerencia.",
      "Las condiciones específicas y medibles que deben cumplirse para dar por finalizada una fase de pruebas (ej. '95% de los tests críticos pasados').",
      "La lista de todos los casos de prueba que se van a ejecutar.",
      "El momento en que el presupuesto para QA se ha agotado."
    ],
    correctAnswer: "Las condiciones específicas y medibles que deben cumplirse para dar por finalizada una fase de pruebas (ej. '95% de los tests críticos pasados').",
    explanation: "Los criterios de salida son una red de seguridad objetiva. Ayudan al equipo a tomar una decisión informada sobre si el software está listo para la siguiente fase o para el lanzamiento, en lugar de basarse en sensaciones."
  },
  {
    module: "Gestión de Pruebas",
    question: "Para asegurar que todos los requisitos de una nueva épica han sido cubiertos por casos de prueba, ¿qué documento o artefacto es el más útil?",
    options: [
      "El plan de pruebas del proyecto.",
      "Una matriz de trazabilidad de requisitos.",
      "El reporte final de ejecución de pruebas.",
      "El backlog del producto."
    ],
    correctAnswer: "Una matriz de trazabilidad de requisitos.",
    explanation: "Una matriz de trazabilidad es una tabla que relaciona cada requisito con su(s) correspondiente(s) caso(s) de prueba. Permite visualizar rápidamente qué requisitos no tienen cobertura de pruebas o el impacto de un cambio en un requisito."
  },
  {
    module: "Gestión de Pruebas",
    question: "Te piden estimar el esfuerzo de testing para una historia de usuario. ¿Cuál de los siguientes factores es el MENOS relevante para tu estimación?",
    options: [
      "La complejidad de los criterios de aceptación.",
      "Las dependencias que la historia tiene con otros módulos o servicios.",
      "El número de líneas de código que el desarrollador estima que escribirá.",
      "Los riesgos asociados si la funcionalidad falla en producción."
    ],
    correctAnswer: "El número de líneas de código que el desarrollador estima que escribirá.",
    explanation: "Las líneas de código son un mal indicador del esfuerzo de prueba. Una funcionalidad compleja puede requerir pocas líneas de código, pero muchas pruebas. La complejidad, el riesgo y las dependencias son factores mucho más fiables."
  },
  {
    module: "Gestión de Pruebas",
    question: "Un desarrollador junior te entrega una funcionalidad para probar. La pruebas y encuentras 15 bugs, algunos de ellos muy básicos. ¿Cuál es la forma más constructiva de proceder?",
    options: [
      "Reportar los 15 bugs en la herramienta de seguimiento y asignárselos todos al desarrollador.",
      "Hablar directamente con el desarrollador, mostrarle los bugs más importantes, explicarle el patrón de errores y sugerirle que haga una revisión más profunda antes de volver a entregarla.",
      "Rechazar la historia y comunicarle al Scrum Master que el trabajo es de muy baja calidad.",
      "Corregir los bugs más simples tú mismo para ahorrar tiempo."
    ],
    correctAnswer: "Hablar directamente con el desarrollador, mostrarle los bugs más importantes, explicarle el patrón de errores y sugerirle que haga una revisión más profunda antes de volver a entregarla.",
    explanation: "El objetivo es construir un equipo de calidad, no solo encontrar bugs. Una comunicación constructiva y la mentoría ayudan a prevenir errores en el futuro y fomentan una buena relación de trabajo."
  },
  {
    module: "Gestión de Pruebas",
    question: "El Product Owner te pregunta por el 'estado de la calidad' del producto antes de un lanzamiento. ¿Cuál es la mejor manera de comunicar esta información?",
    options: [
      "Decir 'Creo que estamos bien, la mayoría de las pruebas pasaron'.",
      "Enviar una lista con todos los bugs encontrados hasta la fecha.",
      "Proporcionar un resumen con métricas clave: porcentaje de casos de prueba ejecutados y pasados, número de bugs abiertos por prioridad y los riesgos conocidos.",
      "Mostrarle el tablero Kanban para que él mismo pueda ver el estado de las tareas."
    ],
    correctAnswer: "Proporcionar un resumen con métricas clave: porcentaje de casos de prueba ejecutados y pasados, número de bugs abiertos por prioridad y los riesgos conocidos.",
    explanation: "La comunicación efectiva de riesgos se basa en datos objetivos. Un buen reporte resume la información, la presenta de forma clara y destaca los riesgos más importantes para que se puedan tomar decisiones informadas."
  },
  {
    module: "Gestión de Pruebas",
    question: "¿Qué es la 'fuga de defectos' (defect leakage) y por qué es una métrica importante para un equipo de QA?",
    options: [
      "Es el número de bugs que un desarrollador introduce por cada nueva funcionalidad.",
      "Es una medida de cuántos defectos son encontrados por el equipo de QA antes del lanzamiento.",
      "Mide el porcentaje de defectos que no fueron detectados por QA y que fueron encontrados por los usuarios en producción.",
      "Es el tiempo que tarda un bug en ser corregido desde que se reporta."
    ],
    correctAnswer: "Mide el porcentaje de defectos que no fueron detectados por QA y que fueron encontrados por los usuarios en producción.",
    explanation: "La fuga de defectos es un indicador clave de la efectividad del proceso de pruebas. Un alto índice de fuga sugiere que la estrategia de pruebas (cobertura, técnicas, etc.) necesita ser revisada y mejorada."
  },
  {
    module: "Gestión de Pruebas",
    question: "Se te pide crear un reporte de bug para un problema que ocurre de forma intermitente. ¿Qué elemento es el MÁS crucial incluir en el reporte para ayudar al desarrollador?",
    options: [
      "Tu opinión sobre cuál podría ser la causa del problema.",
      "Los logs de la aplicación, la consola del navegador y cualquier detalle del entorno (versión, navegador) capturados en el momento del fallo.",
      "Una descripción vaga como 'A veces la página de checkout no funciona'.",
      "La prioridad del bug establecida como 'Máxima' para asegurar que se le preste atención."
    ],
    correctAnswer: "Los logs de la aplicación, la consola del navegador y cualquier detalle del entorno (versión, navegador) capturados en el momento del fallo.",
    explanation: "Para bugs intermitentes, la reproducibilidad es el mayor desafío. Los logs y la información del entorno son pistas vitales para que el desarrollador pueda diagnosticar el problema sin necesidad de verlo ocurrir."
  },
  {
    module: "Gestión de Pruebas",
    question: "Encuentras un bug: el enlace a los 'Términos y Condiciones' en el pie de página está roto (error 404). Técnicamente, su severidad es baja. ¿Cómo comunicas el riesgo al Product Owner de la forma más efectiva?",
    options: [
      "Reportas el bug con severidad 'Baja' y esperas a que sea priorizado en el backlog.",
      "Lo comunicas como: 'Bug de severidad baja, pero con riesgo legal potencial alto para la empresa. Recomiendo una prioridad alta para su corrección'.",
      "Pides al equipo de desarrollo que lo solucione rápidamente antes de reportarlo formalmente para no generar alarma.",
      "Creas una tarea para revisar todos los enlaces del sitio, ya que probablemente haya más rotos."
    ],
    correctAnswer: "Lo comunicas como: 'Bug de severidad baja, pero con riesgo legal potencial alto para la empresa. Recomiendo una prioridad alta para su corrección'.",
    explanation: "Un QA eficaz entiende que su rol va más allá de encontrar fallos técnicos. Debe ser capaz de analizar y comunicar el impacto de esos fallos en el negocio, lo que permite una priorización adecuada. Un enlace roto puede tener consecuencias legales o de cumplimiento."
  },
  {
    module: "Gestión de Pruebas",
    question: "El equipo de QA pasa mucho tiempo creando y limpiando datos de prueba, y a menudo los tests fallan por datos inconsistentes entre ejecuciones. ¿Cuál es la solución MÁS robusta y escalable para este problema?",
    options: [
      "Crear un único usuario de prueba 'maestro' con todos los permisos y usarlo para todas las pruebas automatizadas.",
      "Implementar scripts o un servicio que genere datos de prueba frescos y específicos para cada ejecución de test (o suite) y los limpie después.",
      "Hacer una copia de la base de datos de producción y sanitizarla para usarla en el entorno de pruebas.",
      "Asignar a un QA junior la tarea de revisar y resetear manualmente los datos de prueba cada día."
    ],
    correctAnswer: "Implementar scripts o un servicio que genere datos de prueba frescos y específicos para cada ejecución de test (o suite) y los limpie después.",
    explanation: "La gestión de datos de prueba es un pilar de una automatización madura. Generar datos 'bajo demanda' para cada prueba asegura que las ejecuciones sean predecibles y no dependan de un estado preexistente, lo que aumenta drásticamente la fiabilidad de la suite."
  },

  // Módulo 5: Automatización y Herramientas -> 10 preguntas
  {
    module: "Automatización y Herramientas",
    question: "Al probar una API con Postman, recibes un código de estado '403 Forbidden'. ¿Qué significa probablemente?",
    options: [
      "Que el servidor no encontró el endpoint al que intentas acceder.",
      "Que el servidor ha tenido un error interno inesperado.",
      "Que estás autenticado correctamente, pero tu usuario no tiene los permisos necesarios para realizar esa acción.",
      "Que no has proporcionado ninguna credencial de autenticación válida."
    ],
    correctAnswer: "Que estás autenticado correctamente, pero tu usuario no tiene los permisos necesarios para realizar esa acción.",
    explanation: "Es un error común confundir 401 y 403. 401 Unauthorized significa que la autenticación falló o no se proveyó. 403 Forbidden significa que la autenticación fue exitosa, pero la autorización (permisos) falló."
  },
  {
    module: "Automatización y Herramientas",
    question: "Un test automatizado de UI para el proceso de login falla de forma intermitente. A veces pasa, a veces no. ¿Cuál es la causa más probable y cómo la solucionarías?",
    options: [
      "El bug es real pero solo ocurre a veces en la aplicación.",
      "La herramienta de automatización está corrupta y debe ser reinstalada.",
      "Es un problema de sincronización: el script intenta interactuar con un elemento antes de que esté completamente cargado. Se soluciona con esperas explícitas (explicit waits).",
      "El test está mal diseñado y se debe eliminar de la suite de regresión."
    ],
    correctAnswer: "Es un problema de sincronización: el script intenta interactuar con un elemento antes de que esté completamente cargado. Se soluciona con esperas explícitas (explicit waits).",
    explanation: "La inestabilidad ('flakiness') es el mayor enemigo de la automatización de UI. La causa más común son las carreras de condición entre el script y la aplicación. Las esperas explícitas (ej. 'esperar hasta que el elemento sea clickeable') resuelven esto."
  },
  {
    module: "Automatización y Herramientas",
    question: "Según la pirámide de automatización de pruebas, ¿qué tipo de tests deberían ser los más numerosos en una estrategia de automatización saludable?",
    options: [
      "Tests End-to-End (UI) porque cubren los flujos completos del usuario.",
      "Tests manuales exploratorios porque encuentran bugs inesperados.",
      "Tests de API/Integración porque son un buen balance entre velocidad y cobertura.",
      "Tests unitarios porque son los más rápidos, estables y baratos de mantener."
    ],
    correctAnswer: "Tests unitarios porque son los más rápidos, estables y baratos de mantener.",
    explanation: "La pirámide de pruebas aboga por una base ancha de tests unitarios, una capa intermedia de tests de API/integración, y una pequeña capa superior de tests de UI. Esto crea una suite de automatización más rápida y confiable."
  },
  {
    module: "Automatización y Herramientas",
    question: "El equipo está implementando un pipeline de Integración Continua (CI). ¿Cuál es el principal objetivo de ejecutar una suite de tests automatizados en cada 'commit'?",
    options: [
      "Reemplazar por completo la necesidad de QAs manuales en el equipo.",
      "Proporcionar feedback rápido a los desarrolladores para detectar errores de integración lo antes posible.",
      "Generar reportes de calidad para la gerencia.",
      "Asegurar que la aplicación funciona correctamente en producción."
    ],
    correctAnswer: "Proporcionar feedback rápido a los desarrolladores para detectar errores de integración lo antes posible.",
    explanation: "El mantra de CI/CD es 'fallar rápido'. Al ejecutar tests en cada cambio, los desarrolladores pueden saber en minutos si su código ha roto algo, en lugar de enterarse días o semanas después, haciendo la corrección mucho más fácil."
  },
  {
    module: "Automatización y Herramientas",
    question: "Al probar una API, haces una petición DELETE para eliminar un recurso con ID 123. La primera vez responde '204 No Content'. La segunda vez que haces la misma petición, responde '404 Not Found'. ¿Este comportamiento es correcto?",
    options: [
      "No, una API siempre debería devolver el mismo código de estado para la misma petición.",
      "Sí, porque la operación es idempotente; el estado final del sistema es el mismo (el recurso no existe) tras una o más llamadas.",
      "No, la segunda vez debería devolver un '200 OK' indicando que la operación fue exitosa.",
      "Sí, pero solo si la API está diseñada para ser RESTful."
    ],
    correctAnswer: "Sí, porque la operación es idempotente; el estado final del sistema es el mismo (el recurso no existe) tras una o más llamadas.",
    explanation: "La idempotencia es un concepto clave en APIs. Una operación idempotente (como GET, PUT, DELETE) produce el mismo resultado en el servidor sin importar cuántas veces se ejecute. El comportamiento descrito es el esperado y correcto."
  },
  {
    module: "Automatización y Herramientas",
    question: "¿Cuál es el principal beneficio de utilizar el patrón de diseño 'Page Object Model' (POM) en la automatización de UI?",
    options: [
      "Hace que los tests se ejecuten mucho más rápido.",
      "Separa la lógica de las pruebas de la definición de los localizadores de la UI, haciendo el código más mantenible y menos frágil a cambios visuales.",
      "Genera automáticamente los casos de prueba a partir de los requisitos.",
      "Permite escribir los tests en un lenguaje natural como Gherkin (Given-When-Then)."
    ],
    correctAnswer: "Separa la lógica de las pruebas de la definición de los localizadores de la UI, haciendo el código más mantenible y menos frágil a cambios visuales.",
    explanation: "Con POM, si un botón cambia su ID, solo tienes que actualizarlo en un único lugar (el 'Page Object' correspondiente), en lugar de en cada test que interactúa con ese botón. Esto reduce drásticamente el costo de mantenimiento."
  },
  {
    module: "Automatización y Herramientas",
    question: "El equipo de desarrollo te informa que el endpoint `POST /users` no es idempotente. ¿Qué significa esto desde una perspectiva de testing?",
    options: [
      "Que no puedes probar el endpoint más de una vez.",
      "Que si envías la misma petición dos veces, se crearán dos usuarios diferentes (dos recursos distintos).",
      "Que el endpoint no sigue las buenas prácticas de diseño de APIs.",
      "Que el endpoint siempre devolverá un error si se le llama repetidamente."
    ],
    correctAnswer: "Que si envías la misma petición dos veces, se crearán dos usuarios diferentes (dos recursos distintos).",
    explanation: "Las operaciones POST típicamente no son idempotentes. Cada llamada a `POST /users` está diseñada para crear un nuevo recurso, por lo que múltiples llamadas idénticas resultarán en múltiples recursos nuevos, cambiando el estado del sistema cada vez."
  },
  {
    module: "Automatización y Herramientas",
    question: "Al escribir un script de automatización de UI, necesitas localizar un botón. ¿Cuál de los siguientes localizadores es el MÁS robusto y preferible?",
    options: [
      "Un XPath absoluto como '/html/body/div[2]/div[1]/div/button'.",
      "El texto del botón, como '//*[text()=\"Comprar\"]'.",
      "Un ID único y específico para testing, como 'id=\"buy-button\"'.",
      "El selector de CSS basado en la clase, como '.btn-primary'."
    ],
    correctAnswer: "Un ID único y específico para testing, como 'id=\"buy-button\"'.",
    explanation: "Los IDs son la forma más estable de localizar elementos, ya que no se ven afectados por cambios en la estructura de la página (a diferencia del XPath absoluto) o en el texto (a diferencia de la búsqueda por texto). Las clases pueden ser compartidas por múltiples elementos."
  },
  {
    module: "Automatización y Herramientas",
    question: "Estás probando una API que devuelve un objeto JSON grande. Solo necesitas verificar que el campo `user.id` es un número entero. ¿Qué herramienta o enfoque es el más eficiente en Postman?",
    options: [
      "Copiar manualmente toda la respuesta y pegarla en un validador de JSON online.",
      "Usar la pestaña 'Tests' de Postman para escribir un script simple que verifique el tipo y valor de ese campo específico.",
      "Revisar visualmente el campo `user.id` en la respuesta cada vez que ejecutas la petición.",
      "Crear una prueba de UI con Selenium que llame a la API y muestre el resultado en la pantalla."
    ],
    correctAnswer: "Usar la pestaña 'Tests' de Postman para escribir un script simple que verifique el tipo y valor de ese campo específico.",
    explanation: "Las aserciones automatizadas son el corazón de las pruebas de API. La pestaña 'Tests' de Postman permite escribir código JavaScript para validar programáticamente la respuesta, lo cual es repetible, rápido y fiable."
  },
  {
    module: "Automatización y Herramientas",
    question: "El equipo decide adoptar BDD (Behavior-Driven Development). ¿Cuál es el principal cambio en tu rol como QA?",
    options: [
      "Ahora eres el único responsable de escribir todo el código de automatización.",
      "Debes enfocarte en escribir casos de prueba muy técnicos y detallados.",
      "Tu rol principal ahora es escribir código en lugar de probar manualmente.",
      "Colaboras activamente con el Product Owner y los desarrolladores para escribir escenarios en Gherkin (Given-When-Then) que describen el comportamiento esperado, los cuales luego se automatizan."
    ],
    correctAnswer: "Colaboras activamente con el Product Owner y los desarrolladores para escribir escenarios en Gherkin (Given-When-Then) que describen el comportamiento esperado, los cuales luego se automatizan.",
    explanation: "BDD es un proceso de colaboración. El QA ayuda a traducir los requisitos de negocio en ejemplos concretos y ejecutables que sirven como documentación viva y como base para las pruebas de aceptación automatizadas."
  },
  {
    module: "Automatización y Herramientas",
    question: "Tienes recursos limitados para automatizar. ¿Cuál de los siguientes casos de prueba es el candidato IDEAL para la automatización, ofreciendo el mejor Retorno de Inversión (ROI)?",
    options: [
      "Una nueva funcionalidad compleja que probablemente cambiará varias veces en los próximos sprints.",
      "Un test End-to-End que cubre un flujo de usuario poco frecuente pero que requiere una configuración manual muy compleja.",
      "El conjunto de pruebas de regresión para el flujo de login, registro y compra, que se ejecuta en cada despliegue.",
      "Un test para verificar un cambio de estilo visual en la página de 'Sobre Nosotros'."
    ],
    correctAnswer: "El conjunto de pruebas de regresión para el flujo de login, registro y compra, que se ejecuta en cada despliegue.",
    explanation: "El mejor ROI en automatización se obtiene de pruebas que son: 1) Repetitivas (se ejecutan a menudo), 2) Críticas para el negocio (alto riesgo si fallan), y 3) Relativamente estables. Los flujos core de la aplicación cumplen perfectamente estas condiciones."
  },
  {
    module: "Automatización y Herramientas",
    question: "Un equipo de frontend (consumidor) y un equipo de backend (proveedor) están desarrollando una nueva funcionalidad en paralelo. ¿Qué estrategia de testing permite al equipo de frontend avanzar con seguridad sin depender de que la API real esté desplegada y funcionando?",
    options: [
      "Esperar a que el equipo de backend termine y despliegue la API en un entorno de pruebas para empezar las pruebas de integración.",
      "Utilizar pruebas de contrato (Contract Testing). El proveedor y consumidor acuerdan un 'contrato' (schema) y ambos prueban contra él de forma independiente.",
      "El equipo de frontend puede crear sus propios 'mocks' o datos falsos, asumiendo cómo funcionará la API.",
      "Realizar únicamente pruebas de UI End-to-End una vez que ambos componentes estén integrados."
    ],
    correctAnswer: "Utilizar pruebas de contrato (Contract Testing). El proveedor y consumidor acuerdan un 'contrato' (schema) y ambos prueban contra él de forma independiente.",
    explanation: "Las pruebas de contrato (con herramientas como Pact) son una solución poderosa para equipos que trabajan con microservicios o arquitecturas desacopladas. Permiten verificar la compatibilidad entre servicios de forma rápida y aislada, previniendo fallos de integración."
  },
  {
    module: "Automatización y Herramientas",
    question: "Estás a cargo de la calidad de un sitio web de marketing que es visualmente muy rico, con mucho CSS personalizado, y se actualiza frecuentemente con nuevas campañas. ¿Qué tipo de prueba automatizada es MÁS eficiente para detectar regresiones visuales no deseadas (ej. un elemento desalineado)?",
    options: [
      "Pruebas funcionales con Selenium que verifiquen que todos los botones son clickeables.",
      "Pruebas de API para asegurar que los datos de las campañas se cargan correctamente.",
      "Pruebas de regresión visual (Visual Regression Testing) que comparan capturas de pantalla de la versión actual con una versión base aprobada.",
      "Pedir a un diseñador que revise manualmente el sitio después de cada despliegue."
    ],
    correctAnswer: "Pruebas de regresión visual (Visual Regression Testing) que comparan capturas de pantalla de la versión actual con una versión base aprobada.",
    explanation: "Las herramientas de regresión visual (como Applitools, Percy, o Playwright con su comparador de snapshots) son extremadamente eficaces para sitios donde la estética es crítica. Automatizan el tedioso proceso de '¿se ve todo bien?'."
  },

  // Módulo 6: Resolución de Escenarios
  {
    module: "Resolución de Escenarios",
    question: "Estás probando en el entorno de Staging y descubres un bug crítico. El entorno de Desarrollo funciona bien y nadie más puede reproducirlo. ¿Cuál es tu primer paso para investigar?",
    options: [
      "Reportar el bug inmediatamente y asignarlo a un desarrollador.",
      "Reiniciar el servidor de Staging y volver a probar.",
      "Comparar la configuración, versiones de código y datos entre los entornos de Staging y Desarrollo para encontrar la discrepancia.",
      "Asumir que es un problema temporal del entorno y continuar probando otras funcionalidades."
    ],
    correctAnswer: "Comparar la configuración, versiones de código y datos entre los entornos de Staging y Desarrollo para encontrar la discrepancia.",
    explanation: "Los bugs que solo ocurren en un entorno ('It works on my machine') suelen ser causados por diferencias de configuración, dependencias o datos. El primer paso lógico es investigar esas diferencias."
  },
  {
    module: "Resolución de Escenarios",
    question: "El equipo ha acumulado 'deuda técnica' en la automatización: los tests son lentos y fallan a menudo. El management quiere seguir añadiendo tests para nuevas funcionalidades. ¿Qué deberías proponer?",
    options: [
      "Continuar añadiendo nuevos tests como se solicita, ya que la cobertura es lo más importante.",
      "Proponer dedicar un 'sprint de refactorización' o asignar un porcentaje del tiempo de cada sprint para estabilizar la suite de tests existente antes de añadir más.",
      "Sugerir eliminar toda la suite de automatización y empezar de cero, ya que es insalvable.",
      "Pedir contratar a más QAs para que puedan ejecutar los tests fallidos manualmente."
    ],
    correctAnswer: "Proponer dedicar un 'sprint de refactorización' o asignar un porcentaje del tiempo de cada sprint para estabilizar la suite de tests existente antes de añadir más.",
    explanation: "Ignorar la deuda técnica solo empeora el problema. Un QA estratégico aboga por la calidad del propio proceso de testing, negociando tiempo para mejorar la infraestructura y la fiabilidad de la automatización."
  },
  {
    module: "Resolución de Escenarios",
    question: "Se implementa un nuevo sistema de caché para mejorar el rendimiento. Tras el despliegue, la aplicación parece más rápida, pero los usuarios reportan ver datos desactualizados. ¿Qué tipo de pruebas se descuidaron probablemente?",
    options: [
      "Pruebas de humo (Smoke testing).",
      "Pruebas de validación de caché e invalidación.",
      "Pruebas de integración con sistemas de terceros.",
      "Pruebas de compatibilidad de navegadores."
    ],
    correctAnswer: "Pruebas de validación de caché e invalidación.",
    explanation: "La caché introduce complejidad. No es suficiente probar que los datos se cargan; es crucial probar que la caché se invalida (se borra) correctamente cuando los datos subyacentes cambian (ej. un usuario actualiza su perfil)."
  },
  {
    module: "Resolución de Escenarios",
    question: "Un desarrollador te dice: 'No puedo reproducir el bug, ciérralo'. Sin embargo, tú sigues pudiendo reproducirlo consistentemente en el entorno de QA. ¿Cuál es la mejor acción a seguir?",
    options: [
      "Cerrar el bug como solicita el desarrollador para evitar conflictos.",
      "Escalar el problema a tu manager inmediatamente.",
      "Grabar un video o GIF que muestre la reproducción del bug paso a paso, adjuntar logs y pedirle al desarrollador hacer una sesión de 'pairing' para investigarlo juntos.",
      "Reabrir el bug sin añadir más información, simplemente comentando 'Sigue ocurriendo'."
    ],
    correctAnswer: "Grabar un video o GIF que muestre la reproducción del bug paso a paso, adjuntar logs y pedirle al desarrollador hacer una sesión de 'pairing' para investigarlo juntos.",
    explanation: "El objetivo es la colaboración para resolver el problema. Proporcionar evidencia irrefutable (video) y ofrecerse a colaborar en tiempo real es la forma más efectiva de superar el 'no lo puedo reproducir'."
  },
  {
    module: "Resolución de Escenarios",
    question: "Un Product Owner te pide que valides una nueva funcionalidad, pero no existen historias de usuario ni criterios de aceptación formales. ¿Qué deberías hacer?",
    options: [
      "Rechazar la tarea hasta que la documentación esté completa y perfecta.",
      "Inventar tus propios criterios de aceptación basándote en lo que crees que la funcionalidad debería hacer.",
      "Iniciar una sesión de trabajo con el PO para definir y documentar juntos los criterios de aceptación clave antes de empezar las pruebas formales.",
      "Empezar a probar la funcionalidad al azar con la esperanza de encontrar bugs."
    ],
    correctAnswer: "Iniciar una sesión de trabajo con el PO para definir y documentar juntos los criterios de aceptación clave antes de empezar las pruebas formales.",
    explanation: "Un QA proactivo no es un bloqueador, sino un facilitador. En lugar de esperar pasivamente, el QA debe liderar el esfuerzo para definir la calidad y los requisitos cuando estos son ambiguos, colaborando con el negocio."
  },
  {
    module: "Resolución de Escenarios",
    question: "Un test de API que siempre había funcionado empieza a fallar con un error '503 Service Unavailable'. El código de la aplicación no ha cambiado. ¿Cuál es la causa más probable?",
    options: [
      "Se ha introducido un bug en la lógica de la aplicación.",
      "La petición que estás enviando tiene un formato incorrecto (error 4xx).",
      "Una dependencia externa de la API (otra API, una base de datos) está caída o no responde.",
      "El test automatizado tiene un error de sintaxis."
    ],
    correctAnswer: "Una dependencia externa de la API (otra API, una base de datos) está caída o no responde.",
    explanation: "Los errores del servidor de la serie 5xx indican un problema en el servidor. Un 503 específicamente significa que el servicio no está disponible, a menudo porque un componente crítico del que depende no está funcionando."
  },
  {
    module: "Resolución de Escenarios",
    question: "El equipo está a punto de lanzar una migración de base de datos importante. ¿Qué actividad de testing es la MÁS crítica para prevenir la pérdida o corrupción de datos?",
    options: [
      "Pruebas de UI para asegurar que la aplicación sigue funcionando después de la migración.",
      "Pruebas de rendimiento para ver si la nueva base de datos es más rápida.",
      "Validación de datos: escribir scripts para comparar los datos antes y después de la migración y asegurar su integridad y consistencia.",
      "Pruebas de seguridad para asegurar que la nueva base de datos no tenga vulnerabilidades."
    ],
    correctAnswer: "Validación de datos: escribir scripts para comparar los datos antes y después de la migración y asegurar su integridad y consistencia.",
    explanation: "En una migración, el mayor riesgo es la corrupción o pérdida de datos. La única forma de mitigar este riesgo es comparando directamente los datos de origen y destino para verificar que la migración se realizó correctamente."
  },
  {
    module: "Resolución de Escenarios",
    question: "Tu empresa está considerando adquirir una nueva herramienta de automatización de pruebas. ¿Qué factor debería ser el más importante en la decisión?",
    options: [
      "Elegir la herramienta más popular o la que está de moda en el mercado.",
      "La curva de aprendizaje para el equipo actual y si se integra bien con el resto de las herramientas existentes (CI/CD, gestor de proyectos).",
      "El costo de la licencia, eligiendo siempre la opción más barata.",
      "La cantidad de funcionalidades que ofrece, aunque el equipo solo vaya a usar un 10% de ellas."
    ],
    correctAnswer: "La curva de aprendizaje para el equipo actual y si se integra bien con el resto de las herramientas existentes (CI/CD, gestor de proyectos).",
    explanation: "Una herramienta solo es útil si el equipo puede usarla eficientemente y si encaja en el ecosistema tecnológico de la empresa. La mejor herramienta 'en el papel' puede ser un fracaso si nadie sabe cómo usarla o no se integra con el pipeline."
  },
  {
    module: "Resolución de Escenarios",
    question: "Se ha detectado un bug de seguridad crítico en producción. ¿Cuál es el rol del QA en el equipo de respuesta a incidentes?",
    options: [
      "El QA no tiene ningún rol, ya que es un problema de seguridad y no de calidad funcional.",
      "Intentar escribir un script de explotación para demostrar el impacto del bug.",
      "Una vez que el equipo de desarrollo propone un parche, el QA debe validar la corrección en un entorno de pre-producción y realizar pruebas de regresión enfocadas en seguridad.",
      "Comunicar el incidente a todos los clientes a través de las redes sociales."
    ],
    correctAnswer: "Una vez que el equipo de desarrollo propone un parche, el QA debe validar la corrección en un entorno de pre-producción y realizar pruebas de regresión enfocadas en seguridad.",
    explanation: "En una crisis, el rol del QA es crucial para validar que la solución de emergencia no solo corrige el problema, sino que no introduce nuevos fallos. La velocidad y la precisión en la validación son clave."
  },
  {
    module: "Resolución de Escenarios",
    question: "Se acerca el 'Black Friday' y se espera que el tráfico en tu e-commerce se multiplique por 10 durante el día, con picos extremos durante la primera hora de ofertas. ¿Qué tipo de prueba de rendimiento es la MÁS crítica para simular este escenario?",
    options: [
      "Pruebas de carga (Load Testing) para verificar cómo se comporta el sistema bajo la carga de usuarios esperada (10x).",
      "Pruebas de estrés (Stress Testing) para encontrar el punto de quiebre del sistema aumentando la carga progresivamente más allá de lo esperado.",
      "Pruebas de pico (Spike Testing) para simular incrementos súbitos y masivos de usuarios y observar cómo se recupera el sistema.",
      "Pruebas de resistencia (Soak Testing) para ver si el sistema se mantiene estable bajo una carga normal durante un período prolongado."
    ],
    correctAnswer: "Pruebas de pico (Spike Testing) para simular incrementos súbitos y masivos de usuarios y observar cómo se recupera el sistema.",
    explanation: "Cada tipo de prueba de rendimiento responde a una pregunta diferente. Para eventos de tráfico súbito y extremo como el Black Friday, el Spike Testing es la técnica más relevante para asegurar que la infraestructura puede manejar la explosión inicial de demanda."
  },
  {
    module: "Resolución de Escenarios",
    question: "Una funcionalidad en la aplicación móvil funciona perfectamente en la oficina usando WiFi, pero varios usuarios reportan que falla o es extremadamente lenta 'en la calle'. ¿Cuál es la causa más probable que debes investigar?",
    options: [
      "Un bug en el código que solo se activa fuera de la red de la oficina.",
      "La fragmentación de dispositivos Android, donde la app no es compatible con los modelos de teléfono de los usuarios.",
      "La aplicación no maneja correctamente condiciones de red deficientes, como alta latencia, pérdida de paquetes o cambios entre 4G y 3G.",
      "Los usuarios no han actualizado la aplicación a la última versión disponible en la tienda."
    ],
    correctAnswer: "La aplicación no maneja correctamente condiciones de red deficientes, como alta latencia, pérdida de paquetes o cambios entre 4G y 3G.",
    explanation: "El testing móvil va más allá de la funcionalidad en un entorno ideal. Es crucial simular condiciones de red del mundo real usando herramientas de 'network throttling' o 'network shaping' para descubrir cómo se comporta la aplicación cuando la conexión no es perfecta."
  }
];


const MODULE_ORDER = [
  "Fundamentos de Pruebas",
  "Metodologías Ágiles y Scrum",
  "Técnicas de Prueba",
  "Gestión de Pruebas",
  "Automatización y Herramientas",
  "Resolución de Escenarios"
];

const STUDY_SUGGESTIONS: { [key: string]: { title: string; description: string; steps: string[] } } = {
  "Fundamentos de Pruebas": {
    title: "Reforzar los Pilares del Testing",
    description: "Estos conceptos son la base de todo el trabajo de QA. Dominarlos te permitirá tomar mejores decisiones y comunicarte de forma más efectiva.",
    steps: [
      "Memoriza y entiende los 7 Principios de ISTQB. Intenta dar un ejemplo práctico de cada uno.",
      "Dibuja un diagrama explicando la diferencia entre Pruebas Estáticas (revisiones) y Dinámicas (ejecución).",
      "Lee sobre el Proceso de Pruebas Fundamental y cómo se aplica en un proyecto real."
    ]
  },
  "Pruebas en el Ciclo de Vida": {
    title: "Entender el Cuándo y el Porqué de las Pruebas",
    description: "Saber qué tipo de prueba aplicar en cada momento del ciclo de vida es clave para la eficiencia y la detección temprana de errores.",
    steps: [
      "Compara el Modelo V y un ciclo de vida Ágil (Scrum). ¿Dónde encajan las pruebas en cada uno?",
      "Crea un mapa mental de los Niveles de Prueba (Componente, Integración, Sistema, Aceptación).",
      "Define con tus propias palabras la diferencia entre Pruebas Funcionales y No Funcionales (rendimiento, usabilidad, seguridad)."
    ]
  },
  "Técnicas de Prueba": {
    title: "Diseñar Pruebas Inteligentes, no solo Abundantes",
    description: "No se trata de probarlo todo, sino de probar lo correcto. Estas técnicas te ayudan a maximizar la detección de errores con el mínimo esfuerzo.",
    steps: [
      "Toma un formulario simple (ej. un login) y aplica Partición de Equivalencia y Análisis de Valores Límite.",
      "Explica la diferencia entre Caja Negra (sin ver el código) y Caja Blanca (viendo el código).",
      "Busca un ejemplo de una Tabla de Decisión y entiende cómo ayuda a simplificar reglas de negocio complejas."
    ]
  },
  "Gestión de Pruebas": {
    title: "Organizar, Planificar y Comunicar la Calidad",
    description: "Un buen QA no solo ejecuta pruebas, también las gestiona. Esto implica planificar, reportar y entender el proceso de desarrollo.",
    steps: [
      "Busca una plantilla de 'Plan de Pruebas' y familiarízate con sus secciones (alcance, riesgos, criterios de salida).",
      "Analiza el ciclo de vida de un defecto (Nuevo -> Asignado -> Corregido -> Verificado -> Cerrado).",
      "Investiga qué son los 'Criterios de Aceptación' en una Historia de Usuario y por qué son tan importantes para QA."
    ]
  },
  "Automatización y Herramientas": {
    title: "Potenciar el Testing con Tecnología",
    description: "La automatización es una habilidad clave en el mercado actual. Entender sus conceptos y herramientas te abrirá muchas puertas.",
    steps: [
      "Dibuja y explica la Pirámide de Automatización de Pruebas (Unitaria, API, UI).",
      "Investiga qué es Selenium y para qué se usa. Haz lo mismo con Postman.",
      "Lee sobre el patrón de diseño 'Page Object Model' (POM) y por qué es tan importante para mantener el código de automatización."
    ]
  },
  "Resolución de Escenarios": {
    title: "Aplicar el Conocimiento en el Mundo Real",
    description: "Esta área mide tu experiencia y tu capacidad para tomar decisiones. Se mejora enfrentando problemas reales y pensando críticamente.",
    steps: [
      "Piensa en el último bug complicado que encontraste. ¿Cómo lo comunicaste? ¿Cómo se podría haber prevenido?",
      "Practica el 'pensamiento basado en riesgos'. Para una nueva funcionalidad, haz una lista de '¿qué es lo peor que podría pasar?'.",
      "Cuando dudes sobre un requisito, escribe la pregunta que le harías al Product Owner. La comunicación clara es una habilidad clave."
    ]
  },
  "Metodologías Ágiles y Scrum": {
    title: "Dominar el Framework Ágil",
    description: "Comprender Scrum y la mentalidad ágil es fundamental, ya que es el entorno donde la mayoría de los equipos de QA operan hoy en día.",
    steps: [
        "Memoriza los 3 roles de Scrum (Product Owner, Scrum Master, Equipo de Desarrollo) y sus responsabilidades.",
        "Dibuja el ciclo de un Sprint, incluyendo los 4 eventos principales: Planning, Daily, Review y Retrospective.",
        "Lee el Manifiesto Ágil y reflexiona sobre cómo sus valores impactan el trabajo diario de un tester."
    ]
  }
};

const STUDY_CONTENT: { [key: string]: { title: string; topics: { title: string; explanation: string; keyPoints: string[] }[] } } = {
    "Fundamentos de Pruebas": {
        title: "Fundamentos de Pruebas",
        topics: [
            {
                title: "Los 7 Principios del Testing",
                explanation: "ISTQB define siete principios que son la base filosófica del testing de software. Comprenderlos ayuda a crear estrategias de prueba eficientes y a gestionar las expectativas.",
                keyPoints: [
                    "<b>1. Las pruebas demuestran la presencia de defectos:</b> Las pruebas solo pueden confirmar que hay defectos, no pueden probar que no los hay.",
                    "<b>2. Las pruebas exhaustivas son imposibles:</b> Probar todas las combinaciones de entradas y precondiciones es inviable, por lo que se debe usar el análisis de riesgos y las prioridades.",
                    "<b>3. Pruebas tempranas:</b> Iniciar las pruebas lo antes posible en el ciclo de vida (Shift-Left) ahorra tiempo y dinero, ya que los defectos son más baratos de corregir al principio.",
                    "<b>4. Agrupación de defectos (Defect clustering):</b> Un pequeño número de módulos suele contener la mayoría de los defectos. Esto ayuda a enfocar los esfuerzos de prueba.",
                    "<b>5. La paradoja del pesticida:</b> Si se repiten los mismos casos de prueba una y otra vez, con el tiempo dejarán de encontrar nuevos defectos. Es necesario revisar y actualizar las pruebas.",
                    "<b>6. Las pruebas dependen del contexto:</b> La forma de probar una app de e-commerce es diferente a la de un software médico. El contexto (riesgo, industria, tecnología) lo define todo.",
                    "<b>7. La falacia de la ausencia de errores:</b> Encontrar y corregir defectos no servirá de nada si el sistema construido es inutilizable o no cumple con las necesidades del usuario."
                ]
            },
            {
                title: "Proceso de Pruebas Fundamental",
                explanation: "Es el conjunto de actividades clave que componen cualquier proceso de prueba formal, desde la planificación hasta el cierre.",
                keyPoints: [
                    "<b>Planificación y Control:</b> Definir los objetivos y el enfoque de las pruebas.",
                    "<b>Análisis y Diseño:</b> Revisar la base de pruebas (requisitos) y diseñar los casos de prueba a alto nivel.",
                    "<b>Implementación y Ejecución:</b> Desarrollar los casos de prueba y ejecutarlos.",
                    "<b>Evaluación de Criterios de Salida y Reporte:</b> Comprobar si se han cumplido los objetivos y comunicar los resultados.",
                    "<b>Actividades de Cierre de Pruebas:</b> Archivar los resultados y lecciones aprendidas."
                ]
            },
            {
                title: "Pruebas Estáticas vs. Dinámicas",
                explanation: "Las pruebas no solo consisten en ejecutar el código. Se pueden encontrar defectos antes, revisando la documentación y el código fuente.",
                keyPoints: [
                    "<b>Pruebas Estáticas:</b> No se ejecuta el código. Se revisan documentos, requisitos o el código fuente para encontrar errores. (Ej: Revisiones de código, walkthroughs).",
                    "<b>Pruebas Dinámicas:</b> Se ejecuta el software para validar su comportamiento. Es lo que comúnmente se entiende por 'probar'. (Ej: Pruebas unitarias, pruebas de sistema)."
                ]
            }
        ]
    },
     "Pruebas en el Ciclo de Vida": {
        title: "Pruebas en el Ciclo de Vida",
        topics: [
            {
                title: "Niveles de Prueba",
                explanation: "Las pruebas se organizan en niveles, cada uno con un objetivo específico, que van desde lo más pequeño (una función) hasta el sistema completo.",
                keyPoints: [
                    "<b>Pruebas de Componente (Unitarias):</b> Prueban unidades individuales de código (funciones, clases) de forma aislada. Generalmente realizadas por desarrolladores.",
                    "<b>Pruebas de Integración:</b> Verifican la interacción entre componentes o sistemas. El objetivo es encontrar fallos en las interfaces.",
                    "<b>Pruebas de Sistema:</b> Evalúan el sistema completo e integrado para verificar que cumple con los requisitos especificados.",
                    "<b>Pruebas de Aceptación:</b> Validan que el sistema cumple con las necesidades del usuario y del negocio. (Ej: UAT - User Acceptance Testing)."
                ]
            },
            {
                title: "Tipos de Prueba: Funcionales y No Funcionales",
                explanation: "Las pruebas se pueden clasificar en dos grandes familias: las que prueban 'qué' hace el sistema y las que prueban 'cómo' lo hace.",
                keyPoints: [
                    "<b>Pruebas Funcionales:</b> Verifican las funciones del sistema. Responden a la pregunta: ¿Hace el software lo que se supone que debe hacer? (Ej: Probar un login, un formulario de compra).",
                    "<b>Pruebas No Funcionales:</b> Evalúan las características de calidad del sistema. Responden a la pregunta: ¿Qué tan bien funciona el software? (Ej: Pruebas de Rendimiento, Usabilidad, Seguridad, Compatibilidad).",
                    "<b>Pruebas de Caja Blanca/Negra:</b> Se refieren a la perspectiva del tester, no a un tipo de prueba. Se pueden aplicar a cualquier nivel."
                ]
            },
            {
                title: "Pruebas de Mantenimiento (Regresión y Confirmación)",
                explanation: "Cuando un software existente es modificado, es crucial realizar pruebas para asegurar que los cambios no han introducido problemas nuevos.",
                keyPoints: [
                    "<b>Pruebas de Confirmación (Re-testing):</b> Se ejecutan para verificar que un defecto reportado ha sido <b>corregido</b> exitosamente.",
                    "<b>Pruebas de Regresión:</b> Su objetivo es descubrir si los cambios (correcciones o nuevas funcionalidades) han afectado negativamente a características que <b>antes funcionaban</b>.",
                    "La automatización es ideal para las suites de regresión, ya que son repetitivas y deben ejecutarse con frecuencia."
                ]
            },
            {
                title: "El Modelo V",
                explanation: "El Modelo V es una representación gráfica de un ciclo de vida de desarrollo que ilustra cómo las actividades de prueba se corresponden con las de desarrollo. Enfatiza la verificación y la validación.",
                keyPoints: [
                    "<b>Análisis de Requisitos</b> se valida con <b>Pruebas de Aceptación</b>.",
                    "<b>Diseño de Alto Nivel (Arquitectura)</b> se valida con <b>Pruebas de Sistema</b>.",
                    "<b>Diseño de Bajo Nivel (Detallado)</b> se valida con <b>Pruebas de Integración</b>.",
                    "<b>Codificación</b> se valida con <b>Pruebas de Componente (Unitarias)</b>."
                ]
            }
        ]
    },
    "Técnicas de Prueba": {
        title: "Técnicas de Prueba",
        topics: [
            {
                title: "Categorías de Técnicas de Diseño de Pruebas",
                explanation: "Las técnicas de prueba se agrupan en tres categorías principales según la información en la que se basan para diseñar los casos de prueba.",
                keyPoints: [
                   "<b>Caja Negra (Black Box):</b> Se basan en la especificación de requisitos, sin ver el código interno. Se enfocan en el comportamiento externo del sistema.",
                    "<b>Caja Blanca (White Box):</b> Se basan en la estructura interna y el código del software. Se utilizan para medir la cobertura del código.",
                    "<b>Basadas en la Experiencia:</b> Se basan en la intuición, habilidad y experiencia del tester. (Ej: Testing Exploratorio, Adivinación de Errores)."
                ]
            },
            {
                title: "Técnicas de Caja Negra",
                explanation: "Estas técnicas son fundamentales para probar la funcionalidad desde la perspectiva del usuario.",
                keyPoints: [
                    "<b>Partición de Equivalencia:</b> Divide los datos de entrada en grupos de los que se espera un comportamiento similar. Se prueba un solo valor de cada grupo.",
                    "<b>Análisis de Valores Límite:</b> Se enfoca en probar los 'límites' de las particiones (el valor mínimo, el máximo y los valores adyacentes). La mayoría de los errores se encuentran en los límites.",
                    "<b>Tablas de Decisión:</b> Son ideales para probar reglas de negocio complejas con múltiples condiciones y acciones. Ayudan a cubrir todas las combinaciones.",
                    "<b>Transición de Estados:</b> Se usa para probar sistemas que tienen diferentes estados y transiciones entre ellos (ej. un cajero automático, el estado de un pedido)."
                ]
            },
            {
                title: "Técnicas de Caja Blanca",
                explanation: "Estas técnicas se centran en qué tan a fondo se ha probado el código fuente.",
                keyPoints: [
                    "<b>Cobertura de Sentencias:</b> Mide el porcentaje de líneas de código que han sido ejecutadas por las pruebas. Es la métrica más básica.",
                    "<b>Cobertura de Decisión (o de Rama):</b> Mide si se han probado todos los resultados posibles de las decisiones en el código (las ramas 'true' y 'false' de un 'if'). Es más robusta que la de sentencias."
                ]
            },
             {
                title: "Técnicas Basadas en la Experiencia",
                explanation: "Complementan a las técnicas formales y dependen de la habilidad del tester.",
                keyPoints: [
                    "<b>Adivinación de Errores (Error Guessing):</b> El tester usa su experiencia para 'adivinar' dónde es probable que los desarrolladores hayan cometido errores (ej. división por cero, campos vacíos).",
                    "<b>Testing Exploratorio:</b> Es un enfoque donde el aprendizaje, el diseño de pruebas y la ejecución ocurren de forma simultánea. Es una actividad creativa y no guionada."
                ]
            }
        ]
    },
    "Gestión de Pruebas": {
        title: "Gestión de Pruebas",
        topics: [
            {
                title: "Planificación y Documentación de Pruebas",
                explanation: "La gestión de pruebas implica organizar y controlar el proceso. El documento principal para esto es el Plan de Pruebas.",
                keyPoints: [
                    "<b>Plan de Pruebas:</b> Documento que describe el alcance, enfoque, recursos y cronograma de las actividades de prueba. Define qué se va a probar, quién, cuándo y cómo.",
                    "<b>Criterios de Entrada (Entry Criteria):</b> Condiciones que deben cumplirse para poder <b>comenzar</b> una fase de pruebas.",
                    "<b>Criterios de Salida (Exit Criteria):</b> Condiciones que deben cumplirse para poder <b>finalizar</b> una fase de pruebas (ej. 95% de casos de prueba pasados, sin defectos bloqueantes)."
                ]
            },
            {
                title: "Gestión de Defectos",
                explanation: "Un proceso formal para reportar, rastrear y gestionar los defectos desde su descubrimiento hasta su resolución.",
                keyPoints: [
                    "<b>Ciclo de Vida de un Defecto:</b> Nuevo -> Abierto/Asignado -> En Progreso -> Corregido -> Pendiente de Re-test -> Re-testeado -> Cerrado/Reabierto.",
                    "<b>Reporte de Defecto Efectivo:</b> Debe ser claro, conciso y, sobre todo, contener <b>pasos para reproducirlo</b>. También incluye severidad (impacto) y prioridad (urgencia).",
                    "<b>Fuga de Defectos (Defect Leakage):</b> Métrica que cuenta los defectos que 'escapan' de una fase de pruebas y son encontrados por el cliente. Mide la efectividad del proceso de QA."
                ]
            },
            {
                title: "Riesgo y Pruebas",
                explanation: "Las pruebas basadas en riesgo ayudan a priorizar y enfocar los esfuerzos de prueba en las áreas más críticas del sistema.",
                keyPoints: [
                    "<b>Riesgo:</b> La posibilidad de que ocurra un evento negativo. Se mide por la <b>probabilidad</b> de que ocurra y el <b>impacto</b> si ocurre.",
                    "Las áreas de mayor riesgo (alta probabilidad y alto impacto) deben ser probadas de forma más exhaustiva y temprana.",
                    "Esta priorización es la respuesta a por qué las pruebas exhaustivas son imposibles."
                ]
            }
        ]
    },
    "Automatización y Herramientas": {
        title: "Automatización y Herramientas",
        topics: [
            {
                title: "La Pirámide de Automatización de Pruebas",
                explanation: "Es un modelo conceptual que guía la estrategia de automatización. Sugiere cómo distribuir los esfuerzos de automatización en diferentes capas para lograr una suite de pruebas rápida, estable y confiable.",
                keyPoints: [
                    "<b>Base (la más ancha): Pruebas Unitarias.</b> Debe haber muchas. Son rápidas de ejecutar, estables y baratas de mantener.",
                    "<b>Medio: Pruebas de API/Integración/Servicio.</b> Menos que las unitarias. Prueban la lógica de negocio sin la sobrecarga de la UI.",
                    "<b>Cima (la más estrecha): Pruebas de UI (End-to-End).</b> Debe haber pocas. Son lentas, frágiles (se rompen con cambios visuales) y caras de mantener."
                ]
            },
            {
                title: "Herramientas Comunes por Tipo de Prueba",
                explanation: "Existen muchas herramientas de testing, cada una especializada en un área concreta del proceso de software.",
                keyPoints: [
                    "<b>Automatización de UI Web:</b> <b>Selenium</b>, Cypress, Playwright.",
                    "<b>Pruebas de API:</b> <b>Postman</b>, Insomnia, SoapUI.",
                    "<b>Gestión de Proyectos/Defectos:</b> <b>Jira</b>, Trello, Azure DevOps.",
                    "<b>Integración/Entrega Continua (CI/CD):</b> <b>Jenkins</b>, GitLab CI, GitHub Actions."
                ]
            },
            {
                title: "Patrones y Conceptos Clave en Automatización",
                explanation: "Para que la automatización sea sostenible a largo plazo, es crucial seguir buenas prácticas y patrones de diseño.",
                keyPoints: [
                    "<b>Page Object Model (POM):</b> Un patrón de diseño que separa la lógica de las pruebas de la definición de la UI. Crea 'objetos de página' que representan las páginas de la aplicación, haciendo el código más mantenible y legible.",
                    "<b>Localizadores (Locators):</b> Son la forma en que un script de automatización encuentra un elemento en la UI (por ID, CSS Selector, XPath). Un buen localizador debe ser único y estable.",
                    "<b>Behavior-Driven Development (BDD):</b> Un proceso que fomenta la colaboración entre negocio, desarrolladores y QA usando un lenguaje natural (Gherkin: Given-When-Then) para definir el comportamiento del sistema. Herramientas como Cucumber lo implementan."
                ]
            }
        ]
    },
    "Resolución de Escenarios": {
        title: "Resolución de Escenarios",
        topics: [
            {
                title: "Mentalidad de un QA Efectivo",
                explanation: "Más allá de las técnicas, el valor de un QA reside en su mentalidad crítica, su capacidad de comunicación y su enfoque en la calidad integral.",
                keyPoints: [
                    "<b>Comunicación de Riesgos:</b> La tarea principal de un QA no es decir 'sí' o 'no' a un lanzamiento, sino <b>comunicar claramente el riesgo</b> (impacto, probabilidad) para que el negocio tome una decisión informada.",
                    "<b>Colaboración Proactiva:</b> Ante requisitos ambiguos, un QA no espera. <b>Colabora</b> con el Product Owner y los desarrolladores y usa técnicas como el testing exploratorio para aclarar dudas.",
                    "<b>Basado en Hechos, no en Opiniones:</b> Cuando hay desacuerdos ('es un bug' vs 'es una feature'), la referencia siempre deben ser los <b>requisitos y criterios de aceptación</b>. El Product Owner tiene la última palabra sobre el comportamiento esperado."
                ]
            },
            {
                title: "Estrategia y Priorización",
                explanation: "Los recursos son siempre limitados. Un QA senior sabe cómo aplicar el conocimiento teórico para maximizar el valor de su trabajo.",
                keyPoints: [
                    "<b>Retorno de Inversión (ROI) en Automatización:</b> Se deben automatizar primero los casos de prueba <b>repetitivos, estables y de alto riesgo</b> (ej. flujos críticos de negocio). Automatizar algo que se ejecuta una vez no tiene sentido.",
                    "<b>Combinación de Técnicas:</b> Una buena estrategia de pruebas no usa una sola técnica. Combina <b>partición de equivalencia, valores límite, tablas de decisión, etc.</b>, para obtener la mejor cobertura con el menor número de pruebas.",
                    "<b>Análisis de Causa Raíz:</b> Cuando los defectos se concentran en un área (agrupación de defectos), un QA proactivo no solo los reporta, sino que propone un <b>análisis para entender por qué ocurren</b> y cómo mejorar el proceso para prevenirlos."
                ]
            },
            {
                title: "Desafíos Comunes",
                explanation: "En el día a día, surgen problemas que requieren experiencia y una comprensión profunda de los principios de testing.",
                keyPoints: [
                    "<b>Pruebas Inestables (Flaky Tests):</b> Un test de UI que falla intermitentemente suele ser por problemas de <b>sincronización</b>. El script es más rápido que la aplicación. La solución es implementar esperas inteligentes (explicit waits).",
                    "<b>'Prueben todo':</b> Esta petición es una oportunidad para educar. Se debe explicar que <b>las pruebas exhaustivas son imposibles</b> y proponer un enfoque basado en riesgos para cubrir las áreas más críticas.",
                    "<b>Estimación de Pruebas:</b> Una buena estimación se basa en múltiples factores: <b>complejidad de los requisitos, riesgo, dependencias</b> con otros sistemas, y la claridad de los criterios de aceptación."
                ]
            }
        ]
    },
    "Metodologías Ágiles y Scrum": {
        title: "Metodologías Ágiles y Scrum",
        topics: [
            {
                title: "Manifiesto Ágil: Valores y Principios",
                explanation: "El Manifiesto Ágil es la base de frameworks como Scrum. Propone una forma de trabajar centrada en la entrega de valor, la colaboración y la adaptabilidad.",
                keyPoints: [
                    "<b>Individuos e interacciones</b> sobre procesos y herramientas.",
                    "<b>Software funcionando</b> sobre documentación exhaustiva.",
                    "<b>Colaboración con el cliente</b> sobre negociación contractual.",
                    "<b>Respuesta ante el cambio</b> sobre seguir un plan."
                ]
            },
            {
                title: "El Framework Scrum: Roles",
                explanation: "Scrum es un marco de trabajo para desarrollar productos complejos. Define tres roles claros con responsabilidades específicas.",
                keyPoints: [
                    "<b>Product Owner (PO):</b> Maximiza el valor del producto. Es el único responsable de gestionar el <b>Product Backlog</b> (la lista de requisitos).",
                    "<b>Scrum Master (SM):</b> Es un líder servicial. Ayuda al equipo a entender y aplicar Scrum, y se encarga de <b>eliminar impedimentos</b>.",
                    "<b>Equipo de Desarrollo (Developers):</b> Un grupo multifuncional de profesionales (incluyendo QAs) que tienen la habilidad de crear el incremento del producto. Son auto-organizados."
                ]
            },
            {
                title: "El Framework Scrum: Eventos y Artefactos",
                explanation: "Scrum organiza el trabajo en ciclos llamados Sprints, que contienen eventos específicos para la inspección y adaptación. Los artefactos representan el trabajo o el valor.",
                keyPoints: [
                    "<b>Eventos:</b> Sprint Planning, Daily Scrum, Sprint Review y Sprint Retrospective.",
                    "<b>Sprint Retrospective:</b> Su propósito es que el equipo inspeccione su propio proceso y cree un plan de <b>mejoras</b> para el siguiente Sprint.",
                    "<b>Artefactos:</b> Product Backlog (lista de todo lo necesario para el producto), Sprint Backlog (el plan para un Sprint) y el Incremento (la porción del producto 'terminada').",
                    "<b>Definition of Done (DoD):</b> Es un acuerdo compartido por todo el equipo que define los criterios de calidad que debe cumplir un trabajo para ser considerado 'terminado'."
                ]
            }
        ]
    }
};



// --- Type Definitions ---
type Question = {
  module: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

type AppState = 'login' | 'register' | 'home' | 'quizStart' | 'quiz' | 'results' | 'dashboard' | 'study';

type StoredUser = {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
};

type EvaluationResult = {
  id: number;
  userName: string;
  userEmail: string;
  score: number;
  total: number;
  level: string;
  date: string;
};

type QuizProgress = {
    index: number;
    answers: string[];
};

// --- UI Components ---

const LoginScreen = ({ onLogin, onNavigateToRegister, findUserByEmail }: { onLogin: (user: StoredUser) => void, onNavigateToRegister: () => void, findUserByEmail: (email: string) => StoredUser | undefined }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Admin hardcoded login
        if (email.toLowerCase() === 'admin@test.com') {
            onLogin({ name: 'Admin', email: 'admin@test.com', password: '', role: 'admin' });
            return;
        }

        const foundUser = findUserByEmail(email);
        if (!foundUser) {
            setError('El email no está registrado.');
            return;
        }

        if (foundUser.password !== password) {
            setError('La contraseña es incorrecta.');
            return;
        }

        onLogin(foundUser);
    };

    return (
        <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Iniciar Sesión</h1>
            <p className="text-slate-600 mb-8">Ingresa a tu cuenta para continuar.</p>
            <form onSubmit={handleSubmit} className="text-left space-y-4">
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="user@test.com o admin@test.com"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">Contraseña</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all transform hover:scale-105"
                >
                    Ingresar
                </button>
            </form>
            <p className="mt-6 text-sm">
                ¿No tienes una cuenta?{' '}
                <button onClick={onNavigateToRegister} className="font-medium text-teal-600 hover:text-teal-500">
                    Regístrate aquí
                </button>
            </p>
        </div>
    );
};

const RegisterScreen = ({ onRegister, onNavigateToLogin, findUserByEmail, addUser }: { onRegister: (user: StoredUser) => void, onNavigateToLogin: () => void, findUserByEmail: (email: string) => StoredUser | undefined, addUser: (user: StoredUser) => void }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (findUserByEmail(email)) {
            setError('Este email ya está registrado.');
            return;
        }

        const newUser: StoredUser = { name, email, password, role: 'user' as const };
        addUser(newUser);
        onRegister(newUser);
    };

    return (
        <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Crear Cuenta</h1>
            <p className="text-slate-600 mb-8">Completa tus datos para registrarte.</p>
            <form onSubmit={handleSubmit} className="text-left space-y-4">
                 {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
                 <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nombre</label>
                    <input 
                        type="text" 
                        id="name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
                <div>
                    <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700">Email</label>
                    <input 
                        type="email" 
                        id="reg-email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
                <div>
                    <label htmlFor="reg-password" className="block text-sm font-medium text-slate-700">Contraseña</label>
                    <input 
                        type="password" 
                        id="reg-password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all transform hover:scale-105"
                >
                    Registrarse
                </button>
            </form>
            <p className="mt-6 text-sm">
                ¿Ya tienes una cuenta?{' '}
                <button onClick={onNavigateToLogin} className="font-medium text-teal-600 hover:text-teal-500">
                    Inicia sesión
                </button>
            </p>
        </div>
    );
};

const HomeScreen = ({ user, hasSavedProgress, onNavigateToQuiz, onNavigateToStudy, onNavigateToDashboard, onLogout }: { 
    user: StoredUser, 
    hasSavedProgress: boolean,
    onNavigateToQuiz: () => void, 
    onNavigateToStudy: () => void, 
    onNavigateToDashboard: () => void,
    onLogout: () => void
}) => (
    <div className="text-center">
        <div className="absolute top-4 right-4 flex items-center gap-4">
            {user.role === 'admin' && (
                <button
                    onClick={onNavigateToDashboard}
                    className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Dashboard
                </button>
            )}
            <button onClick={onLogout} className="text-sm font-medium text-teal-600 hover:text-teal-500">Cerrar Sesión</button>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">¡Hola, {user.name}!</h1>
        <p className="text-slate-600 mb-8">Elige tu camino para dominar ISTQB.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Card for Study Mode */}
            <button 
                onClick={onNavigateToStudy}
                className="group p-6 bg-slate-50 hover:bg-white hover:shadow-lg rounded-xl border border-slate-200 transition-all text-left transform hover:-translate-y-1"
            >
                <h2 className="text-2xl font-bold text-slate-800">📖 Modo Aprendizaje</h2>
                <p className="text-slate-600 mt-2">Estudia los conceptos clave de cada módulo del sílabo a tu propio ritmo.</p>
                <span className="mt-4 inline-block font-semibold text-teal-600 group-hover:underline">Comenzar a estudiar &rarr;</span>
            </button>
            
            {/* Card for Quiz */}
            <button 
                onClick={onNavigateToQuiz}
                className="group p-6 bg-slate-50 hover:bg-white hover:shadow-lg rounded-xl border border-slate-200 transition-all text-left transform hover:-translate-y-1 relative"
            >
                 {hasSavedProgress && (
                    <span className="absolute top-3 right-3 text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Progreso Guardado</span>
                )}
                <h2 className="text-2xl font-bold text-slate-800">🧪 Evaluación</h2>
                <p className="text-slate-600 mt-2">Pon a prueba tus conocimientos con nuestro examen completo y obtén un plan de mejora.</p>
                <span className="mt-4 inline-block font-semibold text-teal-600 group-hover:underline">Iniciar evaluación &rarr;</span>
            </button>
        </div>
    </div>
);


const QuizStartScreen = ({ onStartNew, onContinue, hasSavedProgress, onBackToHome }: { 
    onStartNew: () => void, 
    onContinue: () => void,
    hasSavedProgress: boolean,
    onBackToHome: () => void
}) => (
  <div className="text-center">
    <div className="absolute top-4 left-4">
        <button onClick={onBackToHome} className="text-sm font-medium text-teal-600 hover:text-teal-500">&larr; Volver al Inicio</button>
    </div>
    <h1 className="text-4xl font-bold text-slate-900 mb-2">Evaluación de Conocimientos</h1>
    <p className="text-slate-600 mb-8">{hasSavedProgress ? "Tienes una evaluación en progreso." : "Pon a prueba tus habilidades e identifica áreas de crecimiento."}</p>
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        {hasSavedProgress ? (
            <>
                <button
                    onClick={onContinue}
                    className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all transform hover:scale-105"
                >
                    Continuar Evaluación
                </button>
                <button
                    onClick={onStartNew}
                    className="bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all"
                >
                    Comenzar de Nuevo
                </button>
            </>
        ) : (
             <button
              onClick={onStartNew}
              className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all transform hover:scale-105"
            >
              Comenzar Evaluación
            </button>
        )}
    </div>
  </div>
);

const QuizScreen = ({ 
    question, 
    questionIndex, 
    totalQuestions, 
    onNext, 
    onSaveAndExit 
} : {
    question: Question,
    questionIndex: number,
    totalQuestions: number,
    onNext: (selectedAnswer: string) => void,
    onSaveAndExit: () => void
}) => {
  const [currentSelection, setCurrentSelection] = useState<string | null>(null);

  const handleNextClick = () => {
    if (currentSelection === null) return;
    onNext(currentSelection);
    setCurrentSelection(null); // Reset selection for next question
  };
  
  const isLastQuestion = questionIndex === totalQuestions - 1;

  useEffect(() => {
      // Reset selection when question changes
      setCurrentSelection(null);
  }, [question]);

  return (
    <div className="w-full">
       <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-slate-500 font-medium">Pregunta {questionIndex + 1} de {totalQuestions}</p>
            <div>
                <button onClick={onSaveAndExit} className="text-sm font-medium text-teal-600 hover:text-teal-500 mr-4">Guardar y Salir</button>
                <span className="text-xs font-semibold bg-teal-100 text-teal-800 px-2 py-1 rounded-full">{question.module}</span>
            </div>
        </div>
        <h2 className="text-2xl font-semibold mt-1">{question.question}</h2>
      </div>
      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => setCurrentSelection(option)}
            aria-pressed={currentSelection === option}
            className={`w-full text-left p-4 border rounded-lg transition-all ${
              currentSelection === option
                ? 'bg-teal-100 border-teal-500 ring-2 ring-teal-300 text-teal-800'
                : 'bg-white border-slate-300 hover:bg-slate-100'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        onClick={handleNextClick}
        disabled={currentSelection === null}
        className="w-full bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
      >
        {isLastQuestion ? 'Finalizar Evaluación' : 'Siguiente Pregunta'}
      </button>
    </div>
  );
};

const ResultsScreen = ({ user, userAnswers, onRestart, onFinishEvaluation }: { user: StoredUser; userAnswers: string[]; onRestart: () => void, onFinishEvaluation: (score: number, total: number, level: string) => void }) => {
  const [showReview, setShowReview] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const resultsContentRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    let score = 0;
    const moduleResults: { [key: string]: { correct: number, total: number } } = {};

    QA_QUESTIONS.forEach((q, index) => {
      if (!moduleResults[q.module]) {
        moduleResults[q.module] = { correct: 0, total: 0 };
      }
      moduleResults[q.module].total++;

      if (userAnswers[index] === q.correctAnswer) {
        score++;
        moduleResults[q.module].correct++;
      }
    });
    
    const percentage = Math.round((score / QA_QUESTIONS.length) * 100);
    
    let level = 'Trainee';
    let levelColor = 'bg-red-500';
    if (percentage > 75) {
        level = 'Senior';
        levelColor = 'bg-green-600';
    } else if (percentage > 50) {
        level = 'Semi-Senior (Ssr)';
        levelColor = 'bg-blue-500';
    } else if (percentage > 25) {
        level = 'Junior (Jr)';
        levelColor = 'bg-yellow-500';
    }
    
    const uniqueModules = [...new Set(QA_QUESTIONS.map(q => q.module))];
    const moduleOrder = MODULE_ORDER.filter(m => uniqueModules.includes(m));

    const sortedModuleResults = moduleOrder.map(moduleName => {
        const result = moduleResults[moduleName];
        const modulePercentage = result ? Math.round((result.correct / result.total) * 100) : 0;
        return { name: moduleName, ...result, percentage: modulePercentage };
    });
    
    const improvementAreas = [...sortedModuleResults].sort((a,b) => a.percentage - b.percentage);
    const areasToImprove = (level === 'Trainee' || level === 'Junior (Jr)') ? improvementAreas.slice(0, 2) : improvementAreas.slice(0, 1);

    return { score, percentage, level, levelColor, moduleResults: sortedModuleResults, areasToImprove };
  }, [userAnswers]);

  // Effect to call onFinishEvaluation once when component mounts
  React.useEffect(() => {
    onFinishEvaluation(results.score, QA_QUESTIONS.length, results.level);
  }, []);

  const handleDownloadPdf = () => {
      if (!resultsContentRef.current) return;
      setIsGeneratingPdf(true);

      html2canvas(resultsContentRef.current, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
              orientation: 'portrait',
              unit: 'px',
              format: [canvas.width, canvas.height]
          });
          pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
          pdf.save(`Resultados-Evaluacion-${user.name.replace(/ /g, '_')}.pdf`);
          setIsGeneratingPdf(false);
      }).catch(err => {
          console.error("Error al generar PDF:", err);
          setIsGeneratingPdf(false);
      });
  };

  return (
    <div className="w-full text-center">
      <div ref={resultsContentRef} className="bg-white p-4">
        {user && (
          <div className="mb-4 text-left border-b pb-4">
            <p><strong>Candidato:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}
        <h2 className="text-3xl font-bold mb-3">Evaluación Completada</h2>
        <div className="mb-6">
          <span className="text-sm font-medium text-slate-600">Nivel Alcanzado</span>
          <p className={`inline-block text-white text-lg font-bold px-4 py-1 rounded-full ml-2 ${results.levelColor}`}>{results.level}</p>
        </div>
        
        <div className="bg-teal-50 p-6 rounded-xl mb-8">
          <p className="text-lg font-medium text-slate-700">Tu Puntuación General</p>
          <p className="text-6xl font-bold text-teal-600 my-2">{results.score} <span className="text-3xl font-medium text-slate-500">/ {QA_QUESTIONS.length}</span></p>
          <p className="text-xl font-semibold text-slate-600">{results.percentage}%</p>
        </div>

        <div className="text-left space-y-6 mb-8">
            <h3 className="text-xl font-bold text-center">Desglose por Módulo</h3>
            {results.moduleResults.map((mod, index) => (
               <div key={index} className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                      <p className="font-semibold text-slate-800">{mod.name}</p>
                      <p className="text-sm font-medium text-slate-600">{mod.correct} / {mod.total}</p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div className="bg-teal-600 h-2.5 rounded-full" style={{width: `${mod.percentage}%`}}></div>
                  </div>
               </div>
            ))}
        </div>
        
        {results.areasToImprove.length > 0 && (
          <div className="text-left bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg mb-8">
              <h3 className="text-xl font-bold text-amber-900 mb-2">Plan de Mejora Sugerido</h3>
              {results.areasToImprove.map((area, index) => {
                  const suggestion = STUDY_SUGGESTIONS[area.name];
                  return (
                      <div key={index} className={index > 0 ? "mt-4" : ""}>
                          <h4 className="font-bold text-slate-800 text-lg">{suggestion.title}</h4>
                          <p className="text-slate-700 text-sm mt-1 mb-2">{suggestion.description}</p>
                          <ul className="list-disc list-inside text-sm space-y-1 text-slate-600">
                              {suggestion.steps.map((step, i) => <li key={i}>{step}</li>)}
                          </ul>
                      </div>
                  )
              })}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
        <button
          onClick={onRestart}
          className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all"
        >
          Volver al Inicio
        </button>
         <button
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="bg-gray-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all disabled:bg-gray-400"
        >
          {isGeneratingPdf ? 'Generando PDF...' : 'Descargar Resultados en PDF'}
        </button>
        <button
          onClick={() => setShowReview(!showReview)}
          className="bg-slate-200 text-slate-800 font-bold py-3 px-8 rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all"
        >
          {showReview ? 'Ocultar Revisión' : 'Revisar Mis Respuestas'}
        </button>
      </div>

      {showReview && (
        <div className="text-left mt-8 space-y-6">
            <h3 className="text-2xl font-bold text-center">Revisión Detallada</h3>
            {QA_QUESTIONS.map((q, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer === q.correctAnswer;
                return (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                        <p className="font-bold text-slate-800">{index + 1}. {q.question}</p>
                        <p className={`mt-2 font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            Tu respuesta: {isCorrect ? '✔️' : '✘'} {userAnswer}
                        </p>
                        {!isCorrect && (
                            <p className="mt-1 font-medium text-green-700">
                                Respuesta correcta: {q.correctAnswer}
                            </p>
                        )}
                         <div className="mt-3 bg-slate-100 p-3 rounded-md text-sm">
                            <p className="font-semibold text-slate-700">Explicación:</p>
                            <p className="text-slate-600">{q.explanation}</p>
                        </div>
                    </div>
                )
            })}
        </div>
      )}
    </div>
  );
};

const AdminDashboard = ({ onBack, evaluations, adminEmail, onEmailChange }: { onBack: () => void; evaluations: EvaluationResult[]; adminEmail: string; onEmailChange: (email: string) => void; }) => {
  const [emailInput, setEmailInput] = useState(adminEmail);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleEmailSave = (e: React.FormEvent) => {
      e.preventDefault();
      onEmailChange(emailInput);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
  };
  
  const stats = useMemo(() => {
      const totalAssessments = evaluations.length;
      if(totalAssessments === 0) return { totalAssessments: 0, averageScore: 0, scoreDistribution: [] };

      const totalScore = evaluations.reduce((sum, e) => sum + (e.score / e.total * 100), 0);
      const averageScore = totalScore / totalAssessments;
      
      const distribution = { 'Trainee': 0, 'Junior (Jr)': 0, 'Semi-Senior (Ssr)': 0, 'Senior': 0 };
      evaluations.forEach(e => {
        if (distribution.hasOwnProperty(e.level)) {
            distribution[e.level as keyof typeof distribution]++;
        }
      });

      return {
          totalAssessments,
          averageScore: parseFloat(averageScore.toFixed(1)),
          scoreDistribution: [
              { range: 'Trainee', count: distribution.Trainee },
              { range: 'Junior (Jr)', count: distribution['Junior (Jr)'] },
              { range: 'Ssr', count: distribution['Semi-Senior (Ssr)'] },
              { range: 'Senior', count: distribution.Senior },
          ]
      }
  }, [evaluations]);

  const maxCount = Math.max(...stats.scoreDistribution.map(d => d.count), 1);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Dashboard de Administrador</h2>
        <button onClick={onBack} className="text-sm font-medium text-teal-600 hover:text-teal-500">
            &larr; Volver al Inicio
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-50 p-6 rounded-xl text-center">
            <p className="text-lg font-medium text-slate-700">Evaluaciones Completadas</p>
            <p className="text-5xl font-bold text-slate-900 mt-2">{stats.totalAssessments}</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-xl text-center">
            <p className="text-lg font-medium text-slate-700">Promedio General</p>
            <p className="text-5xl font-bold text-slate-900 mt-2">{stats.averageScore}%</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-slate-50 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">Distribución de Niveles</h3>
          <div className="flex items-end space-x-4 h-48">
              {stats.scoreDistribution.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                      <p className="text-sm font-bold text-slate-700">{data.count}</p>
                      <div 
                          className="w-full bg-teal-400 rounded-t-md mt-1"
                          style={{ height: `${(data.count / maxCount) * 100}%` }}
                          title={`Cantidad: ${data.count}`}
                      ></div>
                      <p className="text-xs mt-2 text-slate-600 font-medium">{data.range}</p>
                  </div>
              ))}
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4">Configuración</h3>
            <form onSubmit={handleEmailSave}>
                <label htmlFor="admin-email" className="block text-sm font-medium text-slate-700 mb-1">Email para Notificaciones</label>
                <input 
                    type="email"
                    id="admin-email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin.email@ejemplo.com"
                    className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm"
                />
                <button type="submit" className="mt-3 w-full bg-slate-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-800">
                    Guardar Email
                </button>
                {showConfirmation && <p className="text-sm text-green-600 mt-2">¡Email guardado con éxito!</p>}
            </form>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Evaluaciones Recientes</h3>
        <div className="bg-slate-50 p-4 rounded-xl overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-700 uppercase">
                    <tr>
                        <th scope="col" className="px-6 py-3">Nombre</th>
                        <th scope="col" className="px-6 py-3">Puntaje</th>
                        <th scope="col" className="px-6 py-3">Nivel</th>
                        <th scope="col" className="px-6 py-3">Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {evaluations.length > 0 ? (
                        [...evaluations].reverse().map(e => (
                             <tr key={e.id} className="bg-white border-b last:border-b-0">
                                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{e.userName}</td>
                                <td className="px-6 py-4">{e.score} / {e.total}</td>
                                <td className="px-6 py-4">{e.level}</td>
                                <td className="px-6 py-4">{e.date}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan={4} className="text-center py-8 text-slate-500">Aún no hay evaluaciones completadas.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

const StudyScreen = ({ onBackToHome }: { onBackToHome: () => void }) => {
    const [selectedModule, setSelectedModule] = useState<string | null>(null);

    const handleBackClick = () => {
        if (selectedModule) {
            setSelectedModule(null);
        } else {
            onBackToHome();
        }
    };
    
    const uniqueModules = [...new Set(QA_QUESTIONS.map(q => q.module))];
    const moduleOrder = MODULE_ORDER.filter(m => uniqueModules.includes(m));
    const moduleContent = selectedModule ? STUDY_CONTENT[selectedModule] : null;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">{selectedModule || 'Modo Aprendizaje'}</h2>
                <button onClick={handleBackClick} className="text-sm font-medium text-teal-600 hover:text-teal-500">
                    &larr; {selectedModule ? 'Volver a Módulos' : 'Volver al Inicio'}
                </button>
            </div>

            {!selectedModule ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {moduleOrder.map(moduleName => (
                        <button 
                            key={moduleName}
                            onClick={() => setSelectedModule(moduleName)}
                            disabled={!STUDY_CONTENT[moduleName]}
                            className="text-left p-4 bg-slate-50 hover:bg-white hover:shadow-lg rounded-lg border border-slate-200 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                        >
                            <h3 className="font-bold text-slate-800">{moduleName}</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                {STUDY_CONTENT[moduleName] ? 'Estudiar este módulo' : 'Próximamente...'}
                            </p>
                        </button>
                    ))}
                </div>
            ) : moduleContent ? (
                <div className="prose max-w-none">
                    {moduleContent.topics.map((topic, index) => (
                        <div key={index} className="mt-4 p-4 bg-white rounded-lg border border-slate-200 first:mt-0">
                           <h3 className="text-xl font-semibold text-slate-900">{topic.title}</h3>
                           <p className="text-slate-700 mt-2">{topic.explanation}</p>
                           <ul className="mt-3 space-y-1">
                            {topic.keyPoints.map((point, i) => (
                                <li key={i} className="flex items-start">
                                    <span className="text-teal-500 font-bold mr-2 mt-1">►</span> 
                                    <span className="text-slate-600" dangerouslySetInnerHTML={{ __html: point }} />
                                </li>
                            ))}
                           </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No hay contenido disponible para este módulo todavía.</p>
            )}
        </div>
    );
};


// --- Main App Component ---

const App = () => {
  const [appState, setAppState] = useState<AppState>('login');
  const [user, setUser] = useState<StoredUser | null>(null);

  // --- User Database Simulation ---
  const [users, setUsers] = useState<StoredUser[]>(() => {
    const savedUsers = localStorage.getItem('qa-app-users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  const saveUsers = (newUsers: StoredUser[]) => {
      setUsers(newUsers);
      localStorage.setItem('qa-app-users', JSON.stringify(newUsers));
  };

  const findUserByEmail = (email: string) => users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  const addUser = (user: StoredUser) => {
      const newUsers = [...users, user];
      saveUsers(newUsers);
  };


  // --- All Evaluations Data (persisted) ---
  const [allEvaluations, setAllEvaluations] = useState<EvaluationResult[]>(() => {
    const savedEvals = localStorage.getItem('qa-app-evaluations');
    return savedEvals ? JSON.parse(savedEvals) : [
        {id: 1, userName: "Ana Gomez", userEmail: "ana@test.com", score: 52, total: 65, level: "Senior", date: new Date(Date.now() - 86400000).toLocaleDateString()},
        {id: 2, userName: "Luis Castro", userEmail: "luis@test.com", score: 37, total: 65, level: "Semi-Senior (Ssr)", date: new Date(Date.now() - 172800000).toLocaleDateString()},
        {id: 3, userName: "Carla Diaz", userEmail: "carla@test.com", score: 21, total: 65, level: "Junior (Jr)", date: new Date(Date.now() - 259200000).toLocaleDateString()},
    ];
  });
  
  const saveEvaluations = (newEvals: EvaluationResult[]) => {
      setAllEvaluations(newEvals);
      localStorage.setItem('qa-app-evaluations', JSON.stringify(newEvals));
  };

  // --- Admin Config (persisted) ---
  const [adminEmail, setAdminEmail] = useState<string>(() => localStorage.getItem('qa-admin-email') || '');

  const handleAdminEmailChange = (email: string) => {
      setAdminEmail(email);
      localStorage.setItem('qa-admin-email', email);
  };


  // --- Quiz Progress State ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);


  const clearProgress = (currentUser: StoredUser | null) => {
      const userToClear = currentUser || user;
      if (userToClear) {
        localStorage.removeItem(`qa-quiz-progress-${userToClear.email}`);
      }
      setHasSavedProgress(false);
      setCurrentQuestionIndex(0);
      setQuizAnswers([]);
  };

  const handleLogin = (loggedInUser: StoredUser) => {
    setUser(loggedInUser);
    const progressJSON = localStorage.getItem(`qa-quiz-progress-${loggedInUser.email}`);
    if (progressJSON) {
      const savedData: QuizProgress = JSON.parse(progressJSON);
      setQuizAnswers(savedData.answers);
      setCurrentQuestionIndex(savedData.index);
      setHasSavedProgress(true);
    } else {
      setHasSavedProgress(false);
    }
    setAppState('home');
  };

  const handleRegister = (registeredUser: StoredUser) => {
    setUser(registeredUser);
    setHasSavedProgress(false); // No progress for new users
    setAppState('home');
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('login');
  };

  const handleStartNew = () => {
    clearProgress(user);
    setAppState('quiz');
  };

  const handleContinue = () => {
    setAppState('quiz');
  };

  const handleSaveAndExit = () => {
    if (user) {
        const progress: QuizProgress = { index: currentQuestionIndex, answers: quizAnswers };
        localStorage.setItem(`qa-quiz-progress-${user.email}`, JSON.stringify(progress));
        setHasSavedProgress(true);
    }
    setAppState('home');
  };
  
  const handleNextQuestion = (selectedAnswer: string) => {
    const newAnswers = [...quizAnswers, selectedAnswer];
    setQuizAnswers(newAnswers);
    
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < QA_QUESTIONS.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      // Finished quiz
      if(user) {
          localStorage.removeItem(`qa-quiz-progress-${user.email}`);
      }
      setHasSavedProgress(false);
      setAppState('results');
    }
  };


  const handleFinishEvaluation = (score: number, total: number, level: string) => {
    if (!user) return;
    
    const newEvaluation: EvaluationResult = {
        id: Date.now(),
        userName: user.name,
        userEmail: user.email,
        score,
        total,
        level,
        date: new Date().toLocaleDateString()
    };
    saveEvaluations([...allEvaluations, newEvaluation]);

    if (adminEmail) {
        console.log(`%c--- SIMULACIÓN DE ENVÍO DE CORREO ---`, 'color: #0d9488; font-weight: bold;');
        console.log(`Para: ${adminEmail}`);
        console.log(`Asunto: Nueva Evaluación Completada - ${user.name}`);
        console.log(`Contenido:`);
        console.log(`  - Usuario: ${user.name} (${user.email})`);
        console.log(`  - Puntaje: ${score}/${total}`);
        console.log(`  - Nivel: ${level}`);
        console.log(`------------------------------------`);
    }
  };


  const handleRestart = () => {
    clearProgress(user);
    setAppState('home');
  };

  const renderContent = () => {
    switch (appState) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} onNavigateToRegister={() => setAppState('register')} findUserByEmail={findUserByEmail} />;
      case 'register':
        return <RegisterScreen onRegister={handleRegister} onNavigateToLogin={() => setAppState('login')} findUserByEmail={findUserByEmail} addUser={addUser} />;
      case 'home':
        return user ? <HomeScreen 
                        user={user} 
                        hasSavedProgress={hasSavedProgress}
                        onLogout={handleLogout} 
                        onNavigateToDashboard={() => setAppState('dashboard')}
                        onNavigateToStudy={() => setAppState('study')} 
                        onNavigateToQuiz={() => setAppState('quizStart')}/> : null;
      case 'quizStart':
         return <QuizStartScreen
                    hasSavedProgress={hasSavedProgress}
                    onContinue={handleContinue}
                    onStartNew={handleStartNew}
                    onBackToHome={() => setAppState('home')}
                />;
      case 'quiz':
        return <QuizScreen 
                  question={QA_QUESTIONS[currentQuestionIndex]}
                  questionIndex={currentQuestionIndex}
                  totalQuestions={QA_QUESTIONS.length}
                  onNext={handleNextQuestion}
                  onSaveAndExit={handleSaveAndExit}
                />;
      case 'results':
        return user ? <ResultsScreen user={user} userAnswers={quizAnswers} onRestart={handleRestart} onFinishEvaluation={handleFinishEvaluation} /> : null;
      case 'dashboard':
        return <AdminDashboard onBack={handleRestart} evaluations={allEvaluations} adminEmail={adminEmail} onEmailChange={handleAdminEmailChange} />;
      case 'study':
        return <StudyScreen onBackToHome={() => setAppState('home')} />;
      default:
        return <LoginScreen onLogin={handleLogin} onNavigateToRegister={() => setAppState('register')} findUserByEmail={findUserByEmail} />;
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 transition-all relative">
        {renderContent()}
      </div>
    </main>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);