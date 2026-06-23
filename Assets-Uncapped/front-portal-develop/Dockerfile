FROM nginxinc/nginx-unprivileged:1.29.8

# Define the build argument and the project directory
ARG PROJECT_DIR=build

# Create a directory for the script
WORKDIR /usr/local/bin

# Copy the shell script into the secure directory
COPY src/scripts/env-vars.sh /usr/local/bin/front-portal/env-vars.sh

USER root

# Make the shell script executable
RUN chmod +x /usr/local/bin/front-portal/env-vars.sh

# Copy your static files using the build argument
COPY $PROJECT_DIR/ /usr/share/nginx/html/

# Ensure the necessary directories exist and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html/

# Switch to the unprivileged user nginx (UID and GID 101) for security reasons
USER nginx

# Run the shell script before starting Nginx
CMD ["/bin/sh", "-c", "/usr/local/bin/front-portal/env-vars.sh && nginx -g 'daemon off;'"]
