import React from 'react';
import A1 from './images/A1.jpg';
import A3 from './images/A3.jpg';
import {Button} from '../Button/button'

const FeaturedHealers = () => {
  return (
    <div
      className="container py-4"
      style={{
        minHeight: '50vh',
        backgroundColor: '#FFFFFF'
      }}
    >
      <h2
        className="text-center mb-4"
        style={{
          fontWeight: 'bold',
          color: '#1ABC9C'
        }}
      >
        Featured Healers
      </h2>

      {/* cards */}
      <div className="row g-5 justify-content-center">
        <div className="col-12 col-sm-6 col-md-4">
          <div className="card h-100 shadow-sm">
            <img src={A1} alt="Healer 1"/>
            <div className="card-body">
              <h5 className="card-title" style={{fontWeight:'bold'}}>Divyanshu</h5>
              <h6 className="card-subtitle mb-2 text-muted">Spiritual Healer</h6>
              <p className="card-text">
                Divyanshu is a compassionate spiritual healer who guides people on their journey toward inner peace, self-awareness, 
                and emotional healing. Using ancient practices, meditation, and energy work, he helps individuals release negativity,
                align their mind, body, and spirit, and connect with their higher self.
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-4">
          <div className="card h-100 shadow-sm">
            <img src={A3} className="card-img-top" alt="Healer 2" />
            <div className="card-body">
              <h5 className="card-title">Karan</h5>
              <h6 className="card-subtitle mb-2 text-muted">Life Coach</h6>
              <p className="card-text">
                Karan is a dedicated life coach who helps individuals discover their potential, build confidence, 
                set meaningful goals, and overcome challenges through guidance, motivation, and practical strategies for personal and professional growth.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className='d-flex justify-content-center mt-4'>
        <Button className="btn btn-primary px-4 py-2 rounded-pill shadow">
          See More
        </Button>
      </div>
    </div>
  );
};

export default FeaturedHealers;
