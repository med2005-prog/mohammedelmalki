import React from 'react';
import product from '../product';

const Description = () => {
    return <p className="text-muted" style={{ fontSize: '0.95rem' }}>{product.description}</p>;
};

export default Description;
