// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        myblue: '#1E40AF',
        brand: {
          background: '#111614',        // hsl(120 15% 8%)
          cardBackground: '#1a1f1d',    // hsl(120 12% 12%)
          cardOutline: '#2e3533',       // hsl(120 10% 20%)
          buttonHover: '#23b667e6',     // 90% opacity (#23b667 + e6)
          buttonActive: '#23b667',      // hsl(142 70% 45%)
          buttonOutline: '#292e2d',     // hsl(120 10% 18%)
        },
      },

      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        custom: ['MyCustomFont', 'sans-serif'], // for local font example
      },
    },
  },
}
