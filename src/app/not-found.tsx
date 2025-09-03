import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
			<div className="max-w-3xl w-full bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
				<div className="p-8 md:p-12 text-center">
					<div className="text-6xl font-extrabold text-blue-600">404</div>
					<h1 className="mt-4 text-2xl font-semibold text-gray-900">
						Page not found
					</h1>
					<p className="mt-2 text-gray-600">
						The page you are looking for does not exist or has been moved.
					</p>

					<div className="mt-6 flex items-center justify-center gap-3">
						<Link
							href="/dashboard"
							className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
							<ArrowLeft className="w-4 h-4" />
							Back to dashboard
						</Link>

						<Link
							href="/"
							className="inline-flex items-center gap-2 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">
							Home
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
