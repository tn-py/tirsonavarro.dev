import { FloatingDock } from "@/components/FloatingDock";
import { IconHome, IconUser, IconMailSpark, IconBriefcase } from "@tabler/icons-react";
import { SparklesCore } from "@/components/ui/sparkles";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { About } from "../components/About";
import { Projects } from "../components/Projects";
import { Contact } from "../components/Contact";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <TracingBeam className="w-full px-8 md:px-16">
        {/* Hero Section with Sparkles */}
        <section className="relative -mx-8 md:-mx-16 w-screen h-screen flex flex-col items-center justify-center p-24 overflow-hidden">
          <div className="z-10">
            <h1 className="text-6xl md:text-8xl font-extrabold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Tirso Navarro
            </h1>
            <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-8 mx-auto max-w-md">
              <span className="inline-block px-4 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                E-Commerce and Web Development
              </span>
            </p>
          </div>
          
          {/* Sparkles effect - only in hero section */}
          <div className="absolute inset-0 w-full h-full">
            <SparklesCore
              id="tsparticles"
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              particleColor="#8a8a8a"
              particleDensity={70}
              speed={1}
              className="w-full h-full"
            />
          </div>
        </section>
        
        {/* About Section */}
        <About />
        
        {/* Projects Section */}
        <Projects />
        
        {/* Contact Section */}
        <Contact />
      </TracingBeam>

      <FloatingDock
        items={[
          { title: "Home", icon: <IconHome />, href: "/" },
          { title: "About", icon: <IconUser />, href: "#about" },
          { title: "Projects", icon: <IconBriefcase />, href: "#projects" },
          { title: "Get in Contact", icon: <IconMailSpark />, href: "#contact" }
        ]}
        desktopClassName="fixed bottom-8 left-1/2 -translate-x-1/2"
        mobileClassName="fixed bottom-8 right-8"
      />
    </main>
  );
}