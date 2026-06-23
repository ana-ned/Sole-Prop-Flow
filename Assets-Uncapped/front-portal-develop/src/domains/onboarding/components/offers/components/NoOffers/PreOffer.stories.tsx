import { Meta, StoryObj } from "@storybook/react-vite"
import { subHours, subMonths, subYears } from "date-fns"
import { fn } from "storybook/test"
import {
  ConnectionResponse,
  ConnectionResponseStatusEnum,
} from "../../../../../../services/api/connections"
import { CustomerFacingDealDetailsResponseTierEnum } from "../../../../../../services/api/hubspot"
import {
  MissingDocumentResponse,
  MissingDocumentResponseConnectionTypeEnum,
  MissingDocumentResponseRequestTypeEnum,
} from "../../../../../../services/api/organisation-users"
import PreOffer from "./PreOffer"

// Mock data for broken connections
const mockBrokenConnections: ConnectionResponse[] = [
  {
    id: "conn-1",
    title: "Starling Bank",
    systemId: "PLAID",
    type: "BANKING",
    status: ConnectionResponseStatusEnum.Error,
    createdAt: new Date("2024-01-15T10:00:00Z"),
    connectionTemplateId: "starling-template",
    providerErrorMessage: "Authentication failed. Please re-authenticate.",
    data: {},
    items: [],
  },
  {
    id: "conn-2",
    title: "Xero",
    systemId: "XERO_CODAT",
    type: "ACCOUNTING",
    status: ConnectionResponseStatusEnum.Error,
    createdAt: new Date("2024-01-10T14:30:00Z"),
    connectionTemplateId: "xero-template",
    providerErrorMessage: "Connection expired. Please reconnect.",
    data: {},
    items: [],
  },
]

// Mock data for missing documents
const mockMissingDocuments: MissingDocumentResponse[] = [
  {
    documentType: "BANK_STATEMENT",
    title: "Bank Statement",
    subtitle: "Latest 3 months",
    description:
      "Please upload your latest 3 months bank statements to verify your banking activity.",
    allowedFileFormats: ["PDF", "JPG", "PNG"],
    instructions: [
      "Download statements from your online banking",
      "Ensure all pages are included",
      "File must be clear and readable",
    ],
    exampleDocumentUrl: "https://example.com/bank-statement-example.pdf",
    connectionType: MissingDocumentResponseConnectionTypeEnum.Banking,
    requestType: MissingDocumentResponseRequestTypeEnum.LineOfCredit,
    externalId: "doc-bank-001",
    isOptional: false,
    lastModificationDate: new Date("2024-01-20T09:00:00Z"),
    documentRequestId: "req-001",
  },
  {
    documentType: "PROOF_OF_ADDRESS",
    title: "Proof of Address",
    subtitle: "Recent utility bill or council tax",
    description:
      "Upload a recent utility bill, council tax statement, or bank statement showing your current address.",
    allowedFileFormats: ["PDF", "JPG", "PNG"],
    instructions: [
      "Document must be dated within the last 3 months",
      "Your name and address must be clearly visible",
      "Accepted documents: utility bills, council tax, bank statements",
    ],
    exampleDocumentUrl: "https://example.com/proof-of-address-example.pdf",
    connectionType: MissingDocumentResponseConnectionTypeEnum.Banking,
    requestType: MissingDocumentResponseRequestTypeEnum.LineOfCredit,
    externalId: "doc-address-002",
    isOptional: false,
    lastModificationDate: new Date("2024-01-20T09:15:00Z"),
    documentRequestId: "req-002",
  },
]

export default {
  title: "Domains/Onboarding/PreOffer",
  component: PreOffer,
  decorators: [
    (Story) => (
      <div className="flex flex-col items-center justify-center">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    tier: {
      control: { type: "select" },
      options: [
        CustomerFacingDealDetailsResponseTierEnum.Small,
        CustomerFacingDealDetailsResponseTierEnum.Big,
      ],
      description: "Deal tier that affects processing time estimation",
    },
    amount: {
      control: { type: "number", min: 1000, max: 1000000, step: 1000 },
      description: "The loan amount being processed",
    },
    currency: {
      control: { type: "select" },
      options: ["GBP", "USD", "EUR"],
      description: "Currency code",
    },
    hasConsent: {
      control: { type: "boolean" },
      description: "Whether user has given consent for notifications",
    },
    startedAt: {
      control: { type: "date" },
      description: "When the process started (optional)",
    },
    stage: {
      control: { type: "select" },
      options: [1, 2, 3],
      description:
        "Current processing stage (1: Bank Verification, 2: Data Completeness, 3: Underwriting)",
    },
    isPaused: {
      control: { type: "boolean" },
      description: "Whether the process is paused due to errors",
    },
    brokenConnections: {
      control: { type: "object" },
      description: "Array of broken connections that need fixing",
    },
    missingDocuments: {
      control: { type: "object" },
      description: "Array of missing documents that need to be uploaded",
    },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Dynamic pre-offer component that shows different states during the loan processing flow. Displays progress, issues, and required actions.",
      },
    },
  },
} satisfies Meta<typeof PreOffer>

type Story = StoryObj<typeof PreOffer>

// Base props for all stories
const baseProps: Story["args"] = {
  tier: CustomerFacingDealDetailsResponseTierEnum.Small,
  amount: 50000,
  currency: "USD",
  brokenConnections: [],
  missingDocuments: [],
  onConsentSubmit: fn(),
}

// NON PAUSED STORIES

export const Stage1: Story = {
  args: {
    ...baseProps,
    hasConsent: false,
    startedAt: new Date(),
    stage: 1,
    isPaused: false,
  },
}

export const Stage1BigTier: Story = {
  name: "Stage 1: Big Tier",
  args: {
    ...baseProps,
    tier: CustomerFacingDealDetailsResponseTierEnum.Big,
    hasConsent: true,
    startedAt: new Date(),
    stage: 1,
    isPaused: false,
  },
}

export const Stage2: Story = {
  args: {
    ...baseProps,
    hasConsent: true,
    startedAt: new Date(),
    stage: 2,
    isPaused: false,
  },
}

export const Stage3: Story = {
  args: {
    ...baseProps,
    hasConsent: true,
    startedAt: new Date(),
    stage: 3,
    isPaused: false,
  },
}

export const Stage3Delayed: Story = {
  args: {
    ...baseProps,
    hasConsent: true,
    startedAt: subMonths(new Date(), 1),
    stage: 3,
    isPaused: false,
  },
}

// PAUSED STORIES

export const PausedStage1BankError: Story = {
  name: "Paused: Stage 1 with bank verification error",
  args: {
    ...baseProps,
    hasConsent: true,
    startedAt: new Date(),
    stage: 1,
    isPaused: true,
  },
}

export const PausedStage2WithIssues: Story = {
  name: "Paused: Stage 2 with broken connections, missing documents",
  args: {
    ...baseProps,
    hasConsent: true,
    startedAt: subHours(new Date(), 10),
    stage: 2,
    isPaused: true,
    brokenConnections: mockBrokenConnections,
    missingDocuments: mockMissingDocuments,
  },
}

export const PausedStage3WithIssues: Story = {
  name: "Paused: Stage 3 with broken connections, missing documents",
  args: {
    ...baseProps,
    hasConsent: true,
    startedAt: subYears(new Date(), 1),
    stage: 3,
    isPaused: true,
    brokenConnections: mockBrokenConnections,
    missingDocuments: mockMissingDocuments,
  },
}
