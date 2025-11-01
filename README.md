Steps on how to run
[ Ryan, 11/1/2025 ]

Open terminal/powershell/whateverYouHaveInYourMachine

cd arado-enterprises-pos-system (if needed)

# Install dependencies for frontend
cd frontend

npm install

# Then install dependencies for backend
cd ../backend

npm install

# In one terminal:
cd backend

npm run dev     

( runs the Express server )

# In another terminal:
cd frontend

npm run dev     

( runs the React/Vite app )
