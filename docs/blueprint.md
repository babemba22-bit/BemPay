# **App Name**: BemPay

## Core Features:

- Create Payment Link: Allow creators to generate payment links with a title, description, and amount in XOF.
- Payment Link Listing: Display a list of payment links with key details such as title, amount, status, and creation date.
- Payment Processing: Enable payment processing via integrated payment provider (CinetPay or PayDunya) on the checkout page.
- Checkout Page: Display a summary of the payment link details and payment information for the payer on a dedicated checkout page.
- Payment Status Updates: Update the payment status based on webhook notifications from the payment provider or via API verification.
- Database Storage: Store creator, payment link, and payment information in a database.

## Style Guidelines:

- Primary color: Deep Indigo (#3F51B5) to convey trust and security.
- Background color: Light gray (#F0F2F5), subtly desaturated from the primary, to ensure a clean and modern look.
- Accent color: Soft Lavender (#9FA8DA), a lighter analogous color, to highlight interactive elements.
- Body and headline font: 'Inter' (sans-serif) for a modern and clean user interface.
- Use minimalist, consistent icons to represent payment options and actions.
- Implement a clean, grid-based layout using Tailwind CSS for responsiveness and balance.
- Subtle transitions and animations to provide feedback on user interactions.