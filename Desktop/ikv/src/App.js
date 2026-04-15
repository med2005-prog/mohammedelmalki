import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container } from 'react-bootstrap';
import Name from './components/Name';
import Price from './components/Price';
import Description from './components/Description';
import Image from './components/Image';
import './App.css';

const firstName = "Mohammed"; // You can change this to your first name, or leave it empty

function App() {
  return (
    <Container className="app-container d-flex flex-column align-items-center justify-content-center min-vh-100 py-5">
      <div className="title-banner mb-5">
        <h1 className="fw-bolder text-white">Product Spotlight</h1>
      </div>

      <Card className="product-card shadow-lg border-0 mb-5" style={{ width: '22rem', borderRadius: '15px' }}>
        <Image />
        <Card.Body className="text-center p-4">
          <Name />
          <Price />
          <Description />
        </Card.Body>
      </Card>
      
      <div className="greeting-section text-center p-4 rounded shadow-sm bg-white" style={{ maxWidth: '400px', width: '100%' }}>
        <h4 className="fw-bold mb-3" style={{ color: '#4a4e69' }}>
          {firstName ? `Hello, ${firstName}!` : "Hello, there!"}
        </h4>
        
        {firstName && (
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
            alt="Greeting profile" 
            className="greeting-image rounded-circle shadow"
            style={{ width: '120px', height: '120px', objectFit: 'cover', border: '4px solid #fff' }}
          />
        )}
      </div>
    </Container>
  );
}

export default App;
