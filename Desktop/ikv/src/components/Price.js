import React from 'react';
import product from '../product';
import { Badge } from 'react-bootstrap';

const Price = () => {
    return (
        <div className="mb-2">
            <Badge bg="success" style={{ fontSize: '1.1rem', padding: '10px 15px' }}>
                {product.price}
            </Badge>
        </div>
    );
};

export default Price;
