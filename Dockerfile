# ---- Build Stage ----
# Use a Node.js image to build the application
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy dependency configuration files
# CORRECTED LINE: Only copy package.json, as package-lock.json does not exist.
COPY package.json ./

# Install project dependencies
RUN npm install

# Copy all project source files into the container
COPY . .

# Run the build command to create the production version
RUN npm run build

# ---- Final Stage ----
# Use a lightweight Nginx image to serve the application
FROM nginx:1.25-alpine

# Copy the built files from the "builder" stage to the Nginx web directory
COPY --from=builder /app/dist /usr/share/nginx/html

# (Optional but recommended) Copy your Nginx configuration
# If you don't have an nginx.conf file, you can remove the next line
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 so the web server is accessible
EXPOSE 80

# Command to start the Nginx server when the container runs
CMD ["nginx", "-g", "daemon off;"]
