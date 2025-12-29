"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownProps {
	content: string;
	className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
	return (
		<div className={cn("prose prose-sm dark:prose-invert max-w-none", className)}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
				// Override default elements for better styling
				p: ({ children }) => <p className='mb-2 last:mb-0'>{children}</p>,
				ul: ({ children }) => (
					<ul className='list-disc list-inside mb-2 space-y-1'>{children}</ul>
				),
				ol: ({ children }) => (
					<ol className='list-decimal list-inside mb-2 space-y-1'>
						{children}
					</ol>
				),
				li: ({ children }) => <li className='leading-relaxed'>{children}</li>,
				h1: ({ children }) => (
					<h1 className='text-xl font-bold mb-2 mt-4 first:mt-0'>{children}</h1>
				),
				h2: ({ children }) => (
					<h2 className='text-lg font-bold mb-2 mt-3 first:mt-0'>{children}</h2>
				),
				h3: ({ children }) => (
					<h3 className='text-base font-bold mb-2 mt-2 first:mt-0'>
						{children}
					</h3>
				),
				strong: ({ children }) => (
					<strong className='font-semibold'>{children}</strong>
				),
				em: ({ children }) => <em className='italic'>{children}</em>,
				code: ({ children, className }) => {
					// Check if it's inline code or a code block
					const isInline = !className;
					if (isInline) {
						return (
							<code className='bg-muted px-1.5 py-0.5 rounded text-sm font-mono'>
								{children}
							</code>
						);
					}
					return (
						<code className='block bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto my-2'>
							{children}
						</code>
					);
				},
				pre: ({ children }) => (
					<pre className='bg-muted rounded-md overflow-x-auto my-2'>
						{children}
					</pre>
				),
				blockquote: ({ children }) => (
					<blockquote className='border-l-4 border-muted-foreground/30 pl-4 my-2 italic'>
						{children}
					</blockquote>
				),
				a: ({ href, children }) => (
					<a
						href={href}
						target='_blank'
						rel='noopener noreferrer'
						className='text-primary underline hover:no-underline'
					>
						{children}
					</a>
				),
				table: ({ children }) => (
					<div className='overflow-x-auto my-2'>
						<table className='min-w-full border-collapse border border-muted'>
							{children}
						</table>
					</div>
				),
				th: ({ children }) => (
					<th className='border border-muted bg-muted px-3 py-2 text-left font-semibold'>
						{children}
					</th>
				),
				td: ({ children }) => (
					<td className='border border-muted px-3 py-2'>{children}</td>
				),
				hr: () => <hr className='my-4 border-muted' />,
			}}
		>
			{content}
		</ReactMarkdown>
		</div>
	);
}
