import { FadeUp } from "@/components/magicui/fade-up";
import { Leaf, ShieldCheck, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
    {
        icon: ShieldCheck,
        title: "Verified Students Only",
        description:
            "Every rider and passenger is verified before joining Raastah.",
    },
    {
        icon: CreditCard,
        title: "Fair Student Pricing",
        description:
            "Smart fare estimates and shared ride costs make daily campus travel easier to afford.",
    },
    {
        icon: Leaf,
        title: "Smarter Campus Travel",
        description:
            "Share rides with students going the same way and reduce extra vehicles around campus.",
    },
];

function Features() {
    return (
        <section id="features" className="relative bg-[#050505] py-24 text-white md:py-32">
            <div className="container max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
                <FadeUp delay={0.05}>
                    <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Why Choose Raastah?</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Built specifically for students, prioritizing safety, affordability, and convenience.
                    </p>
                    </div>
                </FadeUp>

                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
                    {features.map((feature, i) => (
                        <FadeUp key={feature.title} delay={0.1 * i} className="h-full">
                            <Card className="group h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#d4ff00]/40 hover:bg-white/[0.07]">
                                <CardHeader>
                                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d4ff00]/10 transition-colors group-hover:bg-[#d4ff00]/20">
                                        <feature.icon className="h-6 w-6 text-[#d4ff00]" />
                                    </div>

                                    <CardTitle className="text-xl font-semibold tracking-tight">
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <CardDescription className="text-base leading-relaxed text-zinc-400">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </FadeUp>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features
