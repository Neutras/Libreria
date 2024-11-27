const cron = require('node-cron');
const updateHotProducts = require('./utils/updateHotProducts');
const { checkLowStockCron } = require('./cronJobs');

// Registro de tareas activas
const activeJobs = {};

// Función para iniciar un cron job con validación
function startCronJob(name, schedule, task) {
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

  console.log(`[Cron Job - ${name}] Programado con éxito.`);
}


cron.schedule('0 * * * *', () => { // Cada hora
  checkLowStockCron();
});


// Inicializar cron jobs
function initializeScheduler() {
  startCronJob('updateHotProducts', '0 * * * *', updateHotProducts);
  startCronJob('checkLowStock', '0 * * * *', checkLowStockCron);
}

module.exports = initializeScheduler;