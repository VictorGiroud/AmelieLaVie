import React from "react";
import Layout from "../components/Layout";

const NotFoundPage = () => (
  <Layout>
    <section className="section section--gradient">
      <div className="container">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <div className="section">
              <h1>404 - Mauvaise route</h1>
              <p>Cette page n'existe pas.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default NotFoundPage;
