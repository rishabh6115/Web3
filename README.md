This template provides a minimal setup to get React working in Vite with HMR (Hot Module Replacement) and includes some ESLint rules.
Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh.

## Installation

To use this template, simply clone this repository and install the dependencies:

```sh
git clone https://github.com/<your_username>/<your_project_name>.git
cd <your_project_name>
npm install
```

## Usage

Start the development server:

```sh
npm run dev
```

This will start a local server at `http://localhost:3000`, where you can preview your application. Any changes made to your code will trigger HMR, updating the browser without refreshing the page.

To build for production, run:

```sh
npm run build
```

This will generate a production-ready build in the `dist` directory.

## ESLint Rules

This template comes with some ESLint rules configured for React and Prettier. You can customize these rules by modifying the `.eslintrc.js` file.

## Plugins

This template comes with two official plugins pre-installed:

- `@vitejs/plugin-react`
- `@vitejs/plugin-react-swc`

You can choose which plugin to use by modifying the `vite.config.js` file. By default, `@vitejs/plugin-react` is used.

## License

This template is licensed under the MIT License.
"# Web3" 
