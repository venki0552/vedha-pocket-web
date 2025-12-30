import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Memory Palace - AI-Powered Knowledge Management",
	description:
		"Save, search, and chat with your documents and web sources. Get cited answers from your personal knowledge base.",
	keywords: ["document management", "AI", "RAG", "knowledge base", "search"],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={inter.className}>
				<Providers>
					{children}
					<Toaster />
				</Providers>
				<Analytics />
			</body>
		</html>
	);
}
