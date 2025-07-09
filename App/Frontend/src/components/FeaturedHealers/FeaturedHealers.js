import React from 'react';

const FeaturedHealers = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: '50vh', padding: '2rem', backgroundColor: '#f8f9fa' }}
    >
      <div
        style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          color: '#1ABC9C',
          paddingBottom: '1rem',
        }}
      >
        Featured Healers
      </div>

      <div
        id="carouselFeaturedHealers"
        className="carousel slide"
        data-bs-ride="carousel"
        style={{ maxWidth: '540px' }}
      >
        <div className="carousel-inner text-center">

          {/* First Slide */}
          <div className="carousel-item active">
            <div className="card mb-3" style={{ maxWidth: '540px', margin: '0 auto' }}>
              <div className="row g-0">
                <div className="col-md-4">
                  <img src="https://via.placeholder.com/150" className="img-fluid rounded-start" alt="..." />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">Healer One</h5>
                    <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                    <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Slide */}
          <div className="carousel-item">
            <div className="card mb-3" style={{ maxWidth: '540px', margin: '0 auto' }}>
              <div className="row g-0">
                <div className="col-md-4">
                  <img src="https://via.placeholder.com/150" className="img-fluid rounded-start" alt="..." />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">Healer Two</h5>
                    <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                    <p className="card-text"><small className="text-body-secondary">Last updated 5 mins ago</small></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Third Slide */}
          <div className="carousel-item">
            <div className="card mb-3" style={{ maxWidth: '540px', margin: '0 auto' }}>
              <div className="row g-0">
                <div className="col-md-4">
                  <img src="https://via.placeholder.com/150" className="img-fluid rounded-start" alt="..." />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">Healer Three</h5>
                    <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                    <p className="card-text"><small className="text-body-secondary">Last updated 10 mins ago</small></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselFeaturedHealers"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselFeaturedHealers"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default FeaturedHealers;

