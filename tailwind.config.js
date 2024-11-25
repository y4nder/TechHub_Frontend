/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['Roboto', 'sans-serif']
  		},
  		colors: {
  			lightPurple: {
  				'50': '#f0e6fe',
  				'500': '#6805f2'
  			},
		   darkPurple:{
				'500' : '#5204bf'
		   },
  			darkOrange: {
  				'500': '#c14803'
  			},
  			brightOrange: {
  				'500': '#e02d04'
  			},
  			surface: {
  				'50': '#fefefe',
			   '200' : '#f9f9f9',
  				'500': '#f2f2f2',
			   '900': '#666666'
  			},
  			black: {
  				'300': '#242424',
			   '500': '#161616',
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

