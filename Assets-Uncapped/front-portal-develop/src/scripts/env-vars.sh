#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

# Exit if an undefined variable is used
set -u

# Output a header
echo "=============================="
echo "INFO: Starting environment variable mapping"
echo "=============================="

# Initialize a flag to check if any REACT_APP_ variables are found
found_react_app_vars=false

# Iterate over environment variables to check for those starting with REACT_APP_
for var in $(env | grep '^REACT_APP_' | awk -F= '{print $1}'); do
    found_react_app_vars=true
    break
done

# Check if any REACT_APP_ variables were found
if [ "$found_react_app_vars" = false ]; then
    echo "=============================="
    echo "ERROR: No environment variables with prefix REACT_APP_ found"
    echo "=============================="
    exit 1
fi

# Define the location where the env.js file will be created
ENV_JS_LOCATION="/usr/share/nginx/html/config/env.js"

echo "INFO: Creating file at location $ENV_JS_LOCATION"

# Start the env.js file
echo "window.__RUNTIME_ENV__ = {" > "$ENV_JS_LOCATION"

# Append each REACT_APP_ variable to the file
echo "INFO: Mapping environment variables at $ENV_JS_LOCATION"
for var in $(env | grep '^REACT_APP_' | awk -F= '{print $1}'); do
    value=$(printenv "$var")
    echo "  $var: \"$value\"," >> "$ENV_JS_LOCATION"
done

# Close the env.js object
echo "}" >> "$ENV_JS_LOCATION"

# Output a footer
echo "=============================="
echo "INFO: Environment variable mapping completed"
echo "=============================="
