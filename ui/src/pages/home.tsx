import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Seo from '../components/Seo';
import Text from "@/components/custom-ui/text";
import Particles from "@/components/custom-ui/particles";
import {
    ArrowRight,
    Heart,
    Shield,
    Clock,
    Users,
    Star,
    Stethoscope,
    Calendar,
    Phone
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
    {
        icon: <Heart className="h-6 w-6" />,
        title: "Atención Personalizada",
        description: "Cuidado médico personalizado para cada paciente con el más alto nivel de profesionalismo."
    },
    {
        icon: <Shield className="h-6 w-6" />,
        title: "Tecnología Avanzada",
        description: "Equipos médicos de última generación para diagnósticos precisos y tratamientos efectivos."
    },
    {
        icon: <Clock className="h-6 w-6" />,
        title: "Horarios Flexibles",
        description: "Horarios de atención amplios para adaptarnos a tu agenda y necesidades."
    },
    {
        icon: <Users className="h-6 w-6" />,
        title: "Equipo Especializado",
        description: "Médicos especialistas con amplia experiencia en diversas áreas de la medicina."
    }
];

const testimonials = [
    {
        content: "Excelente atención médica. El Dr. Cuyún y su equipo son muy profesionales y dedicados.",
        author: "María González",
        role: "Paciente",
        rating: 5
    },
    {
        content: "La mejor clínica de la región. Siempre recibo atención de calidad y con mucha calidez humana.",
        author: "Carlos Rodríguez",
        role: "Paciente",
        rating: 5
    },
    {
        content: "Tecnología moderna y trato humano excepcional. Recomiendo ampliamente esta clínica.",
        author: "Ana Morales",
        role: "Paciente",
        rating: 5
    }
];

export default function Home() {
    return (
        <>
            <Seo
                title="Clínica Médica Cuyún Gaitán - Atención Médica de Calidad"
                description="Clínica médica especializada en brindar atención de calidad con tecnología avanzada y trato humano excepcional."
            />

            {/* Hero Section */}
            <section className="relative w-full overflow-hidden bg-background">
                <div className="absolute inset-0">
                    <Particles />
                </div>
                <div className="relative z-10">
                    <div className="container mx-auto px-4 py-24 md:py-32">
                        <div className="flex flex-col items-center text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="max-w-3xl"
                            >
                                <div className="flex items-center justify-center gap-3 mb-6">
                                    <Stethoscope className="h-12 w-12 text-primary" />
                                    <Text
                                        label="Clínica Médica Cuyún Gaitán"
                                        className="text-3xl md:text-4xl font-bold text-primary"
                                    />
                                </div>
                                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                                    Tu Salud es Nuestra Prioridad
                                </h1>
                                <p className="text-xl text-muted-foreground mb-8">
                                    Brindamos atención médica integral con tecnología avanzada,
                                    profesionalismo y el trato humano que mereces.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link to="/patient">
                                        <Button size="lg" className="bg-primary hover:bg-primary/90">
                                            Gestión de Pacientes
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                    <Button size="lg" variant="outline">
                                        <Phone className="mr-2 h-5 w-5" />
                                        Contactar
                                    </Button>
                                </div>
                            </motion.div>

                            {/* Stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="mb-16 grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 w-full max-w-4xl"
                            >
                                {[
                                    {
                                        number: "15+",
                                        label: "Años de Experiencia",
                                        description: "Sirviendo a la comunidad",
                                        icon: <Heart className="h-6 w-6 text-primary" />
                                    },
                                    {
                                        number: "24/7",
                                        label: "Emergencias",
                                        description: "Atención de urgencias",
                                        icon: <Clock className="h-6 w-6 text-primary" />
                                    },
                                    {
                                        number: "100%",
                                        label: "Compromiso",
                                        description: "Con tu bienestar",
                                        icon: <Shield className="h-6 w-6 text-primary" />
                                    },
                                    {
                                        number: "5000+",
                                        label: "Pacientes",
                                        description: "Atendidos con éxito",
                                        icon: <Users className="h-6 w-6 text-primary" />
                                    }
                                ].map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                        className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 hover:border-primary/20"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            {stat.icon}
                                            <div className="text-3xl font-bold text-primary">{stat.number}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="font-semibold text-foreground">{stat.label}</div>
                                            <div className="text-sm text-muted-foreground">{stat.description}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Nuestros Servicios Médicos
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Atención médica integral para toda la familia
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="text-primary mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Lo Que Dicen Nuestros Pacientes
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Testimonios reales de quienes confían en nosotros
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-card p-6 rounded-lg shadow-sm"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 text-primary fill-primary" />
                                    ))}
                                </div>
                                <p className="text-muted-foreground mb-4">
                                    "{testimonial.content}"
                                </p>
                                <div>
                                    <div className="font-semibold text-foreground">
                                        {testimonial.author}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {testimonial.role}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary/5">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            ¿Necesitas Atención Médica?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8">
                            Estamos aquí para cuidar de tu salud y la de tu familia con el mejor servicio médico.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-primary hover:bg-primary/90">
                                <Calendar className="mr-2 h-5 w-5" />
                                Agendar Cita
                            </Button>
                            <Button size="lg" variant="outline">
                                <Phone className="mr-2 h-5 w-5" />
                                Llamar Ahora
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
