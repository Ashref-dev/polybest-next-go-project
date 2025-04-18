import React from 'react';

function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Welcome to the Content Hub!</h1>
      <p className="text-lg text-center text-gray-700">
        Select a category from the navigation above to browse Series, Anime, or Movies.
      </p>
      <p className="text-sm text-center text-gray-500 mt-8">
        (Data fetched from REST, GraphQL, and SOAP APIs respectively)
      </p>
    </div>
  );
}

export default Home; 