const toTest = document.getElementsByClassName('level__button');
let m = [];

Array.from(toTest).forEach((btn) => {
    btn.addEventListener("click", function(e) {
        localStorage.clear();
        e.preventDefault();

        const musicList = btn.getElementsByClassName('hidden');

        Array.from(musicList).forEach((track) => {
          m.push(track.textContent);
        });
        localStorage.setItem("linkButtonClicked", JSON.stringify(m));
        location.href = "test.html";
    });
  })