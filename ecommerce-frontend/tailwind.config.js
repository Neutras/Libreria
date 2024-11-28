/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',
        secondary: '#FF9800',
        background: '#F5F5F5',
        text: {
          primary: '#333333',
          secondary: '#666666',
        },
        success: '#3F51B5',
        error: '#F44336',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
