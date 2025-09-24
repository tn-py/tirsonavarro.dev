import Link from 'next/link';

export default function ResumePage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-4xl p-4">
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to Home
        </Link>
      </div>
      <div className="w-full max-w-4xl h-[calc(100vh-6rem)]">
        <iframe
          src="https://TN-Pull-Zone.b-cdn.net/resume.pdf"
          className="w-full h-full"
          title="Tirso Navarro's Resume"
        />
      </div>
    </div>
  );
}
