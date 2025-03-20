# D&D LLM Game Master

An AI-powered Game Master for D&D and other tabletop RPGs that uses LLMs to create interactive adventures.

## Project Overview

This application provides a web interface for interacting with an AI Game Master for tabletop role-playing games. The AI can:

- Create and manage interactive narrative adventures
- Track character information and game state
- Roll dice and apply game rules
- Maintain memory of previous interactions for continuity
- Adapt the story based on player choices

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/dnd-llm-gm.git
   cd dnd-llm-gm
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and visit `http://localhost:3000` to see the application.

## Project Structure

The project follows a component-based architecture:

- `src/components/gameMaster/` - Components for the GM interface
- `src/components/character/` - Character management components
- `src/components/layout/` - Layout and navigation components
- `src/components/common/` - Shared UI components
- `src/contexts/` - React context providers for state management
- `src/hooks/` - Custom React hooks

## Current Features

- Conversation interface with the AI Game Master
- Virtual dice roller
- Basic character sheet
- Memory system for tracking game events
- Responsive design for desktop and mobile

## Development Roadmap

1. LLM Integration - Connect to OpenAI/Anthropic APIs
2. Complete character creation and management
3. Combat tracking system
4. World state visualization
5. Offline support with local LLMs
6. Multi-player support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The D&D 5e SRD for game mechanics reference
- React and related libraries for the UI framework