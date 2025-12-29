import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TaskListSkeleton() {
	return (
		<div className='space-y-6'>
			{/* Stats */}
			<div className='grid gap-4 md:grid-cols-4'>
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i}>
						<CardHeader className='pb-2'>
							<Skeleton className='h-4 w-24' />
						</CardHeader>
						<CardContent>
							<Skeleton className='h-8 w-16' />
						</CardContent>
					</Card>
				))}
			</div>

			{/* Table */}
			<Card>
				<CardContent className='p-0'>
					<div className='space-y-4 p-4'>
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className='flex items-center gap-4'>
								<Skeleton className='h-4 w-4 rounded' />
								<Skeleton className='h-4 flex-1' />
								<Skeleton className='h-6 w-20' />
								<Skeleton className='h-2 w-24' />
								<Skeleton className='h-4 w-32' />
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
