// wait for the page to load
$(document).ready(function () {
  console.log("ready!");

  $(document).tooltip();
  $("#tabs").tabs();

  let progressbar = $("#progressbar"),
    progressLabel = $(".progress-label");

  progressbar.progressbar({
    value: 0,
    change: function () {
      progressLabel.text(progressbar.progressbar("value") + "%");
    },
    complete: function () {
      progressLabel.text("Complete!");
    }
  });

  function progress() {
    let total = 0;
    for (let value in values) {
      total += Object.keys(values[value]).length;
    }

    let percentage = (total * 2.6).toFixed(2);

    progressbar.progressbar(
      "value",
      total == 39 ? 100 : parseFloat(percentage)
    );

    CookieUpdate();
  }

  //Track totals
  let totals = {
    Lab: 0,
    Quiz: 0,
    Exam: 0,
    Extra: 0,
    Project: 0,
    Participation: 0
  };

  let fieldDetails = {
    Lab: { max: 10, score: 25, percentage: 30 },
    Quiz: { max: 10, score: 10, percentage: 10 },
    Exam: { max: 2, score: 100, percentage: 30 },
    Extra: { max: 1, score: 25, percentage: 5 },
    Project: { max: 1, score: 100, percentage: 20 },
    Participation: { max: 15, score: 5, percentage: 10 }
  };

  //Track progress and values
  let values = {
    Lab: {},
    Quiz: {},
    Exam: {},
    Extra: {},
    Project: {},
    Participation: {}
  };
  let numbers = [
    "",
    "One ",
    "Two ",
    "Three ",
    "Four ",
    "Five ",
    "Six ",
    "Seven ",
    "Eight ",
    "Nine ",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen"
  ];

  let generateField = function (isEven, fieldType) {
    totals[fieldType]++;

    let html = `
    <tr class="${isEven ? "even" : "odd"} row ${fieldType} dynamic">

    <td >${fieldType} ${numbers[totals[fieldType]]} :
    <input
		type="number"
    title="Please enter your grade here"
    class=${fieldType}
	  />              
     <td style="padding: 12px; width: 100%; min-width: 100px">
        <div class="sliders ${fieldType}"></div>
       </td>

           <td style="padding: 4px">
            Date: <input type="text" class="datePicker" />
       </td>
               
     </tr>
`;

    $(`.row.${fieldType}`).last().after(html);

    $(".sliders").last().slider({
      range: "max",
      min: 0,
      max: fieldDetails[fieldType].score,
      value: 0
    });

    register(fieldType);
  };

  let calculator = function (fieldType) {
    let score = 0;

    let currentField = values[fieldType];
    for (let key in currentField) {
      console.log("Calc", currentField);
      score += parseFloat(currentField[key]);
    }

    score = score / totals[fieldType];
    console.log(score);
    $(`#${fieldType}`).html(score.toFixed(2));

    let labels = $(".card label");

    let finalTotal = 0;
    for (let input of labels) {
      if (input.id == "Total") break;
      let id = input.id;
      let grade = parseFloat(input.textContent) / fieldDetails[id].score;

      finalTotal += grade * fieldDetails[id].percentage;
    }

    console.log("Score:", finalTotal);

    switch (true) {
      case finalTotal >= 90:
        finalTotal = "A";
        break;
      case finalTotal >= 80:
        finalTotal = "B";
        break;
      case finalTotal >= 70:
        finalTotal = "C";
        break;
      case finalTotal >= 60:
        finalTotal = "D";
        break;
      case finalTotal < 60:
        finalTotal = "F";
        break;
      default:
        break;
    }

    $(`#Total`).html(finalTotal);
  };
  let addSlider = function (fieldType) {
    $($(`.sliders.${fieldType}`)).each((index, element) => {
      $($(`.${fieldType} input.datePicker`)[index]).datepicker();

      $(element).slider({
        slide: function (event, ui) {
          $($(`input.${fieldType}`)[index]).val(ui.value);
          values[fieldType][index] = ui.value;
          console.log("Index", values[fieldType][index]);
          progress();
          calculator(fieldType);
        }
      });
    });
  };

  let init = function () {
    for (let type in totals) {
      for (let index = 0; index < fieldDetails[type].max; index++) {
        generateField(index % 2 == 0, type);
      }

      addSlider(type);
    }

    checkCookies();
  };

  let register = function (fieldType) {
    console.log(fieldType);

    let currentRow = $(`.row.dynamic input.${fieldType}`).last();
    currentRow.on("input", function () {
      console.log("value", $(this).val());

      let index = $(`input.${fieldType}`).index($(this));
      console.log("Index", index);
      console.log("value", values[fieldType]);

      values[fieldType][index] = $(this).val();
      progress();
      calculator(fieldType);
    });
  };

  let CookieUpdate = function saveToCookie() {
    console.log(values);
    let data = JSON.stringify(values);
    document.cookie = "assignments=" + data + ";";
  };

  let checkCookies = function () {
    let data;
    let cookies = document.cookie.split("=");
    let cookieIndex = cookies.indexOf("assignments");
    if (cookieIndex >= 0) {
      //Cookies found
      data = JSON.parse(cookies[++cookieIndex]);
      console.log(data);

      values = data;

      progress();

      for (let field in data) {
        let fieldValues = data[field];
        calculator(field);

        for (let index in fieldValues) {
          let value = fieldValues[index];
          $(`input.${field}`)[index].value = value;
        }
      }
    }
  };

  init();
});
