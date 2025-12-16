function Home() {
  return (
    <div className="text-center mt-10">
        
        <p className="text-3xl font-bold text-gray-800 text-center">SISTEMA DE GESTION ESTUDIANTIL</p>
        <p className="text-lg mb-6 text-center">Gestión de tareas y actividades escolares</p>
        <div class="bg-gray-200 flex flex-col items-center py-8 min-h-screen">
            <div class="mb-6">
                 <a href="/login" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"><i className="fas fa-sign-in-alt mr-2"></i>INICIAR SESION</a>
            </div>
            <div class="flex flex-wrap justify-center gap-4">
                <div class="bg-white rounded-2xl border border-gray-400 p-4 text-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                    <p className="text-1xl font-bold text-gray-800 uppercase">Gestion de Materias</p><p className="text-sm">Profesores pueden crear y administrar sus asignaturas de forma sencilla.</p>
                </div>
                <div class="bg-white rounded-2xl border border-gray-400 p-4 text-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                    <p className="text-1xl font-bold text-gray-800 uppercase">Asignaciones</p><p className="text-sm">Crea tareas y proyectos con fechas límite y descripciones detalladas.</p>
                </div>
                <div class="bg-white rounded-2xl border border-gray-400 p-4 text-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                    <p className="text-1xl font-bold text-gray-800 uppercase">Entregas</p><p className="text-sm">Estudiantes entregan trabajos y reciben calificaciones de manera eficiente.</p>
                </div>
            </div>
                <footer class="w-full bg-gray-800 text-white text-center py-2 mt-10 text-xs">
                    <p>&copy; 2025 - Proyecto Final Lexpin&nbsp;&nbsp;<i class="fa-brands fa-creative-commons-by"></i> Rafael Gerdel</p>
                </footer>
        </div>
     


    </div>
        
  );
}

export { Home }