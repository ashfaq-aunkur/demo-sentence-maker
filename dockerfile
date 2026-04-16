FROM node:22-slim

# Install Python and tools
RUN apt-get update && apt-get install -y \
    python3 \
    python3-venv \
    python3-pip \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

# Create a virtual environment
RUN python3 -m venv venv

# Install Python dependencies inside venv
RUN /app/venv/bin/pip install --no-cache-dir -r requirements.txt

# Add venv to PATH so python & pip are found
ENV PATH="/app/venv/bin:$PATH"

# Default command
CMD ["node", "index.js"]













# # Python 3.12 base image
# FROM python:3.12

# # Install Node.js
# RUN apt-get update && apt-get install -y nodejs npm

# # Set working directory
# WORKDIR /app

# # Copy project files
# COPY . .

# # Install python packages
# RUN pip install --no-cache-dir -r requirements.txt

# # Run Node app
# CMD ["node", "index.js"]