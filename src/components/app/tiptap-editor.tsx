"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";
import {
	Bold,
	Italic,
	List,
	ListOrdered,
	ListChecks,
	Heading1,
	Heading2,
	Undo,
	Redo,
	Strikethrough,
	Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
	content: string;
	onChange: (content: string, html: string) => void;
	className?: string;
	editable?: boolean;
}

export function TiptapEditor({
	content,
	onChange,
	className,
	editable = true,
}: TiptapEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3],
				},
			}),
			TaskList,
			TaskItem.configure({
				nested: true,
			}),
			Typography,
			Placeholder.configure({
				placeholder: "Start writing your memory... (Supports Markdown)",
			}),
		],
		content,
		editable,
		onUpdate: ({ editor }) => {
			onChange(editor.getText(), editor.getHTML());
		},
		editorProps: {
			attributes: {
				class:
					"prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] p-3",
			},
			// Handle paste to preserve formatting
			handlePaste: (view, event, slice) => {
				// Let Tiptap handle the paste naturally - it preserves HTML/MD formatting
				return false;
			},
		},
	});

	if (!editor) {
		return null;
	}

	return (
		<div className={cn("border rounded-lg overflow-hidden", className)}>
			{editable && (
				<>
					<div className='flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50'>
						<Button
							type='button'
							variant='ghost'
							size='icon'
							className='h-8 w-8'
							onClick={() => editor.chain().focus().toggleBold().run()}
							data-active={editor.isActive("bold")}
						>
							<Bold className='h-4 w-4' />
						</Button>
						<Button
							type='button'
							variant='ghost'
							size='icon'
							className='h-8 w-8'
							onClick={() => editor.chain().focus().toggleItalic().run()}
							data-active={editor.isActive("italic")}
						>
							<Italic className='h-4 w-4' />
						</Button>
						<Button
							type='button'
							variant='ghost'
							size='icon'
							className='h-8 w-8'
							onClick={() => editor.chain().focus().toggleStrike().run()}
							data-active={editor.isActive("strike")}
						>
							<Strikethrough className='h-4 w-4' />
						</Button>
						<Button
							type='button'
							variant='ghost'
							size='icon'
							className='h-8 w-8'
							onClick={() => editor.chain().focus().toggleCode().run()}
							data-active={editor.isActive("code")}
						>
							<Code className='h-4 w-4' />
						</Button>

						<Separator orientation='vertical' className='h-6 mx-1' />

						<Button
							type='button'
							variant='ghost'
							size='icon'
							className='h-8 w-8'
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 1 }).run()
							}
							data-active={editor.isActive("heading", { level: 1 })}
						>
							<Heading1 className='h-4 w-4' />
						</Button>
						<Button
							type='button'
							variant='ghost'
							size='icon'
							className='h-8 w-8'
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 2 }).run()
							}
							data-active={editor.isActive("heading", { level: 2 })}
						>
							<Heading2 className='h-4 w-4' />
						</Button>

						<Separator orientation='vertical' className='h-6 mx-1' />

						<Button
							type='button'
							variant='ghost'
							size='icon'
							className='h-8 w-8'
							onClick={() => editor.chain().focus().toggleBulletList().run()}
							data-active={editor.isActive("bulletList")}
						>
							<List className='h-4 w-4' />
						</Button>
						<Button
							type='button'
							variant='ghost'
							size='icon'
							className='h-8 w-8'
							onClick={() => editor.chain().focus().toggleOrderedList().run()}
							data-active={editor.isActive("orderedList")}
						>
							<ListOrdered className='h-4 w-4' />
						</Button>
						<Button
							type='button'
							variant='ghost'
							size='icon'
							className='h-8 w-8'
							onClick={() => editor.chain().focus().toggleTaskList().run()}
							data-active={editor.isActive("taskList")}
						>
							<ListChecks className='h-4 w-4' />
						</Button>

						<Separator orientation='vertical' className='h-6 mx-1' />

						<Button
							type='button'
							variant='ghost'
							size='icon'
							className='h-8 w-8'
							onClick={() => editor.chain().focus().undo().run()}
							disabled={!editor.can().undo()}
						>
							<Undo className='h-4 w-4' />
						</Button>
						<Button
							type='button'
							variant='ghost'
							size='icon'
							className='h-8 w-8'
							onClick={() => editor.chain().focus().redo().run()}
							disabled={!editor.can().redo()}
						>
							<Redo className='h-4 w-4' />
						</Button>
					</div>
				</>
			)}

			<EditorContent editor={editor} />

			<style jsx global>{`
				.ProseMirror ul[data-type="taskList"] {
					list-style: none;
					padding: 0;
				}

				.ProseMirror ul[data-type="taskList"] li {
					display: flex;
					align-items: flex-start;
					gap: 0.5rem;
				}

				.ProseMirror ul[data-type="taskList"] li > label {
					flex: 0 0 auto;
					margin-top: 0.25rem;
				}

				.ProseMirror ul[data-type="taskList"] li > div {
					flex: 1 1 auto;
				}

				.ProseMirror ul[data-type="taskList"] input[type="checkbox"] {
					width: 1rem;
					height: 1rem;
					cursor: pointer;
				}

				.ProseMirror ul[data-type="taskList"] li[data-checked="true"] > div {
					text-decoration: line-through;
					opacity: 0.6;
				}

				[data-active="true"] {
					background-color: hsl(var(--accent));
				}
			`}</style>
		</div>
	);
}
