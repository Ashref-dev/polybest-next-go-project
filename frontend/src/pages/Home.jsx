import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

function Home() {
  const services = [
    { name: 'Series', path: '/series', description: 'Browse TV Series via REST API', icon: '📺' },
    { name: 'Anime', path: '/anime', description: 'Explore Anime via GraphQL API', icon: '🎌' },
    { name: 'Movies', path: '/movies', description: 'Discover Movies via SOAP API', icon: '🎬' },
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Content Hub!</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Your unified platform for browsing different types of content through various web service technologies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {services.map((service) => (
          <Card key={service.name} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="text-4xl mb-2">{service.icon}</div>
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button asChild>
                <Link to={service.path}>Browse {service.name}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed">
        <CardContent className="pt-6">
          <p className="text-center text-sm text-muted-foreground">
            This application demonstrates integration of REST, GraphQL, and SOAP APIs under a unified gateway.
            <br />
            Each content type is powered by a different API technology.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Home; 