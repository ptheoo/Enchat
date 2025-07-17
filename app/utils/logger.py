import logging

# Configure the root logger with INFO level and custom formatting
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

# Create a named logger for the chatbot module
logger = logging.getLogger("chatbot")
