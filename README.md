# FALIZ AI WhatsApp Bot

FALIZ AI is a production-ready, intelligent WhatsApp bot designed to provide seamless and context-aware conversational experiences. Leveraging advanced AI capabilities, multi-device support, and a robust architecture, FALIZ AI is built for continuous operation and scalability.

## Features

*   **WhatsApp Connection & Authentication**: Supports both QR code and pairing code generation for initial authentication, persistent session management, and full multi-device support.
*   **AI-Powered Conversational Capabilities**: Integrates with Large Language Models (LLMs) like Google Gemini and DeepSeek for intelligent, context-aware conversations. Supports multimodal understanding and generation (text, images, and potentially audio).
*   **Retrieval-Augmented Generation (RAG)**: Dynamically fetches and utilizes external data from various sources to provide accurate and up-to-date answers.
*   **Diverse Message Handling**: Sends and receives various message types, including text, images, videos, audio, documents, stickers, contact cards, and location data. Supports interactive messaging features like replies and reactions.
*   **Customizable Commands & Events**: Features a flexible command system for custom bot commands (e.g., `!help`, `!ping`) and event handling for reacting to WhatsApp events (e.g., new group members).
*   **Multi-language Support**: Designed for internationalization, capable of understanding user input and generating responses in multiple languages.
*   **Robustness & Maintainability**: Implements comprehensive error handling, detailed logging, and an auto-restart feature for resilience. The codebase is clean, modular, and well-documented.
*   **Deployment & Scalability**: Optimized for cloud deployment using Docker for containerization and PM2 for process management, ensuring scalability for growing user bases.

## Technical Stack

*   **Programming Language**: Node.js (TypeScript)
*   **WhatsApp Library**: Baileys (WhiskeySockets/Baileys)
*   **AI Integration**: Google Gemini (via Google AI Studio) and DeepSeek API
*   **Database (Optional)**: MongoDB or similar NoSQL for session data, user preferences, and knowledge bases.
*   **Deployment**: Docker, PM2

## Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn
*   Docker (optional, for containerized deployment)
*   PM2 (optional, for process management)
*   WhatsApp account for the bot
*   API keys for Google Gemini and/or DeepSeek (if using AI features)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/faliz-ai-whatsapp-bot.git
    cd faliz-ai-whatsapp-bot
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure environment variables:**

    Create a `.env` file in the project root based on `.env.example`:

    ```env
    # WhatsApp Configuration
    WHATSAPP_SESSION_NAME=faliz-ai-session

    # AI Configuration (Select one or both)
    GEMINI_API_KEY=your_gemini_api_key
    DEEPSEEK_API_KEY=your_deepseek_api_key

    # Default AI Provider (gemini or deepseek)
    DEFAULT_AI_PROVIDER=gemini

    # Bot Persona
    BOT_NAME=FALIZ AI
    BOT_TONE=helpful, professional, and friendly
    ```

    Replace `your_gemini_api_key` and `your_deepseek_api_key` with your actual API keys.

### Running the Bot

1.  **Build the project:**

    ```bash
    npm run build
    ```

2.  **Start the bot:**

    ```bash
    npm start
    ```

    Upon first run, a QR code will be displayed in the terminal. Scan it with your WhatsApp mobile app (Linked Devices -> Link a Device) to authenticate the bot. 
    
    ### Using Pairing Code (Alternative)
    If you prefer to use a Pairing Code instead of a QR code:
    1. Set the `PHONE_NUMBER` environment variable in your `.env` or Render settings (e.g., `628123456789`).
    2. Start the bot.
    3. Look at the logs for a message like `=== PAIRING CODE: XXXXXXXX ===`.
    4. On your WhatsApp: **Settings** > **Linked Devices** > **Link a Device** > **Link with phone number instead**.
    5. Enter the 8-digit code shown in the logs.

## Deployment (Optional)

### Docker

1.  **Build the Docker image:**

    ```bash
    docker build -t faliz-ai-bot .
    ```

2.  **Run the Docker container:**

    ```bash
    docker run -d --name faliz-ai-instance -v $(pwd)/data:/app/data -e GEMINI_API_KEY=your_gemini_api_key faliz-ai-bot
    ```

    Remember to mount the `data` directory to persist session information and provide your API keys as environment variables.

### PM2

For production environments, PM2 can be used for process management, automatic restarts, and logging.

1.  **Install PM2 globally:**

    ```bash
    npm install -g pm2
    ```

2.  **Start the bot with PM2:**

    ```bash
    pm2 start ecosystem.config.js
    ```

3.  **Monitor PM2 processes:**

    ```bash
    pm2 monit
    ```

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact [your-email@example.com].
