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
    console.log(total);
    let percentage = (total * 2.6).toFixed(2);
    console.log(percentage);

    progressbar.progressbar(
      "value",
      total == 39 ? 100 : parseFloat(percentage)
    );
  }

  let totals = {
    Lab: 0,
    Quiz: 0,
    Exam: 0,
    Project: 0,
    Participation: 0
  };

  let values = {
    Lab: {},
    Quiz: {},
    Exam: {},
    Project: {},
    Extra: {},
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
    "Ten"
  ];

  let generateField = function (isEven, fieldType) {
    totals[fieldType]++;

    let html = `
    <tr class="${isEven ? "even" : "odd"} row ${fieldType}">

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
      max: 25,
      value: 0
    });

    register(fieldType);
  };

  let addSlider = function (fieldType) {
    $($(`.sliders.${fieldType}`)).each((index, element) => {
      $($(`.${fieldType} input.datePicker`)[index]).datepicker();

      $(element).slider({
        slide: function (event, ui) {
          $($(`input.${fieldType}`)[index]).val(ui.value);
          values[fieldType][index] = ui.value;
          console.log("Index", values[fieldType][index]);
          progress(fieldType);
        }
      });
    });
  };

  let init = function () {
    for (let type in totals) {
      console.log("type", type);
      if (type == "Exam") break;

      for (let index = 0; index < 4; index++) {
        generateField(index % 2 == 0, type);
      }

      addSlider(type);
    }
  };

  let register = function (fieldType) {
    //console.log(fieldName);
    //console.log($(".row." + fieldName).last());
    let currentRow = $(".row").last();
    currentRow.on("input", function () {
      console.log("value", $(this).val());
      // console.log("value", $(this));

      let index = $(".Lab").index($(this));

      values[fieldType][index] = $(this).val();
      progress(fieldType);

      let fields = $(`.row.${fieldType} input`);
      // let values = 0;
      // for (let input of fields) {
      //   values += isNaN(parseFloat(input.value)) ? 0 : parseFloat(input.value);
      // }

      // let score = values / totals[fieldName];
      // $(`#${fieldName}`).html(score.toFixed(2));

      let labels = $(".card label");
      let finalTotal = 0;
      for (let input of labels) {
        if (input == labels[5]) {
          //alert("Break");
          break;
        }
        finalTotal += isNaN(parseFloat(input.textContent))
          ? 0
          : parseFloat(input.textContent);
      }
      $(`#Total`).html(finalTotal.toFixed(2));
    });
  };

  init();
});
