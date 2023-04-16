window.addEventListener("load", function () {
    setTimeout(
      function open(event) {
        document.querySelector(".popup").style.display = "block";
      },
      100
    )
  });
  document.querySelector("#close").addEventListener("click", function () {
    document.querySelector(".popup").style.display = "none";
  });
  document.querySelector("#closed").addEventListener("click", function () {
    document.querySelector(".popup").style.display = "none";
  });