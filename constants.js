const SUMMARIES = {
  acknowledgements: {
    what: 'To credit security researchers who reported valid vulnerabilities.',
    rfc: '3.4.1'
  },
  contact: {
    what: 'How to get in touch with the vendor about security issues',
    rfc: '3.4.2'
  },
  encryption: {
    what: 'The encryption key you should use when writing to the vendor',
    rfc: '3.4.3'
  },
  hiring: {
    what: 'List of security-related job openings at the vendor\'s company',
    rfc: '3.4.4'
  },
  permission: {
    what: 'If this is set (to "none"), you are being asked NOT to perform security research on this asset',
    rfc: '3.4.5'
  },
  policy: {
    what: 'The policy about researching and disclosing security vulnerabilities to this vendor',
    rfc: '3.4.6'
  },
  signature: {
    what: 'A link to a signature file, allowing you to verify this security.txt file\'s authenticity',
    rfc: '3.4.7'
  }
}

// These terms are in the order they should appear in the popup:
const ALLOWED_FIELDS = [
  "contact",
  "permission",
  "policy",
  "signature",
  "encryption",
  "acknowledgements",
  "hiring",
]