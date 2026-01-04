export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-dvh w-full h-fit flex justify-center items-center p-4">
      {children}
    </main>
  );
}
