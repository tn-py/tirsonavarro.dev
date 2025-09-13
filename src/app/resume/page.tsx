import Link from 'next/link';

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Resume</h1>
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Tirso Navarro</h2>
          <p className="text-lg mb-4">E-Commerce and Web Development</p>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <h3 className="text-xl font-bold mb-2">Experience</h3>
            <p>Placeholder for work experience.</p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <h3 className="text-xl font-bold mb-2">Education</h3>
            <p>Placeholder for education.</p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <h3 className="text-xl font-bold mb-2">Skills</h3>
            <p>Placeholder for skills.</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-500 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
