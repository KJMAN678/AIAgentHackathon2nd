FROM node:24-alpine

# Set work directory
WORKDIR /app

# Sync the project into a new environment, using the frozen lockfile
COPY . /app
RUN npm install
COPY . .
