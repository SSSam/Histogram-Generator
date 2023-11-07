document.getElementById("fileUpload").addEventListener("change", handleFileSelect, false);
document.querySelectorAll(".bounds").forEach((input) => {
  input.addEventListener("input", inputValidation);
  input.addEventListener("input", updateHistogram); 
  input.addEventListener("input", updateStats); 
});

let students = [];
function handleFileSelect(event) {
  const reader = new FileReader();
  reader.onload = handleFileLoad;
  reader.readAsText(event.target.files[0]);
}

function parseCSV(data) {
  const rows = data.trim().split("\n");
  students = rows.reduce((acc, row) => {
    const [name, gradeString] = row.split(",");
    const grade = parseFloat(gradeString.trim());
    if (!isNaN(grade)) {
      acc.push({
        name: name.trim(),
        grade: grade,
      });
    }
    return acc;
  }, []);
}

function messagePOP(warning){
  const msgBOX= document.getElementById("messageBOX");
  msgBOX.textContent=warning;
  msgBOX.style.display= 'block';
  setTimeout(() =>{
    msgBOX.style.display= 'none';
  }, 4000);
}

function updateStats() {
  let total = 0;
  let highest = -Infinity;
  let lowest = Infinity;
  let highStudent = null;
  let lowStudent = null;
  const gradeMax = parseFloat(document.getElementById("gradeMax").value);
  const gradeMin = parseFloat(document.getElementById("gradeF").value);
  students.forEach((student) => {
    const grade = student.grade;
    if ((grade > gradeMax) | (grade < gradeMin)) {
      messagePOP("Input grade exceeds value bounds")
    }
    if (grade > highest & grade < gradeMax) {
      highest = grade;
      highStudent = student;
    }
    if (grade < lowest & grade > gradeMin) {
      lowest = grade;
      lowStudent = student;
    }
    total += grade;
  });
  const mean = total / students.length;
  students.sort((a, b) => a.grade - b.grade);
  const middle = Math.floor(students.length / 2);
  const median = students.length % 2 === 0 ? (students[middle - 1].grade + students[middle].grade) / 2 : students[middle].grade;
  document.getElementById("highest").textContent = `${highStudent.name} (${highStudent.grade}%)`;
  document.getElementById("lowest").textContent = `${lowStudent.name} (${lowStudent.grade}%)`;
  document.getElementById("mean").textContent = mean.toFixed(2);
  document.getElementById("median").textContent = median.toFixed(2);
}


function inputValidation() {
  const gradeMax = parseFloat(document.getElementById("gradeMax").value);
  const gradeMin = parseFloat(document.getElementById("gradeF").value);
  const bounds ={
    AP: parseFloat(document.getElementById("gradeAP").value),
    A: parseFloat(document.getElementById("gradeA").value),
    AM: parseFloat(document.getElementById("gradeAM").value),
    BP: parseFloat(document.getElementById("gradeBP").value),
    B: parseFloat(document.getElementById("gradeB").value),
    BM: parseFloat(document.getElementById("gradeBM").value),
    CP: parseFloat(document.getElementById("gradeC+").value),
    C: parseFloat(document.getElementById("gradeC").value),
    CM: parseFloat(document.getElementById("gradeCM").value),
    D: parseFloat(document.getElementById("gradeD").value)
  };  
  validation= true;
  document.querySelectorAll(".bounds").forEach((input) => {
    input.classList.remove("invalid");
  });
  function highlightInvalidInput(elementId) {
    const elem = document.getElementById(elementId);
    elem.classList.add("invalid");
    setTimeout(() => {
        elem.classList.remove("invalid");
    }, 3000);
}

  const gradesOrder = ["Max", "AP", "A", "AM", "BP", "B", "BM", "CP", "C", "CM", "D", "F"];
  for (let grade in bounds) {
    if (bounds[grade] > gradeMax) {
      highlightInvalidInput("grade"+grade);
      messagePOP("Maximum grade should be the largest number.");
      validation= false;
    }
    if (bounds[grade] < gradeMin) {
      highlightInvalidInput("grade"+grade);
      messagePOP("grade F should contain the lowest greade.");
      validation= false;
    }
  }
  for (let i = 0; i < gradesOrder.length - 1; i++) {
    if (bounds[gradesOrder[i]] < bounds[gradesOrder[i + 1]]) {
      highlightInvalidInput("grade" + gradesOrder[i]);
      highlightInvalidInput("grade" + gradesOrder[i+1]);
      messagePOP("A+ -> F, grades go in descending order.");
      validation= false;
    }
  }
  return validation;

}

function updateHistogram() {
  if (students.length === 0) {
    return;
  }
  const bounds = {
    AP: parseFloat(document.getElementById("gradeAP").value),
    A: parseFloat(document.getElementById("gradeA").value),
    AM: parseFloat(document.getElementById("gradeAM").value),
    BP: parseFloat(document.getElementById("gradeBP").value),
    B: parseFloat(document.getElementById("gradeB").value),
    BM: parseFloat(document.getElementById("gradeBM").value),
    CP: parseFloat(document.getElementById("gradeC+").value),
    C: parseFloat(document.getElementById("gradeC").value),
    CM: parseFloat(document.getElementById("gradeCM").value),
    D: parseFloat(document.getElementById("gradeD").value),
    F: parseFloat(document.getElementById("gradeF").value),
  };
  const counts = {
    AP: 0,
    A: 0,
    AM: 0,
    BP: 0,
    B: 0,
    BM: 0,
    CP: 0,
    C: 0,
    CM: 0,
    D: 0,
    F: 0,
  };
  students.forEach((student) => {
    for (let grade in bounds) {
      if (student.grade >= bounds[grade]) {
        counts[grade]++;
        break;
      }
    }
  });
  const emojiList = ["🧑🏻‍🎓", "🧑🏽‍🎓", "🧑🏿‍🎓", "👨🏿‍🎓", "👨🏽‍🎓", "👨🏻‍🎓", "👩🏿‍🎓", "👩🏽‍🎓", "🧑🏼‍🎓", "🧑🏾‍🎓", "👩🏻‍🎓", "👨🏼‍🎓", "👩🏾‍🎓", "👩🏼‍🎓", "👨🏾‍🎓"];
  function getRandomEmoji() {
    const randomIndex = Math.floor(Math.random() * emojiList.length);
    return emojiList[randomIndex];
  }
  for (let grade in counts) {
    let emojiString = "";
    if (grade === "F") {
      emojiString = "❌".repeat(counts[grade]);
    } else {
      for (let i = 0; i < counts[grade]; i++) {
        emojiString += getRandomEmoji();
      }
    }
    document.getElementById(grade).textContent = emojiString;
  }
}

function handleFileLoad(event) {
  const content = event.target.result;
  parseCSV(content);
  updateStats();
  updateHistogram();
}
