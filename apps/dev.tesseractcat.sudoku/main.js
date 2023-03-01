window.onload = function () {
  generate("medium", true);
}

function flash() {
  document.documentElement.style = "color:white !important;background-color:black;";
  setTimeout(function () {
    document.documentElement.style = "";
  }, 100);
}

level = ""

function openEntry() {
  //prev_selected = document.getElementsByClassName("selected");
  //for (i = 0; i < prev_selected.length; i++)  {
  //    prev_selected[i].className = prev_selected[i].className.replace(" selected", "");
  //}
  this.classList.toggle("selected");
}

function enterNumber(num) {
  selected = document.querySelectorAll(".selected");

  for (var i = 0; i < selected.length; i++) {
    var e = selected[i];
    if (make_notes.innerHTML != "Number") {
      if (num == "X") {
        e.getElementsByClassName("number")[0].innerHTML = "";
        e.getElementsByClassName("notes")[0].style.display = "block";
      } else {
        e.getElementsByClassName("number")[0].innerHTML = num;
        e.getElementsByClassName("notes")[0].style.display = "none";
      }
    } else {
      if (num == "X") {
        e.getElementsByClassName("notes")[0].innerHTML = "";
      } else if (e.getElementsByClassName("notes")[0].innerHTML.indexOf(num) != -1) {
        e.getElementsByClassName("notes")[0].innerHTML = e.getElementsByClassName("notes")[0].innerHTML.replace(num, "");
      } else {
        e.getElementsByClassName("notes")[0].innerHTML += num;
      }
    }
  }

  for (var i = 0; i < selected.length; i++) {
    var e = selected[i];
    e.classList.remove("selected");
  }
}

function toggleNotes() {
  if (make_notes.innerHTML == "Notes") {
    make_notes.innerHTML = "Number";
  } else {
    make_notes.innerHTML = "Notes";
  }
}

function generate(difficulty, skipConfirm) {
  if (skipConfirm != true) {
    if (!confirm("Really generate new puzzle?")) {
      return;
    }
  }

  selected = document.querySelectorAll(".selected");
  for (var i = 0; i < selected.length; i++) {
    var e = selected[i];
    e.classList.remove("selected");
  }

  tds = document.getElementsByTagName("td");

  level = sudoku.generate(difficulty);

  //Populate table
  num = 0
  for (i = 0; i < tds.length; i++) {
    tds[i].innerHTML = level[num].replace(".", " ");
    if (level[num] == ".") {
      tds[i].dataset.editable = "true";
      tds[i].addEventListener('click', openEntry);
      tds[i].innerHTML = "<span class='notes'></span><span class='number'>" + tds[i].innerHTML + "</span>";
    } else {
      tds[i].dataset.editable = "false";
      tds[i].removeEventListener('click', openEntry);
    }
    num++;
  }
}

function solve() {
  solution = sudoku.solve(level);
  tds = document.getElementsByTagName("td");
  num = 0
  for (i = 0; i < tds.length; i++) {
    if (tds[i].dataset.editable == "true") {
      if (tds[i].getElementsByClassName("number")[0].innerHTML != solution[num].replace(".", " ")) {
        alert("Incorrect!");
        return;
      }
    }
    num++;
  }
  alert("Correct!");
}