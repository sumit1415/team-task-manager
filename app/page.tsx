import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex-col">
        <h1 className="text-4xl font-bold text-center mb-8">Team Task Manager</h1>
        <p className="text-center text-muted-foreground mb-8">
          Enterprise-grade task management system
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            Login
          </Link>
          <Link href="/register" className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
