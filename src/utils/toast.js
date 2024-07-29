export function showToast(message, type) {
  const toast = document.getElementById("toast");
  toast.className = `show ${type}`;
  toast.innerText = message;

  setTimeout(() => {
    toast.className = toast.className.replace("show", "").trim();
  }, 3000);
}