import React from 'react';
import product from '../product';

const Image = () => {
    return (
        <div style={{ overflow: 'hidden', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
            <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '100%', height: '200px', objectFit: 'cover', transition: 'transform 0.3s ease' }} 
                className="product-image"
            />
        </div>
    );
};

export default Image;
