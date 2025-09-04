import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import iot_icon from "../../../assets/iot.png";

const Services = () => {
  const services = [
    {
      title: "Software Support",
      description:
        "We provide comprehensive software support with maintenance, bug fixes, performance optimization to keep your systems running smoothly.",
      icon: "💻",
      features: [
        "Application Maintenance",
        "Performance Optimization",
        "Bug Fixes & Updates",
        "User Training & Documentation",
      ],
    },
    {
      title: "IoT Development",
      description:
        "We deliver end-to-end IoT solutions, from device programming to cloud integration, enabling real-time monitoring, data collection, and automated control across industries.",
      icon: iot_icon,
      features: [
        "Device Programming",
        "Sensor Integration",
        "Real-time Monitoring Solutions",
        "Automation & AI Integration",
      ],
    },
    {
      title: "Sales Support",
      description:
        "We offer professional sales support including CRM management, process optimization, and lead generation to drive business growth and improve performance.",
      icon: "📈",
      features: [
        "CRM Management",
        "Sales Process Optimization",
        "Lead Generation Support",
        "Sales Analytics & Reporting",
      ],
    },
    {
      title: "Electrical Design & Estimation",
      description:
        "We deliver electrical design and estimation for all project types, with detailed plans, load calculations, and cost estimates.",
      icon: "⚡",
      features: [
        "Electrical System Design & Estimation",
        "AutoCAD Drafting",
        "Project Documentation",
        "Compliance Checking",
      ],
    },
    {
      title: "Technical Documentation",
      description:
        "We provide technical documentation services including manuals, specifications, API docs, and training materials to ensure clarity and completeness.",
      icon: "📋",
      features: [
        "User Manuals",
        "System Specifications",
        "Training Materials",
        "Process Documentation",
      ],
    },
    {
      title: "Project Management Support",
      description:
        "We offer project management support with planning, scheduling, resource allocation, and tracking to ensure timely, on-budget delivery.",
      icon: "📊",
      features: [
        "Project Planning",
        "Resource Allocation",
        "Progress Tracking",
        "Stakeholder Communication",
      ],
    },
  ];

  return (
    <section id="services" className="py-20 bg-muted/20 dark:bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Core Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            As the strategic back office for Ampec Technologies and Total
            Electrical Connections Pty Ltd, we provide specialized services that
            support their global operations from our center in Uttara,
            Dhaka-1230, Bangladesh.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="h-full hover:shadow-lg dark:bg-muted-foreground/10 transition-shadow duration-300"
            >
              <CardHeader className="p-4">
                <div className="text-4xl mb-2">
                  {service.icon.startsWith("/") ||
                  service.icon.includes(".") ? (
                    <img
                      src={service.icon}
                      alt={service.title}
                      className="w-12 h-12"
                    />
                  ) : (
                    service.icon
                  )}
                </div>

                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <CardDescription className="text-base mb-4">
                  {service.description}
                </CardDescription>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-primary">
                    Key Features:
                  </h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="text-sm text-muted-foreground flex items-start"
                      >
                        <span className="text-primary mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16">
          <div className="bg-background rounded-lg p-8 border">
            <h3 className="text-2xl font-semibold mb-6 text-center">
              Service Integration
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-3 text-primary">
                  For Ampec Technologies
                </h4>
                <p className="text-muted-foreground mb-4">
                  We provide specialized back-office support focusing on
                  software development, IoT solutions services. Our team works
                  seamlessly with their development teams to ensure continuous
                  delivery and support.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Sales Support</Badge>
                  <Badge variant="secondary">Software Development</Badge>
                  <Badge variant="secondary">IoT Solutions</Badge>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3 text-primary">
                  For Total Electrical Connections Pty Ltd
                </h4>
                <p className="text-muted-foreground mb-4">
                  We deliver comprehensive electrical design and estimation
                  services, project management support, and sales assistance.
                  Our expertise in electrical engineering ensures accurate and
                  efficient project delivery.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Electrical Design</Badge>
                  <Badge variant="secondary">Cost Estimation</Badge>
                  <Badge variant="secondary">Project Management</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
