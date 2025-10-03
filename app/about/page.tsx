import { Sarala } from "next/font/google";
const sarala = Sarala({ weight: "400", subsets: ["latin"] });
export default function About() {
  return (
    <div
      className={`flex min-h-screen w-full items-center justify-center text-3xl leading-relaxed ${sarala.className}`}
    >
      {/* eslint-disable react/no-unescaped-entities */}
      <div className="w-3/5">
        SkillSet was built on a simple idea: talent should never sit on the
        sidelines. Whether you're a designer in Paris, a developer in Lagos, or
        a voice actor in Toronto, the world deserves to see what you can do—and
        you deserve to get paid for it. We created SkillSet as a modern
        marketplace where freelancers and clients meet on equal ground. Clients
        can post projects and connect instantly with skilled professionals,
        while freelancers get the tools they need to showcase their work, build
        lasting relationships, and grow their careers. We care about more than
        just transactions. Our platform is designed to highlight creativity,
        trust, and collaboration. We put transparency first: clear pricing,
        clear timelines, and clear communication. At SkillSet, we believe work
        should fit life—not the other way around. That means giving people
        everywhere the freedom to sell their skills, pursue their passions, and
        shape their own future.
      </div>
    </div>
  );
}
