# Use Node 20+ to avoid Object.hasOwn() error
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Set permissions (optional but good)
RUN chmod -R 775 /usr/src/app

# Expose app port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
