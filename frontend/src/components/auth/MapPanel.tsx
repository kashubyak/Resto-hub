'use client'

import { MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'
import { LocationSearch } from './LocationSearch'

const Map = dynamic(
	() => import('./Map').then((m) => ({ default: m.Map })),
	{ ssr: false },
)

interface Location {
	lat: number
	lng: number
	address: string
}

interface MapPanelProps {
	step: number
	location: Location | null
	onLocationSelect: (lat: number, lng: number, address: string) => void
	onLocationClear: () => void
	onChangeLocation: () => void
	error?: string
}

export function MapPanel({
	step,
	location,
	onLocationSelect,
	onLocationClear,
	onChangeLocation,
	error,
}: MapPanelProps) {
	return (
		<div className="hidden md:flex md:flex-col md:gap-4 w-full min-h-0 h-full">
			<div className="bg-card rounded-2xl sm:rounded-3xl shadow-lg border border-border/50 p-4 sm:p-6 backdrop-blur-sm flex-shrink-0">
				{step === 0 ? (
					<LocationSearch
						onLocationSelect={onLocationSelect}
						selectedLocation={location?.address}
						onClear={onLocationClear}
						error={error}
					/>
				) : (
					<div className="space-y-2">
						<label className="block text-sm font-medium text-card-foreground">
							Company location
						</label>
						{location && (
							<>
								<div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
									<div className="flex items-start gap-2 flex-1 min-w-0">
										<MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
										<div className="min-w-0 flex-1">
											<div className="text-xs text-muted-foreground mb-0.5">
												Selected:
											</div>
											<div className="text-sm text-foreground break-words">
												{location.address}
											</div>
										</div>
									</div>
									<button
										type="button"
										onClick={onChangeLocation}
										className="ml-2 text-xs text-primary hover:text-primary-hover font-medium transition-colors flex-shrink-0"
									>
										Change
									</button>
								</div>
								<p className="text-xs text-muted-foreground">
									Your company location is confirmed
								</p>
							</>
						)}
					</div>
				)}
			</div>

			{/* Map fills remaining height */}
			<div className="w-full flex-1 min-h-0 rounded-2xl lg:rounded-3xl overflow-hidden">
				<Map
					center={location ? [location.lat, location.lng] : undefined}
					marker={location ? [location.lat, location.lng] : undefined}
					onLocationSelect={step === 0 ? onLocationSelect : undefined}
				/>
			</div>
		</div>
	)
}
