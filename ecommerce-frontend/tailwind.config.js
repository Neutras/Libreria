module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Ruta donde Tailwind buscará clases
    './node_modules/tw-elements/js/**/*.js', // Clases de tw-elements
  ],
  theme: {
    extend: {},
  },
  plugins: [require('tw-elements/plugin')], // Activa el plugin de tw-elements
};
