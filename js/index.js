const styleTag = document.getElementById("dynamic-style");
styleTag.href = `styles.css?v=${Date.now()}`;
