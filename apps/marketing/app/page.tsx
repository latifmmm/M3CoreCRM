export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          M3Core CRM
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Professional Real Estate Management Platform
        </p>
        <div className="space-x-4">
          <a
            href={process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </a>
          <a
            href="#features"
            className="inline-block px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Learn More
          </a>
        </div>
      </div>
    </main>
  );
}