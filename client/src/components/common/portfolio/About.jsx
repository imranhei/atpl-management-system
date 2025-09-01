import { Card, CardHeader, CardTitle } from "@/components/ui/card";


const About = () => {
  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-br from-background dark:to-background to-muted/20 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="h-px bg-primary/30 w-16"></div>
            <h2 className="text-3xl md:text-4xl font-bold mx-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              About Us
            </h2>
            <div className="h-px bg-primary/30 w-16"></div>
          </div>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6 leading-relaxed">
            We are the strategic back office for{" "}
            <span className="font-semibold text-primary">
              Ampec Technologies
            </span>{" "}
            and{" "}
            <span className="font-semibold text-primary">
              Total Electrical Connections Pty Ltd
            </span>
            , providing comprehensive engineering and technical support services
            from our office. Our mission is to deliver exceptional back-office
            solutions that streamline operations, enhance efficiency, and drive
            success for our partner companies across their global operations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary/20 rounded-r"></div>
              <h3 className="text-2xl font-semibold mb-4 pl-4">
                Our Expertise
              </h3>
              <p className="text-muted-foreground pl-4 leading-relaxed">
                We specialize in providing comprehensive back-office support
                services including software development and maintenance, IoT
                solutions implementation, sales support operations, and
                professional electrical design and estimation services. Our team
                of skilled professionals ensures seamless integration with your
                existing operations while delivering cost-effective solutions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group dark:bg-muted-foreground/10">
              <CardHeader className="text-center pb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="text-4xl font-bold text-primary mb-2 relative z-10">
                  4+
                </div>
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground relative z-10">
                  Years Experience
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group dark:bg-muted-foreground/10">
              <CardHeader className="text-center pb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="text-4xl font-bold text-primary mb-2 relative z-10">
                  17
                </div>
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground relative z-10">
                  Talented Professionals
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group dark:bg-muted-foreground/10">
              <CardHeader className="text-center pb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="text-4xl font-bold text-primary mb-2 relative z-10">
                  50,000+
                </div>
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground relative z-10">
                  Orders Fulfilled
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group dark:bg-muted-foreground/10">
              <CardHeader className="text-center pb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="text-4xl font-bold text-primary mb-2 relative z-10">
                  2,000+
                </div>
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground relative z-10">
                  Customers Served
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>

        <div className="mt-16">
          <div className="bg-gradient-to-br from-muted/40 to-muted/10 backdrop-blur-sm rounded-xl p-8 border border-muted/30 shadow-lg">
            <div className="inline-flex items-center justify-center w-full mb-8">
              <div className="h-px bg-primary/20 flex-grow"></div>
              <h3 className="text-2xl font-semibold px-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Our Partner Companies
              </h3>
              <div className="h-px bg-primary/20 flex-grow"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-background/50 backdrop-blur-sm rounded-lg p-6 border border-muted/30 hover:border-primary/30 transition-colors duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <div className="w-6 h-6 rounded-full bg-primary"></div>
                  </div>
                  <h4 className="text-xl font-semibold text-primary">
                    Ampec Technologies
                  </h4>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Ampec is a leading Australian manufacturer specializing in
                  cable harness and box build assembly, delivering high-quality,
                  reliable, and innovative solutions.
                </p>
              </div>

              <div className="bg-background/50 backdrop-blur-sm rounded-lg p-6 border border-muted/30 hover:border-primary/30 transition-colors duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <div className="w-6 h-6 rounded-full bg-primary"></div>
                  </div>
                  <h4 className="text-xl font-semibold text-primary text-wrap">
                    Total Electrical Connections Pty Ltd
                  </h4>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Premier electrical services company offering comprehensive
                  electrical design, estimation, and project management. We
                  support their back-office operations with expert electrical
                  engineering services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;