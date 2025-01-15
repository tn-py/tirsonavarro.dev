import React from "react";
import "../animations/animate.css";
import AnimatedBody from "../animations/AnimatedBody";
import AnimatedTitle from "../animations/AnimatedTitle";

const About = () => {
    return (
        <section
            className="relative z-10 w-full items-center justify-center overflow-hidden bg-[#0E1016] bg-cover bg-center pt-16 pb-36 md:pt-20 md:pb-44 lg:pt-20 lg:pb-56"
            id="about"
        >
            <div className="mx-auto flex w-[90%] flex-col items-center justify-center lg:max-w-[1212.8px]">
                <AnimatedTitle
                    text={"E-commerce & Web Development"}
                    className={
                        "mb-10 text-left text-[40px] font-bold leading-[0.9em] tracking-tighter text-[#e4ded7] sm:text-[45px] md:mb-16 md:text-[60px] lg:text-[80px]"
                    }
                    wordSpace={"mr-[14px]"}
                    charSpace={"mr-[0.001em]"}
                />

                <div className="mx-auto flex w-[100%] flex-col lg:max-w-[1200px] lg:flex-row lg:gap-20">
                    <div className="mb-10 flex w-[100%] flex-col gap-4 text-[18px] font-medium leading-relaxed tracking-wide text-[#e4ded7] md:mb-16 md:gap-6 md:text-[20px] md:leading-relaxed lg:mb-16 lg:max-w-[90%] lg:text-[24px]">
                        <AnimatedBody text="I'm an aspiring Full-Stack Web Developer based in Miami, FL. I have extensive experience in Shopify theme development, specializing in creating seamless digital solutions that enhance user experience and operational efficiency. I'm proficient in building and optimizing Shopify themes, pages, scripts, and automations. Utilizing tools like Shopify Flow and Matrixify, I perform mass uploads and updates to streamline processes and reduce operational costs." />

                        <AnimatedBody
                            delay={0.1}
                            text="Currently, I'm expanding my skill set in Node.js, React.js, Next.js, and exploring AI technologies such as OpenAI, Google Gemini, and Groq AI. I'm also delving into workflow automation tools like Zapier, n8n, and Botpress. Passionate about gaming, tech blogging, and travel, I'm committed to creating solutions that enhance productivity and make a significant impact."
                        />

                        <AnimatedBody
                            delay={0.2}
                            text="Feel free to reach out to discuss web development, AI technologies, or potential collaborations."
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;