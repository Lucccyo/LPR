# LPR - Les P'tits Rôlistes

Les P'tits Rôlistes (LPR) is a student project aimed at creating a simple character management system using Dungeon and Dragons data. This application allows users to create, view, and manage characters in an interactive way through a command-line interface.

## Project Structure

The project consists of:
- A **Node.js** backend server that manages character data and provides API endpoints.
- A **Bash script** (`launch.sh`) for interacting with the server from the terminal.

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Installation

Clone the repository and install the required Node.js dependencies:

```bash
git clone https://github.com/Lucccyo/LPR.git
cd LPR
npm install
```

### Starting the server

To start the server, run:

```bash
npm start
```

This will launch the backend server which listens on `http://localhost:3000`.

### Using the bash script

To interact with the server and manage characters, use the provided Bash script:

```bash
sh launch.sh
```

> [!NOTE]
> If you don't have a `$TERM` environment variable set, you need to manually start the backend server before launching the Bash script.


This script will open an interactive menu where you can create or view characters.
