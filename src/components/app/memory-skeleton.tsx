"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function MemoryCardSkeleton() {
	return (
		<Card className='h-full'>
			<CardHeader className='pb-2'>
				<div className='flex items-start justify-between'>
					<div className='space-y-2 flex-1'>
						<Skeleton className='h-5 w-3/4' />
						<Skeleton className='h-3 w-1/2' />
					</div>
					<Skeleton className='h-8 w-8 rounded-md' />
				</div>
			</CardHeader>
			<CardContent>
				<div className='space-y-2'>
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-2/3' />
				</div>
				<div className='flex gap-1 mt-4'>
					<Skeleton className='h-5 w-16 rounded-full' />
					<Skeleton className='h-5 w-12 rounded-full' />
					<Skeleton className='h-5 w-20 rounded-full' />
				</div>
			</CardContent>
		</Card>
	);
}

export function MemoryGridSkeleton({ count = 6 }: { count?: number }) {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
			{Array.from({ length: count }).map((_, i) => (
				<MemoryCardSkeleton key={i} />
			))}
		</div>
	);
}

export function MemoriesViewSkeleton() {
	return (
		<div className='flex h-full gap-6'>
			{/* Left side - Memories skeleton */}
			<div className='w-[60%] flex flex-col h-full'>
				<div className='flex items-center justify-between mb-6'>
					<Skeleton className='h-8 w-48' />
					<div className='flex gap-2'>
						<Skeleton className='h-10 w-32' />
						<Skeleton className='h-10 w-32' />
					</div>
				</div>
				<div className='flex gap-2 mb-4'>
					<Skeleton className='h-10 w-20' />
					<Skeleton className='h-10 w-24' />
					<Skeleton className='h-10 w-20' />
				</div>
				<MemoryGridSkeleton count={6} />
			</div>

			{/* Right side - Chat skeleton */}
			<div className='w-[40%] h-full'>
				<Card className='h-full flex flex-col'>
					<CardHeader className='pb-3 border-b'>
						<Skeleton className='h-6 w-32' />
					</CardHeader>
					<CardContent className='flex-1 flex flex-col p-0'>
						<div className='flex-1 p-4 space-y-4'>
							<div className='flex gap-3'>
								<Skeleton className='h-8 w-8 rounded-full' />
								<div className='space-y-2 flex-1'>
									<Skeleton className='h-4 w-3/4' />
									<Skeleton className='h-4 w-1/2' />
								</div>
							</div>
							<div className='flex gap-3 justify-end'>
								<div className='space-y-2 flex-1 flex flex-col items-end'>
									<Skeleton className='h-4 w-2/3' />
									<Skeleton className='h-4 w-1/3' />
								</div>
								<Skeleton className='h-8 w-8 rounded-full' />
							</div>
						</div>
						<div className='p-4 border-t'>
							<Skeleton className='h-10 w-full' />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
