# PIMAD Presentation — CACIC 2026

This project contains the interactive presentation for the **CACIC 2026** congress. The main goal is to replace traditional static presentations (such as those generated with Beamer or PowerPoint) with a dynamic, navigable, and responsive web platform. Being based on web technologies, it allows for the native embedding of interactive graphics, complex animations, and real-time data visualizations.


## Technologies Used

* **Reveal.js**: Presentation engine that provides the slide system, routing, transitions, and advanced tools such as the "Speaker View".
* **HTML and CSS**: Complete structure and design, including native support for Light/Dark Mode managed entirely through CSS variables.
* **Vanilla JavaScript**: Logic for the results tab system and theme selector.
* **D3.js**: Visualization engine used for the interactive node network animation on the cover slide.
* **Lottie Web**: Integration of vector animations exported in JSON.
* **R (Plotly & htmlwidgets)**: The graphs of the experimental results were generated in R and exported as interactive HTML widgets, which are seamlessly integrated using iframes.
