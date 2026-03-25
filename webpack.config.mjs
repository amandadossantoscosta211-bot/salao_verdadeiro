import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env, argv) => {
  const isProd = argv.mode === "production";

  return {
    mode: isProd ? "production" : "development",
    entry: path.join(__dirname, "src", "index.js"),
    output: {
      path: path.join(__dirname, "dist"),
      filename: "bundle.js",
      publicPath: "/",
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.(?:js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env"]]
            }
          }
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"]
        }
      ]
    },
    devServer: {
      static: {
        directory: path.join(__dirname, "public")
      },
      compress: true,
      port: 5173
    }
  };
};