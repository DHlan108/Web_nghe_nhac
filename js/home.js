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

  // Kiểm tra nếu script của trang đó đã tồn tại chưa
  const existingScript = document.querySelector(
    `script[src="${config.jsFile}"]`,
  );

  if (existingScript) {
    // Nếu đã có script (đã từng load), chạy luôn init
    runInit();
  } else {
    // Nếu chưa có, tạo script mới và đợi load xong mới init
    const script = document.createElement("script");
    script.src = config.jsFile;
    script.onload = runInit;
    document.body.appendChild(script);
  }
}
