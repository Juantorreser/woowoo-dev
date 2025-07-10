import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const FeaturedHealers = () => {
  const cards = [
    { id: 1, title: "Card 1", text: "Some quick example text." },
    { id: 2, title: "Card 2", text: "Some more example text." },
    { id: 3, title: "Card 3", text: "Even more example text." },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevCard = () => {
    setCurrentIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="container py-4">
      <h2
        className="text-center mb-4"
        style={{ fontWeight: "bold", color: "#1ABC9C" }}
      >
        Featured Healers
      </h2>

      {/* Always horizontal row */}
      <div className="d-flex align-items-center justify-content-center flex-wrap gap-2">
        {/* Prev Button */}
        <button
          type="button"
          onClick={prevCard}
          className="btn btn-success"
          style={{ borderRadius: "4px" }}
        >
          &lt;
        </button>

        {/* Card(s) */}
        <div
          className="d-flex justify-content-center flex-wrap gap-3"
          style={{ flex: "1 1 auto", maxWidth: "900px" }}
        >
          {/* On mobile, show only current card; on larger screens, show all */}
          {window.innerWidth < 768
            ? (
              <div
                key={cards[currentIndex].id}
                className="card shadow-sm mx-auto"
                style={{ maxWidth: "300px", minHeight: "150px", flex: "1 1 300px" }}
              >
                <div className="card-body text-center">
                  <h5 className="card-title">{cards[currentIndex].title}</h5>
                  <p className="card-text">{cards[currentIndex].text}</p>
                </div>
              </div>
            )
            : (
              cards.map((card) => (
                <div
                  key={card.id}
                  className="card shadow-sm"
                  style={{ width: "250px", minHeight: "150px" }}
                >
                  <div className="card-body text-center">
                    <h5 className="card-title">{card.title}</h5>
                    <p className="card-text">{card.text}</p>
                  </div>
                </div>
              ))
            )}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={nextCard}
          className="btn btn-info"
          style={{ borderRadius: "4px" }}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default FeaturedHealers;
