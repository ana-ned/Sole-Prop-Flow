import { Plugin } from "vite"
import { readFileSync, readdirSync } from "fs"
import { join, relative } from "path"

export default function buildToolsPlugin(): Plugin {
  return {
    name: "build-tools",
    generateBundle() {
      const headContent = readFileSync("tools/_head.html", "utf-8")
        .replace(/%REACT_APP_(\w+)%/g, (_, key) => process.env[`REACT_APP_${key}`] || `%REACT_APP_${key}%`)
      
      const findIndexFiles = (dir: string): string[] =>
        readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
          const path = join(dir, entry.name)
          return entry.isDirectory() ? findIndexFiles(path) : 
                 entry.name === "index.html" ? [path] : []
        })

      findIndexFiles("tools").forEach(filePath => {
        const content = readFileSync(filePath, "utf-8")
        this.emitFile({
          type: "asset",
          fileName: join("tools", relative("tools", filePath)),
          source: content.replace(/<\/head>/i, `${headContent}\n</head>`)
        })
      })
    }
  }
}