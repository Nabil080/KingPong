FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install --verbose

# Add all our files except node_modules from .dockerignore
COPY . .

EXPOSE ${PORT}

CMD ["npm", "run", "start"]
