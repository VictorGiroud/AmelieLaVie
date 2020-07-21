import React from "react";

const FullWidthImage = ({ image, title, subtitle }) => {
  return (
    <div
      className="full-width-image-container margin-top-0"
      style={{
        backgroundImage: `url(${!!image.childImageSharp ? image.childImageSharp.fluid.src : image})`,
      }}
    >
      <div className="full-width">
        <img alt="Illustration" src={!!image.childImageSharp ? image.childImageSharp.fluid.src : image} style={{ visibility: `hidden` }} />
        <div className="full-width-text">
          <h1 className="has-text-weight-bold is-size-2 full-width-text-title">{title}</h1>
          {subtitle && <h2 className="has-text-weight-bold is-size-3 is-inline-block full-width-text-title">{subtitle}</h2>}
        </div>
      </div>
    </div>
  );
};

export default FullWidthImage;
