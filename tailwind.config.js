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
			   '200' : '#ba8cf9',
  				'500': '#6805f2'
  			},
		   darkPurple:{
				'500' : '#5204bf'
		   },
  			darkOrange: {
			   '50' : '#f9ede6',
			   '200' : '#e2ab8b',
  				'500': '#c14803'
  			},
  			brightOrange: {
  				'500': '#e02d04'
  			},
  			surface: {
  				'50': '#fefefe',
			   '100' : '#fbfbfb',
			   '200' : '#f9f9f9',
			   '400' : '#f5f5f5',
  				'500': '#f2f2f2',
			   '700': '#acacac',
			   '900': '#666666'
  			},
  			black: {
			   '50': '#E9E9E9',
			   '75': '#A5A5A5',
			   '200' :'#494949',
  				'300': '#242424',
			   '500': '#161616',
  			},
		   obsidianBlack : {
				  '500' : '#0B1215'
		   }
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
	   fontSize : {
		   'xxs': '0.75rem'
	   }
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

