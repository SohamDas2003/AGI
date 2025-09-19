import Link from "next/link";

export default function UnauthorizedPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8">
				<div>
					<div className="mx-auto h-12 w-12 text-red-600">
						<svg
							className="w-full h-full"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.963-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
							/>
						</svg>
					</div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Access Denied
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						You don&apos;t have permission to access this page.
					</p>
				</div>
				<div className="space-y-4">
					<div className="text-center">
						<p className="text-sm text-gray-500">
							This page requires specific permissions that your account
							doesn&apos;t have.
						</p>
					</div>
					<div className="flex flex-col space-y-2">
						<Link
							href="/login"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
							Go to Login
						</Link>
						<Link
							href="/"
							className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
							Go to Home
						</Link>
					</div>
				</div>
				<div className="text-center">
					<p className="text-xs text-gray-400">
						If you believe this is an error, please contact your administrator.
					</p>
				</div>
			</div>
		</div>
	);
}
