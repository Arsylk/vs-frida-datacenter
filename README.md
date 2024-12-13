# Frida Clockwork

Frida Clockwork is a TypeScript-based utility for extending the functionality of Frida scripts. It streamlines the process of writing, managing, and deploying Frida hooks with a modern development approach.

## Features

- Modular TypeScript support for writing Frida scripts.
- Bundling TypeScript code into standalone Agents using Webpack.

## Getting Started

### Prerequisites

Before you start, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Webpack](https://webpack.js.org/) (installed via `npm` as part of the build process)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Arsylk/frida-clockwork.git
   cd frida-clockwork
   ```

2. Install dependencies:

   ```bash
   npm install
   ```
    * Note: first run may crash, run it again and it should start working, not sure why this happens

### Compiling TypeScript to Agent files

This project uses Webpack to bundle all TypeScript files into JavaScript Agent files ready for deployment.

1. Build the project:

   ```bash
   npm run webpack
   ```

   This command will:

   - Compile the TypeScript code into defined Agents.

2. The output will be located in the `agent/dist` directory.

### Using the Watch tasks

For a better development experience, you can use the ` watch:tsc` and `watch:webpack` tasks to automatically rebuild the project whenever you make changes to the TypeScript files.

1. Start the watch mode:

   ```bash
   npm run watch:tsc
   ```
   ```bash
   npm run watch:webpack
   ```

2. This will monitor your source files in the `src` directory. Any changes will trigger an automatic rebuild, updating the bundled file in the `dist` directory.

### Running the Script with Frida

Once your script is built, you can load it into Frida:

```bash
frida -U -n <target-app-name> -s agents/dist/script.js
```
or use the npm `spawn` or `attach` tasks
```bash
npm run spawn <target-app-name>
```

Replace `<target-app-name>` with the name of your target application.

## Project Structure

```plaintext
frida-clockwork/        # Project root
├── packages/           # Directory with all the Modules
│   ├── anticloak/
│   ├── cocos2dx/
│   ├── common/
│   ├── dump/
│   ├── hooks/
│   ├── jnitrace/
│   ├── logging/
│   ├── native/
│   ├── network/
│   └── unity/
├── agent/               # Directory with Agent files
│   ├── dist/
│   │   └── script.js    # Compiled Agent which can be injected by frida
│   └── script.ts        # Single Agent file defined in webpack
├── package.json         # Root project metadata and scripts
├── tsconfig.json        # TypeScript configuration for entire project
├── tsconfig.base.json   # Base TypeScript configuration for every module
└── webpack.config.js    # Webpack configuration
```


## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to improve this project.

## License

This project is licensed under the [MIT License](https://opensource.org/license/mit).

---

If you have any questions or feedback, feel free to reach out by opening an issue in the repository. Happy coding!"
}

# frida-clockwork
