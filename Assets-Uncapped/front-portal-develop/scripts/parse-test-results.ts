/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable unicorn/no-process-exit */

const fs = require("node:fs")
const path = require("node:path")

let payload: {
  id: string
  title?: string
  cause?: string
  failed?: boolean
  resolved?: boolean
} = {
  id: process.env.ID || "dev-tests-full",
}

const reportDir = process.env.REPORT_PATH || "cypress/results"
if (!fs.existsSync(reportDir)) {
  console.error(`Report directory not found: ${reportDir}`)
  process.exit(1)
}
const reportFiles = fs.readdirSync(reportDir)

const failedTests: string[] = []
const services: string[] = []

function processSuite(suite: any, parentTitle = "") {
  const suiteTitle = parentTitle
    ? `${parentTitle} > ${suite.title}`
    : suite.title

  // Process each test in the suite
  suite.tests.forEach((test: { title: string; fail: boolean }) => {
    if (test.fail) {
      failedTests.push(`${suiteTitle} > ${test.title}`)
      services.push(suiteTitle)
    }
  })

  // Recursively process nested suites
  suite.suites.forEach((nestedSuite: any) => {
    processSuite(nestedSuite, suiteTitle)
  })
}

reportFiles.forEach((file: any) => {
  if (path.extname(file) === ".json") {
    try {
      const report = JSON.parse(fs.readFileSync(path.join(reportDir, file)))
      report.results.forEach((result: any) => {
        result.suites.forEach((suite: any) => {
          processSuite(suite)
        })
      })
    } catch (error) {
      console.error(`Failed to parse report file ${file}:`, error)
    }
  }
})

payload =
  failedTests.length > 0
    ? {
        ...payload,
        title: [...new Set(services)].join(", "),
        cause: `Failed tests (${failedTests.length}): ${failedTests.join(", ")}. Investigate details here: https://github.com/weareuncapped-com/front-portal/actions/workflows/dev-tests.yml`,
        failed: true,
      }
    : { ...payload, resolved: true }

const githubOutput = process.env.GITHUB_OUTPUT
if (githubOutput) {
  try {
    fs.appendFileSync(githubOutput, `test_results=${JSON.stringify(payload)}\n`)
  } catch (error) {
    console.error("Failed to write to GITHUB_OUTPUT:", error)
    process.exit(1)
  }
} else if (process.env.CI) {
  console.error("GITHUB_OUTPUT is not set")
  process.exit(1)
} else {
  console.log(JSON.stringify(payload))
}
