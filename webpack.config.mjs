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

    devtool: isProd ? false : "source-map",

    module: {
      rules: [
        {
          test: /\.(js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"]
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

  port: 5173,
  compress: true,
  open: true,

  historyApiFallback: {
    rewrites: [
      { from: /^\/$/, to: "/login.html" },
      { from: /^\/login/, to: "/login.html" },
      { from: /^\/home/, to: "/home.html" }
    ]
  },

  proxy: [
    {
      context: ["/api"],
      target: "http://localhost:3000",
      changeOrigin: true,
      secure: false
    }
  ]
},

    resolve: {
      extensions: [".js"]
    }
  };
};