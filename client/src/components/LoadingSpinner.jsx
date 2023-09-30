export default function LoadingSpinner() {
  return (
    <main className="h-screen flex items-center justify-center bg-black/10 opacity-95">
      <div className="inset-0">
        <div className="animate-spin border-gray-900 border-t-2 border rounded-full w-16 h-16"></div>
      </div>
    </main>
  );
}
