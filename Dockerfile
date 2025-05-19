# Step 1: Build the React app
FROM node:20.11.0 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve the build with a static server
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Add custom nginx config to serve index.html for all routes (React router support)
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]