import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PocketListSkeleton() {
	return (
		<div className='space-y-6'>
			<Skeleton className='h-10 w-32' />
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
				{Array.from({ length: 6 }).map((_, i) => (
					<Card key={i}>
						<CardHeader>
							<div className='flex items-start gap-2'>
								<Skeleton className='h-5 w-5 rounded' />
								<div className='space-y-2'>
									<Skeleton className='h-5 w-32' />
									<Skeleton className='h-4 w-48' />
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<Skeleton className='h-4 w-24' />
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
