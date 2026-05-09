import { FadeUp } from "@/components/magicui/fade-up";
import { Car, Leaf, ShieldCheck, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function Features() {
    return (
        <section id="features" className="py-24 md:py-32 bg-[#0a0a0a] text-white relative z-20 mt-8 sm:mt-0">
            <div className="container max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Why choose Raastah?</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Built specifically for students, prioritizing safety, affordability, and convenience.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            icon: ShieldCheck,
                            title: "Verified Students Only",
                            description: "Every user must verify their student email (.edu) and university ID before riding."
                        },
                        {
                            icon: CreditCard,
                            title: "Cashless & Split Fares",
                            description: "Fares are automatically calculated and split evenly. No awkward cash exchanges."
                        },
                        {
                            icon: Leaf,
                            title: "Eco-Friendly",
                            description: "Reduce the number of cars on the road and lower your campus's carbon footprint."
                        },
                        {
                            icon: Car,
                            title: "Schedule in Advance",
                            description: "Post your class schedule and find recurring rides for the entire semester."
                        }
                    ].map((feature, i) => (
                        <FadeUp key={i} delay={0.1 * i} className="h-full">
                            <Card className="h-full border-white/10 bg-[#111] text-white backdrop-blur-sm transition-colors hover:bg-[#1a1a1a] p-2 sm:p-0">
                                <CardHeader>
                                    <div className="h-12 w-12 rounded-lg bg-[#d4ff00]/10 flex items-center justify-center mb-4">
                                        <feature.icon className="h-6 w-6 text-[#d4ff00]" />
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-zinc-400 text-base">{feature.description}</CardDescription>
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
