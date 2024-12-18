const cron = require('node-cron');
const updateHotProducts = require('./utils/updateHotProducts');
const { checkLowStockCron } = require('./cronJobs');

// Registro de tareas activas
const activeJobs = {};

/**
 * Inicia un cron job con validación para evitar duplicados.
 * @param {string} name - Nombre del cron job.
 * @param {string} schedule - Expresión cron para el intervalo.
 * @param {function} task - Tarea a ejecutar.
 * @param {boolean} executeImmediately - Si debe ejecutarse inmediatamente al iniciar.
 */
function startCronJob(name, schedule, task, executeImmediately = false) {
  if (typeof task !== 'function') {
    throw new TypeError(`[Cron Job - ${name}] La tarea proporcionada no es una función válida.`);
  }

  if (activeJobs[name]) {
    console.warn(`El cron job '${name}' ya está activo.`);
    return;
  }

  activeJobs[name] = cron.schedule(schedule, async () => {
    console.log(`[Cron Job - ${name}] Iniciado a las ${new Date().toISOString()}`);
    try {
      await task();
      console.log(`[Cron Job - ${name}] Completado exitosamente.`);
    } catch (err) {
      console.error(`[Cron Job - ${name}] Error:`, err.message);
    }
  });

  console.log(`[Cron Job - ${name}] Programado con éxito con la expresión: '${schedule}'.`);

  if (executeImmediately) {
    console.log(`[Cron Job - ${name}] Ejecutando inmediatamente.`);
    task().catch(err => console.error(`[Cron Job - ${name}] Error en la ejecución inicial:`, err.message));
  }
}

/**
 * Inicializa todos los cron jobs necesarios para el sistema.
 */
function initializeScheduler() {
  try {
    startCronJob('updateHotProducts', '0 3 * * *', updateHotProducts, true); // A las 3 a.m. y al iniciar
    startCronJob('checkLowStock', '0 12 * * *', checkLowStockCron, true);    // A las 12 p.m. y al iniciar
  } catch (error) {
    console.error('[initializeScheduler] Error al inicializar tareas programadas:', error.message);
  }
}

module.exports = initializeScheduler;