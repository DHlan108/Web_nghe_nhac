function triggerPageLogic(url) {
  const pageName = url.split("/").pop().split("?")[0] || "home.html";
  const config = pageConfig[pageName];
  if (!config) return;

  // Hàm thực thi logic
  const runInit = () => {
    if (typeof window[config.initFn] === "function") {
      window[config.initFn]();
    }
  };

  // Kiểm tra script
  const existingScript = document.querySelector(
    `script[src="${config.jsFile}"]`,
  );

  if (existingScript) {
   
    runInit();
  } else {
    
    const script = document.createElement("script");
    script.src = config.jsFile;
    script.onload = runInit;
    document.body.appendChild(script);
  }
}
