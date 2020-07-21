import React from "react";
import PropTypes from "prop-types";
import { DefaultPageTemplate } from "../../templates/default-page";

const DefaultPagePreview = ({ entry, getAsset }) => {
  return (
    <DefaultPageTemplate
      image={getAsset(entry.getIn(["data", "image"]))}
      title={entry.getIn(["data", "title"])}
      subtitle={entry.getIn(["data", "subtitle"])}
      description={entry.getIn(["data", "description"])}
      image={entry.getIn(["data", "image"])}
    />
  );
};

DefaultPagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  getAsset: PropTypes.func,
};

export default DefaultPagePreview;
