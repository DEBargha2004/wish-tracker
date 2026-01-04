import Navbar from "@/components/custom/navbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto min-h-dvh">
      <Navbar className="h-16" />
      <div className="md:w-2xl mx-auto py-10 px-4">{children}</div>
    </div>
  );
}
