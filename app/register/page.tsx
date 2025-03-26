import { SignUp } from "@/components/SignUp";


export default function Home() {
  return (
    <div className="bg-black grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={0}
        className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
      <SignUp />
      </main>
    </div>
  );
}
