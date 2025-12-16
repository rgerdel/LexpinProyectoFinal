const validateAsignatura = () => {
  const errors = {};

  // Validar nombre (requerido, no vacío)
  if (!nuevaAsignatura.nombre.trim()) {
    errors.nombre = "El nombre es requerido.";
  }

  // Validar descripción (requerido, no vacío)
  if (!nuevaAsignatura.descripcion.trim()) {
    errors.descripcion = "La descripción es requerida.";
  }

  // Validar profesor (requerido, no vacío)
  if (!nuevaAsignatura.profesorId.trim()) {
    errors.profesorId = "Debe seleccionar un profesor.";
  }

  // Validar grado (requerido, no vacío)
  if (!nuevaAsignatura.gradoId.trim()) {
    errors.gradoId = "Debe seleccionar un grado.";
  }

  setFormErrors(errors);
  return errors;
};