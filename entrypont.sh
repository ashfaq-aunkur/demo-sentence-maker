#!/bin/sh
set -e

# Start Ollama server in the background
ollama serve &

# Wait until Ollama is ready
echo "Waiting for Ollama to start..."
until curl -s http://127.0.0.1:11434/api/tags >/dev/null; do
  sleep 1
done

echo "Ollama ready. Pulling model qwen3:8b ..."
ollama pull qwen3:8b

echo "Model pulled! Keeping Ollama running..."
wait