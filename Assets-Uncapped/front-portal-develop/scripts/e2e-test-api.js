/* eslint-disable @typescript-eslint/restrict-plus-operands */

// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
const http = require("node:https")

const req = http.get("https://status.dev.weareuncapped.com", (res) => {
  let body = ""

  res
    .on("data", (d) => {
      body += d
    })
    .on("end", () => {
      if (!body.includes("All services are online")) {
        throw new Error("API is down")
      }
    })
})

req.on("error", (error) => {
  throw new Error(error.message)
})

req.end()
